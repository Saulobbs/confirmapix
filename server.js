

require('dotenv').config()

console.log("🚀 SERVIDOR INICIADO");
process.on('uncaughtException', err => {
  console.error('💥 ERRO CRASH:', err);
});

process.on('unhandledRejection', err => {
  console.error('💥 PROMISE CRASH:', err);
});

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const mongoose = require('mongoose');
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const axios = require("axios");
const { MercadoPagoConfig } = require("mercadopago");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const assinaturaRoutes = require("./routes/assinatura");
const Assinatura = require("./models/Assinatura");
const User = require("./models/User");
const adminRoutes = require("./routes/admin");


app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/assinatura", assinaturaRoutes);
app.use("/admin-api", adminRoutes); 

console.log("🔥 ADMIN API CARREGADA");
app.get("/teste", (req, res) => {
  res.send("TESTE OK");
});

const loginLimiter = rateLimit({

windowMs: 15 * 60 * 1000,

max: 5,

message: "Muitas tentativas. Tente novamente em 15 minutos."

});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
function verificarLogin(req, res, next) {

  if (req.session.logado) {
    return next();
  }

  return res.redirect("/login");
}


async function salvarLog(tipo, mensagem, req) {

try {

await LogModel.create({

tipo,

mensagem,

ip: req.ip

});

} catch (err) {

console.log("Erro log:", err);
console.error(err);

}

}

const ipsBloqueados = {};
const tentativasLogin = {};

function verificarIP(req, res, next) {

const ip = req.ip;

if (ipsBloqueados[ip]) {

return res.send(
"IP bloqueado temporariamente."
);

}

next();

}

// 🔐 CRIPTOGRAFIA TOKEN

function criptografar(texto) {

  const iv = crypto.randomBytes(16);

  const chave = crypto
    .createHash("sha256")
    .update(process.env.TOKEN_SECRET)
    .digest();

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    chave,
    iv
  );

  let criptografado =
    cipher.update(texto, "utf8", "hex");

  criptografado += cipher.final("hex");

  return iv.toString("hex") + ":" + criptografado;
}

function descriptografar(texto) {

  const partes = texto.split(":");

  const iv = Buffer.from(partes[0], "hex");

  const chave = crypto
    .createHash("sha256")
    .update(process.env.TOKEN_SECRET)
    .digest();

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    chave,
    iv
  );

  let descriptografado =
    decipher.update(partes[1], "hex", "utf8");

  descriptografado += decipher.final("utf8");

  return descriptografado;
}
const Pagamento = require("./models/pagamento");

const Merchant = require("./models/merchant");
const LogModel = require("./models/log");




// 🔥 CONEXÃO MONGO

console.log("MONGO_URI:");
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("🔥 MongoDB conectado"))
.catch(err => console.error(err));
  


