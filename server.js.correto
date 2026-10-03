

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
const pushRoutes = require("./routes/push");
const webpush = require("web-push");
const PushSubscription = require("./models/PushSubscription");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/assinatura", assinaturaRoutes);
app.use("/admin-api", adminRoutes); 
app.use("/push", pushRoutes);

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
    .update(process.env.NEW_TOKEN_SECRET)
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

  if (partes.length !== 2) {

    throw new Error(
      "Formato de token criptografado inválido."
    );

  }

  const iv = Buffer.from(
    partes[0],
    "hex"
  );

  const chave = crypto
    .createHash("sha256")
    .update(process.env.NEW_TOKEN_SECRET)
    .digest();

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    chave,
    iv
  );

  let descriptografado =
    decipher.update(
      partes[1],
      "hex",
      "utf8"
    );

  descriptografado += decipher.final("utf8");

  return descriptografado;
}

const Pagamento = require("./models/pagamento");

const Merchant = require("./models/merchant");
const LogModel = require("./models/log");




// 🔥 CONEXÃO MONGO



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

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
>

<title>${loja.nome}</title>

<style>

*{
  box-sizing:border-box;
}

html,
body{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
}

body{

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Arial,
    sans-serif;

  background:
    radial-gradient(
      circle at 50% 0%,
      #12305f 0%,
      #0a1730 38%,
      #050b1a 100%
    );

  color:#ffffff;

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  padding:30px 16px;

  overflow-x:hidden;
}


/* =========================================
   FUNDO DECORATIVO
========================================= */

body::before{

  content:"";

  position:fixed;

  width:500px;
  height:500px;

  top:-250px;
  left:50%;

  transform:translateX(-50%);

  background:
    radial-gradient(
      circle,
      rgba(0,255,150,0.12),
      transparent 65%
    );

  pointer-events:none;

}


/* =========================================
   CONTAINER PRINCIPAL
========================================= */

.container{

  width:100%;

  max-width:720px;

  position:relative;

}


/* =========================================
   INDICADOR DE SEGURANÇA
========================================= */

.security-top{

  display:flex;

  justify-content:center;

  margin-bottom:18px;

}

.security-badge{

  display:inline-flex;

  align-items:center;

  gap:9px;

  padding:9px 15px;

  border-radius:30px;

  background:rgba(12,29,54,0.72);

  border:1px solid rgba(80,160,220,0.20);

  color:#d9e7f7;

  font-size:13px;

  font-weight:600;

  box-shadow:
    0 8px 30px rgba(0,0,0,0.20);

}

.security-icon{

  width:20px;
  height:20px;

  border-radius:50%;

  display:flex;

  align-items:center;
  justify-content:center;

  background:rgba(0,220,130,0.14);

  color:#32e58a;

  font-size:12px;

}


/* =========================================
   CARD
========================================= */

.card{

  width:100%;

  background:
    linear-gradient(
      145deg,
      rgba(24,45,75,0.94),
      rgba(9,22,43,0.97)
    );

  border:1px solid rgba(120,170,220,0.18);

  border-radius:30px;

  padding:38px;

  box-shadow:

    0 35px 90px rgba(0,0,0,0.48),

    inset 0 1px 0 rgba(255,255,255,0.05);

  position:relative;

  overflow:hidden;

}


/* brilho do card */

.card::before{

  content:"";

  position:absolute;

  width:280px;
  height:280px;

  right:-140px;
  top:-140px;

  background:
    radial-gradient(
      circle,
      rgba(0,230,140,0.14),
      transparent 70%
    );

  pointer-events:none;

}


/* =========================================
   CABEÇALHO
========================================= */

.header{

  text-align:center;

  position:relative;

  z-index:1;

}


.pix-logo{

  width:64px;
  height:64px;

  margin:0 auto 14px;

  border-radius:19px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      145deg,
      #22df82,
      #00b968
    );

  color:#ffffff;

  font-size:21px;

  font-weight:800;

  letter-spacing:-0.5px;

  box-shadow:
    0 10px 30px rgba(0,210,120,0.25);

}