// 🔥 ROTA INICIAL (FORMULÁRIO)
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Gerar PIX</title>

    <style>
      body {
        margin: 0;
        font-family: Arial;
        background: linear-gradient(135deg, #141e30, #243b55);
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .box {
        background: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        width: 320px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.3);
      }

      input {
        width: 100%;
        padding: 12px;
        margin-top: 15px;
        font-size: 16px;
        border-radius: 10px;
        border: 1px solid #ddd;
      }

      button {
        margin-top: 15px;
        padding: 12px;
        width: 100%;
        background: #2ecc71;
        color: white;
        border: none;
        font-size: 16px;
        border-radius: 10px;
        cursor: pointer;
      }

      button:hover {
        background: #27ae60;
      }
    </style>

  </head>

  <body>

    <div class="box">
  <h2>Digite o valor</h2>

  <form action="/lojateste">
    <input type="text" name="valor" value="R$ 0,00" required />

    <div class="erro" id="erro">Valor mínimo: R$ 1,00</div>

    <button id="btn" type="submit" disabled>Gerar PIX</button>
  </form>
</div>
<script>
const input = document.querySelector('input[name="valor"]');
const btn = document.getElementById('btn');
const erro = document.getElementById('erro');

let centavos = 0;

function atualizar() {

    const valorFormatado = (centavos / 100).toFixed(2);

    input.value =
        "R$ " +
        valorFormatado.replace(".", ",");

    if (centavos >= 100) {
        btn.disabled = false;
        erro.style.display = "none";
    } else {
        btn.disabled = true;
        erro.style.display = "block";
    }
}

input.addEventListener("keydown", function(e) {

    e.preventDefault();

    if (e.key >= "0" && e.key <= "9") {
        centavos =
            centavos * 10 + Number(e.key);
    }

    if (e.key === "Backspace") {
        centavos =
            Math.floor(centavos / 10);
    }

    atualizar();
});

atualizar();
</script>
  </body>
  </html>
  `);
});

app.get("/login", (req, res) => {

  res.send(`
  
  <form method="POST" action="/login" style="
    display:flex;
    flex-direction:column;
    gap:10px;
    width:300px;
    margin:100px auto;
  ">
  
    <h2>Login Admin</h2>

    <input 
      type="text" 
      name="usuario" 
      placeholder="Usuário"
    />

    <input 
      type="password" 
      name="senha" 
      placeholder="Senha"
    />

    <button type="submit">
      Entrar
    </button>

  </form>

  `);

});

app.post(
"/login",
verificarIP,
loginLimiter,
async (req, res) => {

const { usuario, senha } = req.body;

const senhaCorreta = await bcrypt.compare(
senha,
process.env.ADMIN_PASS_HASH
);

if (
usuario === process.env.ADMIN_USER &&
senhaCorreta
) {

  await salvarLog(
"LOGIN",
`Login admin realizado`,
req
);

req.session.logado = true;

return res.redirect("/admin");
}


await salvarLog(
"LOGIN_ERRO",
`Tentativa login inválido`,
req
);

const ip = req.ip;

if (!tentativasLogin[ip]) {
tentativasLogin[ip] = 1;
} else {
tentativasLogin[ip]++;
}

if (tentativasLogin[ip] >= 5) {

ipsBloqueados[ip] = true;

await salvarLog(
"IP_BLOQUEADO",
`IP bloqueado: ${ip}`,
req
);

setTimeout(() => {

delete ipsBloqueados[ip];
delete tentativasLogin[ip];

}, 15 * 60 * 1000);

return res.send(
"IP bloqueado por 15 minutos."
);

}
return res.send("Login inválido");

});

app.get("/logout", (req, res) => {

req.session.destroy(() => {

res.redirect("/login");

});

});

app.get("/admin", verificarIP, verificarLogin, async (req, res) => {

const lojas = await Merchant.find();

let htmlLojas = "";

lojas.forEach(loja => {

htmlLojas += `
<div style="
padding:15px;
border:1px solid #ddd;
border-radius:10px;
margin-top:10px;
">

<h3>${loja.nome}</h3>

<p>
Slug: ${loja.slug}
</p>

<a href="/editar-loja/${loja._id}">
<button style="
background:#3498db;
margin-top:10px;
">
Editar
</button>
</a>

<a href="/apagar-loja/${loja._id}">
<button style="
background:#e74c3c;
margin-top:10px;
">
Apagar
</button>
</a>

</div>
`;

});

res.send(`

<!DOCTYPE html>
<html lang="pt-BR">

<head>
<meta charset="UTF-8">
<title>Painel Admin</title>
</head>

<body style="
font-family:Arial;
padding:30px;
background:#0f172a;
color:white;
">

<div style="text-align:right; margin-bottom:20px;">

<a href="/logout">

<button style="
background:#e74c3c;
padding:10px;
border:none;
border-radius:10px;
color:white;
cursor:pointer;
">
Sair
</button>

</a>

</div>

<h1>Criar Loja</h1>

<form method="POST" action="/criar-loja">

<input
type="text"
name="nome"
placeholder="Nome"
/>

<input
type="text"
name="slug"
placeholder="slug"
/>

<input
type="password"
name="accessToken"
placeholder="Novo token"
autocomplete="new-password"
spellcheck="false"
autocorrect="off"
autocapitalize="off"
/>

<button type="submit">
Criar Loja
</button>

</form>

<hr>

<h1>Lojas cadastradas</h1>

${htmlLojas}

</body>
</html>

`);

});

app.post(
"/criar-loja",
verificarIP,
verificarLogin,
async (req, res) => {

  try {

   console.log("BODY:", req.body);
    const { nome, slug, accessToken } = req.body;

    console.log("NOME:", nome);
    console.log("SLUG:", slug);
    console.log("TOKEN:", accessToken);
    if (!nome || !slug || !accessToken) {
      return res.send("Preencha todos os campos");
    }

    const existe = await Merchant.findOne({
      slug
    });

    if (existe) {
      return res.send("Slug já existe");
    }

    await Merchant.create({
      nome,
      slug,
      accessToken: criptografar(accessToken)
    });

    await salvarLog(
"CRIAR_LOJA",
`Loja ${nome} criada`,
req
);

    res.send(`
      <h1>✅ Loja criada com sucesso</h1>

      <p>
        URL da loja:
      </p>

      <a href="/${slug}">
        /${slug}
      </a>
    `);

  } catch (err) {

    console.log(err);

    res.send("Erro ao criar loja");

  }

});

app.get("/apagar-loja/:id", verificarLogin, async (req, res) => {

try {

await Merchant.findByIdAndDelete(
req.params.id
);

res.redirect("/admin");

} catch {

res.send("Erro ao apagar loja");

}

});

app.get("/editar-loja/:id", verificarLogin, async (req, res) => {

const loja = await Merchant.findById(
req.params.id
);

if (!loja) {
return res.send("Loja não encontrada");
}

res.send(`

<form method="POST">

<input
type="text"
name="nome"
value="${loja.nome}"
/>

<input
type="text"
name="slug"
value="${loja.slug}"
/>

<input
type="password"
name="accessToken"
placeholder="Novo token"
autocomplete="new-password"
spellcheck="false"
autocorrect="off"
autocapitalize="off"
/>

<button type="submit">
Salvar
</button>

</form>

`);

});

app.post("/editar-loja/:id", verificarIP, verificarLogin, async (req, res) => {

const {
nome,
slug,
accessToken
} = req.body;

const dados = {
nome,
slug
};

if (accessToken) {
dados.accessToken =
criptografar(accessToken);
}

await Merchant.findByIdAndUpdate(
req.params.id,
dados
);

await salvarLog(
"EDITAR_LOJA",
`Loja alterada: ${nome}`,
req
);
res.redirect("/admin");



});

app.get("/:slug", async (req, res) => {

  const slug = req.params.slug;

  const loja = await Merchant.findOne({
    slug
  });

  if (!loja) {
    return res.send("Loja não encontrada");
  }

  if (loja.ativo === false) {
  return res.status(403).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loja indisponível</title>
    </head>
    <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;font-family:Arial;color:white;text-align:center;padding:20px;box-sizing:border-box;">
      <div style="background:#111827;padding:35px;border-radius:20px;max-width:420px;width:100%;">
        <div style="font-size:50px;">🔒</div>
        <h1>Loja indisponível</h1>
        <p style="color:#cbd5e1;">
          Esta loja está temporariamente indisponível.
        </p>
      </div>
    </body>
    </html>
  `);
}

  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>${loja.nome}</title>

<style>

body{
  margin:0;
  background:#0f172a;
  font-family:Arial;
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
}

.card{
  background:white;
  padding:40px;
  border-radius:20px;
  width:350px;
  text-align:center;
}

h1{
  margin-bottom:30px;
}

input{
  width:100%;
  padding:15px;
  font-size:30px;
  text-align:center;
  border-radius:12px;
  border:2px solid #ddd;
  outline:none;
  box-sizing:border-box;
}

button{
  width:100%;
  padding:15px;
  margin-top:20px;
  border:none;
  border-radius:12px;
  background:#2ecc71;
  color:white;
  font-size:20px;
  cursor:pointer;
}

button:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

.erro{
  color:red;
  margin-top:10px;
  font-size:14px;
}

</style>

</head>

<body>

<div class="card">

<h1>${loja.nome}</h1>

<form action="/pix/${slug}" method="GET">

<input
type="text"
name="valor"
id="valor"
inputmode="numeric"
autocomplete="off"
required
/>

<div class="erro" id="erro">
Valor mínimo: R$ 1,00
</div>

<button id="btn" type="submit" disabled>
Gerar PIX
</button>

</form>

</div>

<script>
const input = document.querySelector('input[name="valor"]');
const btn = document.getElementById('btn');
const erro = document.getElementById('erro');

let centavos = 0;

function atualizar() {

    const valorFormatado = (centavos / 100).toFixed(2);

    input.value =
        "R$ " +
        valorFormatado.replace(".", ",");

    if (centavos >= 100) {
        btn.disabled = false;
        erro.style.display = "none";
    } else {
        btn.disabled = true;
        erro.style.display = "block";
    }
}