.store-name{

  margin:0;

  font-size:30px;

  font-weight:800;

  letter-spacing:-0.8px;

  word-break:break-word;

}


.subtitle{

  margin:8px 0 0;

  color:#9eb2cc;

  font-size:15px;

}


/* =========================================
   BENEFÍCIOS
========================================= */

.features{

  margin-top:28px;

  display:grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:10px;

}


.feature{

  min-height:78px;

  padding:13px 8px;

  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;

  text-align:center;

  border-radius:16px;

  background:
    rgba(17,38,65,0.72);

  border:1px solid rgba(100,160,210,0.13);

}


.feature-icon{

  font-size:20px;

  margin-bottom:6px;

}


.feature-title{

  font-size:12px;

  font-weight:700;

  color:#dce9f7;

}


.feature-text{

  margin-top:2px;

  font-size:11px;

  color:#8298b4;

}


/* =========================================
   ÁREA DO VALOR
========================================= */

.payment-section{

  margin-top:32px;

}


.payment-title{

  margin:0;

  text-align:center;

  font-size:20px;

  font-weight:750;

  color:#f5f8fc;

}


.payment-subtitle{

  text-align:center;

  margin:7px 0 20px;

  font-size:13px;

  color:#8fa5c0;

}


/* =========================================
   CAMPO DO VALOR
========================================= */

.input-wrapper{

  position:relative;

  width:100%;

}


.currency{

  position:absolute;

  left:22px;

  top:50%;

  transform:translateY(-50%);

  font-size:20px;

  font-weight:700;

  color:#6f849f;

  pointer-events:none;

}


input{

  width:100%;

  height:76px;

  padding:
    0 24px 0 65px;

  border-radius:18px;

  border:2px solid rgba(100,140,180,0.28);

  outline:none;

  background:
    rgba(4,17,35,0.72);

  color:#ffffff;

  font-size:34px;

  font-weight:750;

  letter-spacing:0.5px;

  transition:all 0.2s ease;

}


input:focus{

  border-color:#25e783;

  box-shadow:
    0 0 0 4px rgba(37,231,131,0.10),
    0 0 35px rgba(37,231,131,0.08);

}


/* =========================================
   VALORES RÁPIDOS
========================================= */

.quick-values{

  display:grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap:8px;

  margin-top:12px;

}


.quick-btn{

  height:43px;

  border-radius:12px;

  border:1px solid rgba(70,150,210,0.20);

  background:
    rgba(14,35,61,0.82);

  color:#27e986;

  font-size:12px;

  font-weight:700;

  cursor:pointer;

  transition:all 0.18s ease;

}


.quick-btn:hover{

  border-color:#27e986;

  background:
    rgba(20,70,65,0.75);

  transform:translateY(-1px);

}


/* =========================================
   ERRO
========================================= */

.erro{

  margin-top:10px;

  text-align:center;

  color:#ff6b6b;

  font-size:13px;

  min-height:18px;

}


/* =========================================
   BOTÃO GERAR PIX
========================================= */

.generate-btn{

  width:100%;

  height:62px;

  margin-top:10px;

  border:none;

  border-radius:17px;

  background:
    linear-gradient(
      135deg,
      #24e985,
      #08b969
    );

  color:#ffffff;

  font-size:19px;

  font-weight:800;

  cursor:pointer;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:12px;

  box-shadow:
    0 12px 30px rgba(0,200,110,0.20);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;

}


.generate-btn:hover:not(:disabled){

  transform:translateY(-2px);

  box-shadow:
    0 17px 38px rgba(0,220,120,0.28);

}


.generate-btn:active:not(:disabled){

  transform:translateY(0);

}


.generate-btn:disabled{

  opacity:0.38;

  cursor:not-allowed;

  box-shadow:none;

}


.qr-icon{

  font-size:22px;

}