input.addEventListener("keydown", function(e) {

    e.preventDefault();

    if (e.key >= "0" && e.key <= "9") {
        centavos =
            centavos * 10 + Number(e.key);
    }

    if (e.key === "Backspace") {
        centavos =
            Math.floor(centavos / 10);
    }

    atualizar();
});

atualizar();
</script>

</body>
</html>
`);

});

app.get("/pix/:slug", async (req, res) => {

  const slug = req.params.slug;

  const loja = await Merchant.findOne({
    slug
  });

  if (!loja) {
    return res.send("Loja não encontrada");
  }

  if (loja.ativo === false) {
  return res.status(403).json({
    erro: "Loja bloqueada",
    mensagem: "Esta loja está temporariamente indisponível e não pode gerar novos PIX."
  });
}

  console.log("LOJA:", loja.nome);

  try {
    console.log("🔥 GERANDO PIX...");

    const valor = Number(
      req.query.valor
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    if (!valor || valor < 1) {
      return res.send("Valor inválido");
    }

    console.log("💰 Valor:", valor);

   const response = await axios.post(
    
  `https://api.mercadopago.com/v1/payments`, // ✅ corrigido
  {
    transaction_amount: Number(valor),
    payment_method_id: "pix",
    payer: {
      email: "teste@test.com"
    },
    notification_url: `https://confirmapix.onrender.com/webhook`
  },
  {
    headers: {
      Authorization: `Bearer ${descriptografar(loja.accessToken)}`,
      "X-Idempotency-Key": Date.now().toString()
    }
  }
);
const pagamentoId = response.data.id;
console.log("ID PIX:", pagamentoId);
    console.log("RESPOSTA MP:", response.data);

let pixData = response.data.point_of_interaction?.transaction_data;

// ⏱️ se não veio, espera e busca de novo
if (!pixData) {
  console.log("⏳ QR não veio ainda, tentando de novo...");

  await new Promise(r => setTimeout(r, 2000));

  const retry = await axios.get(
    `https://api.mercadopago.com/v1/payments/${response.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${descriptografar(loja.accessToken)}`
      }
    }
  );

  pixData = retry.data.point_of_interaction?.transaction_data;
}

// 🚨 agora sim valida
if (!pixData) {
  console.log("❌ ERRO REAL FINAL:", response.data);
  return res.send("Erro ao gerar PIX");
}

// ✅ usa o QR
if (!pixData.qr_code || !pixData.qr_code_base64) {
  console.log("❌ QR veio incompleto:", pixData);
  return res.send("Erro ao gerar PIX (QR inválido)");
}

const copia = pixData.qr_code;
const base64 = pixData.qr_code_base64;

   await Pagamento.create({
  userId: loja.userId,
  merchantId: loja._id,
  valor: valor,
  status: "pendente",
  pix: copia,
  pagamentoId: response.data.id,
  email: "teste@test.com",
  slug: loja.slug
});

    console.log("✅ SALVO COM SUCESSO");
    console.log("✅ QR GERADO:");
    console.log("PIX:", copia);
    console.log("BASE64:", base64 ? "OK" : "ERRO");
  

   // ============================================================
// TELA PROFISSIONAL DO PIX
// ============================================================

res.send(`
<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Pagamento PIX</title>

<style>

* {
  box-sizing: border-box;
}

body {

  margin: 0;

  min-height: 100vh;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;

  background:
    radial-gradient(
      circle at top,
      #172554 0%,
      #0f172a 42%,
      #020617 100%
    );

  color: #ffffff;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 25px;

}

.container {

  width: 100%;

  max-width: 460px;

}

/* ============================================================
   CABEÇALHO
============================================================ */

.header {

  text-align: center;

  margin-bottom: 18px;

}

.logo {

  width: 52px;

  height: 52px;

  margin: 0 auto 12px;

  border-radius: 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  background:
    linear-gradient(
      135deg,
      #22c55e,
      #16a34a
    );

  box-shadow:
    0 10px 30px rgba(34,197,94,.25);

}

.header h1 {

  margin: 0;

  font-size: 21px;

  font-weight: 700;

}

.header p {

  margin: 7px 0 0;

  color: #94a3b8;

  font-size: 13px;

}

/* ============================================================
   CARTÃO PRINCIPAL
============================================================ */

.card {

  position: relative;

  background:
    linear-gradient(
      145deg,
      rgba(30,41,59,.97),
      rgba(15,23,42,.97)
    );

  border: 1px solid rgba(148,163,184,.16);

  border-radius: 28px;

  padding: 28px;

  box-shadow:
    0 30px 80px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.04);

  overflow: hidden;

}

.card::before {

  content: "";

  position: absolute;

  top: -100px;

  right: -100px;

  width: 220px;

  height: 220px;

  border-radius: 50%;

  background:
    rgba(34,197,94,.08);

  filter: blur(5px);

}

/* ============================================================
   VALOR
============================================================ */

.label {

  text-align: center;

  color: #94a3b8;

  font-size: 13px;

  margin-bottom: 5px;

}

.valor {

  text-align: center;

  font-size: 38px;

  line-height: 1;

  font-weight: 800;

  letter-spacing: -1px;

  color: #4ade80;

  margin-bottom: 22px;

}

/* ============================================================
   QR CODE
============================================================ */

.qr-wrapper {

  background: #ffffff;

  border-radius: 20px;

  padding: 16px;

  width: 100%;

  max-width: 320px;

  margin: 0 auto 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 15px 40px rgba(0,0,0,.28);

}

.qr {

  width: 100%;

  max-width: 285px;

  display: block;

}

/* ============================================================
   INSTRUÇÃO
============================================================ */

.instrucao {

  text-align: center;

  font-size: 14px;

  color: #cbd5e1;

  margin-bottom: 12px;

}

/* ============================================================
   CÓDIGO PIX
============================================================ */

.pix-box {

  position: relative;

  background: #020617;

  border: 1px solid #334155;

  border-radius: 14px;

  padding: 14px;

  margin-bottom: 12px;

}

.pix-code {

  width: 100%;

  height: 72px;

  resize: none;

  border: none;

  outline: none;

  background: transparent;

  color: #cbd5e1;

  font-size: 12px;

  line-height: 1.5;

  font-family: monospace;

}

/* ============================================================
   BOTÃO COPIAR
============================================================ */

.btn-copy {

  width: 100%;

  border: none;

  border-radius: 14px;

  padding: 15px;

  background:
    linear-gradient(
      135deg,
      #22c55e,
      #16a34a
    );

  color: white;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition: .2s;

  box-shadow:
    0 8px 25px rgba(34,197,94,.22);

}

.btn-copy:hover {

  transform: translateY(-1px);

  box-shadow:
    0 12px 30px rgba(34,197,94,.30);

}

.btn-copy:active {

  transform: scale(.98);

}

/* ============================================================
   STATUS
============================================================ */

.status-box {

  margin-top: 18px;

  padding: 14px;

  border-radius: 14px;

  background: rgba(30,41,59,.75);

  border: 1px solid rgba(148,163,184,.12);

  text-align: center;

}

.status {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  color: #facc15;

  font-size: 14px;

  font-weight: 600;

}

.status-dot {

  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #facc15;

  box-shadow:
    0 0 12px rgba(250,204,21,.7);

}

/* ============================================================
   CONTADOR
============================================================ */

.timer {

  text-align: center;

  margin-top: 8px;

  font-size: 12px;

  color: #64748b;

}

/* ============================================================
   SEGURANÇA
============================================================ */

.security {

  margin-top: 18px;

  text-align: center;

  color: #64748b;

  font-size: 11px;

}

.security strong {

  color: #94a3b8;

}

/* ============================================================
   TELA APROVADO
============================================================ */

.aprovado {

  text-align: center;

  padding: 20px 5px;

}

.aprovado-icon {

  width: 82px;

  height: 82px;

  margin: 0 auto 20px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 40px;

  background:
    rgba(34,197,94,.12);

  border: 2px solid #22c55e;

  color: #4ade80;

  box-shadow:
    0 0 35px rgba(34,197,94,.20);

}

.aprovado h2 {

  margin: 0;

  font-size: 27px;

  color: #4ade80;

}

.aprovado p {

  color: #94a3b8;

  line-height: 1.6;

}

.novo-pix {

  width: 100%;

  margin-top: 18px;

  padding: 15px;

  border: 1px solid #334155;

  border-radius: 14px;

  background: #1e293b;

  color: white;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

}

.novo-pix:hover {

  background: #334155;

}

/* ============================================================
   CELULAR
============================================================ */

@media (max-width: 480px) {

  body {

    padding: 14px;

  }

  .card {

    padding: 20px;

    border-radius: 22px;

  }

  .valor {

    font-size: 34px;

  }

  .qr-wrapper {

    padding: 12px;

  }

  .qr {

    max-width: 270px;

  }

}

</style>

</head>

<body>

<div class="container">

  <div class="header">

    <div class="logo">
      PIX
    </div>

    <h1>
      ${loja.nome}
    </h1>

    <p>
      Pagamento seguro via PIX
    </p>

  </div>


  <div class="card" id="card">

    <div class="label">
      Valor do pagamento
    </div>

    <div class="valor">
      R$ ${valor.toFixed(2).replace(".", ",")}
    </div>


    <div class="instrucao">

      Escaneie o QR Code com o aplicativo do seu banco

    </div>


    <div class="qr-wrapper">

      <img
        class="qr"
        src="data:image/png;base64,${base64}"
        alt="QR Code PIX"
      >

    </div>


    <div class="pix-box">

      <textarea
        class="pix-code"
        id="pix"
        readonly
      >${copia}</textarea>

    </div>


    <button
      class="btn-copy"
      onclick="copiarPIX()"
      id="btnCopiar"
    >

      📋 Copiar código PIX

    </button>


    <div class="status-box">

      <div class="status" id="status">

        <span class="status-dot"></span>

        <span id="statusTexto">
          Aguardando pagamento
        </span>

      </div>

      <div class="timer" id="timer">
        Expira em 05:00
      </div>

    </div>


    <div class="security">

      🔒 <strong>Pagamento protegido</strong><br>

      Você será avisado automaticamente após a confirmação.

    </div>

  </div>

</div>


<script>

const pagamentoId = "${pagamentoId}";

const valorPagamento = Number("${valor}");

let segundosRestantes = 300;

let pagamentoFinalizado = false;


/* ============================================================
   COPIAR PIX
============================================================ */

async function copiarPIX() {

  const texto =
    document.getElementById("pix").value;

  try {

    await navigator.clipboard.writeText(texto);

  } catch {

    const campo =
      document.getElementById("pix");

    campo.focus();

    campo.select();

    document.execCommand("copy");

  }

  const botao =
    document.getElementById("btnCopiar");

  const textoOriginal =
    botao.innerText;

  botao.innerText =
    "✓ PIX copiado!";

  setTimeout(() => {

    botao.innerText =
      textoOriginal;

  }, 2000);

}


/* ============================================================
   CONTADOR
============================================================ */

function atualizarTimer() {

  const timer =
    document.getElementById("timer");

  const minutos =
    Math.floor(segundosRestantes / 60);

  const segundos =
    segundosRestantes % 60;

  timer.innerText =
    "Expira em " +
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundos).padStart(2, "0");

  if (segundosRestantes <= 0) {

    timer.innerText =
      "PIX expirado. Gere um novo PIX.";

  }

}

const contador =
  setInterval(() => {

    if (segundosRestantes > 0) {

      segundosRestantes--;

      atualizarTimer();

    }

  }, 1000);


/* ============================================================
   STATUS
============================================================ */

async function verificarStatus() {

  if (pagamentoFinalizado) {
    return;
  }

  try {

    const response =
      await fetch(
        "/status/" + pagamentoId
      );

    const data =
      await response.json();

    console.log(
      "STATUS PIX:",
      data.status
    );


    if (
      data.status === "approved" ||
      data.status === "aprovado"
    ) {

      pagamentoFinalizado = true;

      clearInterval(contador);

      clearInterval(intervaloStatus);


      const card =
        document.getElementById("card");


      card.innerHTML = \`
      
        <div class="aprovado">

          <div class="aprovado-icon">
            ✓
          </div>

          <h2>
            Pagamento aprovado!
          </h2>

          <p>
            Seu pagamento de
            <strong>
              R$ \${valorPagamento.toFixed(2).replace(".", ",")}
            </strong>
            foi confirmado com sucesso.
          </p>

          <p>
            Obrigado pela sua compra.
          </p>

          <button
            class="novo-pix"
            onclick="location.href = location.pathname"
          >
            Gerar novo PIX
          </button>

        </div>

      \`;

      return;

    }


    if (
      data.status === "cancelled" ||
      data.status === "rejected"
    ) {

      document.getElementById(
        "statusTexto"
      ).innerText =
        "Pagamento não aprovado";

      document.querySelector(
        ".status"
      ).style.color = "#f87171";

      document.querySelector(
        ".status-dot"
      ).style.background = "#ef4444";

      return;

    }

  } catch (erro) {

    console.log(
      "Erro verificando status:",
      erro
    );

  }

}


/* ============================================================
   VERIFICA A CADA 3 SEGUNDOS
============================================================ */

const intervaloStatus =
  setInterval(
    verificarStatus,
    3000
  );


atualizarTimer();

verificarStatus();

</script>

</body>

</html>
`);
    

  } catch (error) {
  console.error("❌ ERRO COMPLETO:");

  console.log(error); // mostra tudo

  if (error.response) {
    console.log("📦 RESPOSTA DO ERRO:");
    console.log(error.response.data);
  } else {
    console.log("⚠️ ERRO SEM RESPONSE (conexão ou código)");
  }

  return res.send("Erro ao gerar PIX");
}

});