/* =========================================
   SEGURANÇA
========================================= */

.safe-box{

  margin-top:20px;

  padding:17px;

  border-radius:17px;

  display:flex;

  align-items:flex-start;

  gap:13px;

  background:
    rgba(8,31,53,0.75);

  border:1px solid rgba(60,150,210,0.13);

}


.safe-icon{

  width:42px;
  height:42px;

  flex:none;

  display:flex;

  align-items:center;
  justify-content:center;

  border-radius:12px;

  background:
    rgba(37,231,131,0.10);

  color:#28e886;

  font-size:21px;

}


.safe-title{

  margin:0;

  color:#2de88a;

  font-size:14px;

  font-weight:800;

}


.safe-text{

  margin:4px 0 0;

  color:#8fa6c0;

  font-size:12px;

  line-height:1.45;

}


/* =========================================
   RODAPÉ
========================================= */

.footer{

  margin-top:22px;

  text-align:center;

  color:#657b96;

  font-size:11px;

  line-height:1.5;

}


.footer strong{

  color:#91a9c4;

}


/* =========================================
   RESPONSIVO
========================================= */

@media(max-width:600px){

  body{

    padding:15px 10px;

    align-items:flex-start;

  }

  .container{

    margin-top:10px;

  }

  .card{

    padding:24px 18px;

    border-radius:24px;

  }

  .pix-logo{

    width:56px;
    height:56px;

    border-radius:17px;

    font-size:19px;

  }

  .store-name{

    font-size:24px;

  }

  .subtitle{

    font-size:13px;

  }

  .features{

    gap:6px;

    margin-top:22px;

  }

  .feature{

    min-height:72px;

    padding:10px 4px;

  }

  .feature-icon{

    font-size:18px;

  }

  .feature-title{

    font-size:10px;

  }

  .feature-text{

    font-size:9px;

  }

  .payment-section{

    margin-top:25px;

  }

  .payment-title{

    font-size:18px;

  }

  input{

    height:68px;

    font-size:30px;

    padding-left:60px;

  }

  .currency{

    left:19px;

  }

  .quick-values{

    grid-template-columns:
      repeat(3, 1fr);

  }

  .quick-btn{

    height:42px;

  }

  .quick-btn:nth-child(4){

    grid-column:2;

  }

  .quick-btn:nth-child(5){

    grid-column:3;

  }

  .generate-btn{

    height:58px;

    font-size:17px;

  }

  .safe-box{

    padding:14px;

  }

}


/* =========================================
   TELAS MUITO PEQUENAS
========================================= */

@media(max-width:380px){

  .card{

    padding:20px 14px;

  }

  .store-name{

    font-size:22px;

  }

  .features{

    grid-template-columns:
      1fr;

  }

  .feature{

    min-height:55px;

    flex-direction:row;

    gap:8px;

  }

  .feature-icon{

    margin:0;

  }

  .quick-values{

    grid-template-columns:
      repeat(2, 1fr);

  }

  .quick-btn:nth-child(4),
  .quick-btn:nth-child(5){

    grid-column:auto;

  }

}

</style>

</head>


<body>


<div class="container">


  <div class="security-top">

    <div class="security-badge">

      <span class="security-icon">✓</span>

      Ambiente seguro

      <span>🔒</span>

    </div>

  </div>


  <div class="card">


    <!-- CABEÇALHO -->

    <div class="header">

      <div class="pix-logo">
        PIX
      </div>

      <h1 class="store-name">
        ${loja.nome}
      </h1>

      <p class="subtitle">
        Pague via PIX de forma rápida e segura
      </p>

    </div>


    <!-- BENEFÍCIOS -->

    <div class="features">


      <div class="feature">

        <div class="feature-icon">
          ⚡
        </div>

        <div class="feature-title">
          Pagamento
        </div>

        <div class="feature-text">
          Instantâneo
        </div>

      </div>


      <div class="feature">

        <div class="feature-icon">
          🛡️
        </div>

        <div class="feature-title">
          Seus dados
        </div>

        <div class="feature-text">
          Protegidos
        </div>

      </div>


      <div class="feature">

        <div class="feature-icon">
          ✓
        </div>

        <div class="feature-title">
          Aprovação
        </div>

        <div class="feature-text">
          Automática
        </div>

      </div>


    </div>


    <!-- PAGAMENTO -->

    <div class="payment-section">


      <h2 class="payment-title">
        Digite o valor que deseja pagar
      </h2>


      <p class="payment-subtitle">
        Valor mínimo: R$ 1,00
      </p>


      <form
        action="/pix/${slug}"
        method="GET"
      >


        <!-- CAMPO -->

        <div class="input-wrapper">

          <span class="currency">
            R$
          </span>

          <input
            type="text"
            name="valor"
            id="valor"
            value="R$ 0,00"
            inputmode="numeric"
            autocomplete="off"
            required
          />

        </div>


        <!-- VALORES RÁPIDOS -->

        <div class="quick-values">


          <button
            type="button"
            class="quick-btn"
            onclick="definirValor(100)"
          >
            R$ 1,00
          </button>


          <button
            type="button"
            class="quick-btn"
            onclick="definirValor(500)"
          >
            R$ 5,00
          </button>


          <button
            type="button"
            class="quick-btn"
            onclick="definirValor(1000)"
          >
            R$ 10,00
          </button>


          <button
            type="button"
            class="quick-btn"
            onclick="definirValor(2000)"
          >
            R$ 20,00
          </button>


          <button
            type="button"
            class="quick-btn"
            onclick="definirValor(5000)"
          >
            R$ 50,00
          </button>


        </div>


        <!-- ERRO -->

        <div
          class="erro"
          id="erro"
        >
          Valor mínimo: R$ 1,00
        </div>


        <!-- GERAR PIX -->

        <button
          id="btn"
          class="generate-btn"
          type="submit"
          disabled
        >

          <span class="qr-icon">
            ▦
          </span>

          <span>
            Gerar PIX
          </span>

          <span>
            →
          </span>

        </button>


      </form>


      <!-- SEGURANÇA -->

      <div class="safe-box">


        <div class="safe-icon">
          🔒
        </div>


        <div>

          <p class="safe-title">
            Pagamento seguro
          </p>

          <p class="safe-text">
            Seu pagamento é processado com segurança.
            Após o pagamento, a confirmação é automática.
          </p>

        </div>


      </div>


    </div>


    <!-- RODAPÉ -->

    <div class="footer">

      🔐 Ambiente protegido

      <br>

      <strong>
        Pagamento via PIX
      </strong>

    </div>


  </div>


</div>


<script>


const input =
  document.querySelector(
    'input[name="valor"]'
  );


const btn =
  document.getElementById("btn");


const erro =
  document.getElementById("erro");


let centavos = 0;


/* =========================================
   ATUALIZA VALOR
========================================= */

function atualizar(){

  const valorFormatado =
    (centavos / 100).toFixed(2);


  input.value =
    "R$ " +
    valorFormatado.replace(".", ",");


  if(centavos >= 100){

    btn.disabled = false;

    erro.style.display = "none";

  }else{

    btn.disabled = true;

    erro.style.display = "block";

  }

}


/* =========================================
   VALORES RÁPIDOS
========================================= */

function definirValor(valor){

  centavos = valor;

  atualizar();

  input.focus();

}


/* =========================================
   DIGITAÇÃO
========================================= */

input.addEventListener(
  "keydown",
  function(e){

    e.preventDefault();


    if(
      e.key >= "0" &&
      e.key <= "9"
    ){

      centavos =
        centavos * 10 +
        Number(e.key);

    }


    if(
      e.key === "Backspace"
    ){

      centavos =
        Math.floor(
          centavos / 10
        );

    }


    atualizar();

  }
);


/* =========================================
   INÍCIO
========================================= */

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