app.get("/webhook", (req, res) => {
  console.log("WEBHOOK GET RECEBIDO");
  res.send("Webhook ativo");
});

console.log("🔥 REGISTRANDO WEBHOOK");

app.post("/webhook", async (req, res) => {

  console.log("🔥 WEBHOOK RECEBIDO");
  console.log("BODY:", req.body);
  console.log("QUERY:", req.query);

  try {

    let paymentId =
      req.body?.data?.id ||
      req.query["data.id"];

    if (!paymentId && req.body?.resource) {
      const parts = req.body.resource.split("/");
      paymentId = parts[parts.length - 1];
    }

    console.log("PAYMENT ID:", paymentId);
    

    if (!paymentId) {
      console.log("❌ PAYMENT ID NÃO VEIO");
      return res.sendStatus(200);
    }

    // BUSCA O PAGAMENTO NO BANCO
    const pagamento = await Pagamento.findOne({
      pagamentoId: Number(paymentId)
    });

    if (!pagamento) {
      console.log("❌ PAGAMENTO NÃO ENCONTRADO");
      return res.sendStatus(200);
    }

    // BUSCA A LOJA DO PAGAMENTO
    const loja = await Merchant.findOne({
      slug: pagamento.slug
    });

    if (!loja) {
      console.log("❌ LOJA NÃO ENCONTRADA");
      return res.sendStatus(200);
    }

    // CONSULTA STATUS REAL NO MERCADO PAGO
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
         Authorization: `Bearer ${descriptografar(loja.accessToken)}`
        }
      }
    );

    const status = response.data.status;

    console.log("🔥 STATUS REAL:", status);

    // SE APROVADO
    if (status === "approved") {


      const atualizado = await Pagamento.findOneAndUpdate(
        { pagamentoId: Number(paymentId) },
        { status: "aprovado" },
        { returnDocument: "after" }
      );

      console.log("✅ ATUALIZADO:", atualizado);
    }

    const assinatura = await Assinatura.findOne({
  pagamentoId: Number(paymentId)
});

if (assinatura) {

  assinatura.status = "aprovado";

  await assinatura.save();

  const vencimento = new Date();

  vencimento.setDate(
    vencimento.getDate() + 30
  );

  await User.findByIdAndUpdate(
    assinatura.userId,
    {
      plano: "pro",
      statusAssinatura: "ativo",
      assinaturaExpiraEm: vencimento,
      ultimoPagamentoEm: new Date()
    }
  );

  console.log(
    "✅ ASSINATURA PRO ATIVADA"
  );
}

    return res.sendStatus(200);

  } catch (err) {

    console.error(
      "❌ ERRO WEBHOOK:",
      err.response?.data || err.message
    );

    return res.sendStatus(500);
  }
});

app.get("/status/:paymentId", async (req, res) => {
  try {

    const pagamentoId = Number(req.params.paymentId);

    const pagamento = await Pagamento.findOne({ pagamentoId });

    if (!pagamento) {
      return res.json({ status: "not_found" });
    }

    return res.json({ status: pagamento.status });

  } catch (err) {
    console.log("ERRO STATUS:", err);
    return res.json({ status: "pendente" });
  }
});
// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Rodando na porta", PORT);
});