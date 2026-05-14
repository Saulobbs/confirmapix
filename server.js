

require('dotenv').config()

console.log("🚀 SERVIDOR INICIADO");
process.on('uncaughtException', err => {
  console.error('💥 ERRO CRASH:', err);
});

process.on('unhandledRejection', err => {
  console.error('💥 PROMISE CRASH:', err);
});

const mongoose = require('mongoose');
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const axios = require("axios");
const { MercadoPagoConfig } = require("mercadopago");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
app.use(express.json());
app.use(cors());
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

// 🔥 CONEXÃO MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB conectado"))
  .catch(err => console.error(err));

  async function criarLojaTeste() {

  const existe = await Merchant.findOne({
    slug: "lojateste"
  });

  if (true) {

    await Merchant.findOneAndUpdate(
      { slug: "lojateste" },

      {
        nome: "Loja Teste",
        slug: "lojateste",
        accessToken: criptografar("APP_USR-3962465380015954-051023-5424fd70d58ac4accb962f632e738121-139582592")
      },

      { upsert: true }
    );

    console.log("LOJA TESTE ATUALIZADA");
  }

}

  
  

criarLojaTeste();


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

app.post("/login", (req, res) => {

  const { usuario, senha } = req.body;

  if (
    usuario === "admin" &&
    senha === "@Sa241985confirmapix2026"
  ) {

    req.session.logado = true;

    return res.redirect("/admin");
  }

  return res.send("Login inválido");

});

app.get("/admin", verificarLogin, (req, res) => {

res.send(`

<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>Painel Admin</title>

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
  width:400px;
}

h1{
  text-align:center;
  margin-bottom:30px;
}

input{
  width:100%;
  padding:15px;
  margin-bottom:15px;
  border-radius:10px;
  border:1px solid #ccc;
  box-sizing:border-box;
}

button{
  width:100%;
  padding:15px;
  border:none;
  border-radius:10px;
  background:#2ecc71;
  color:white;
  font-size:18px;
  cursor:pointer;
}

</style>

</head>

<body>

<div class="card">

<h1>Criar Loja</h1>

<form method="POST" action="/criar-loja">

<input
type="text"
name="nome"
placeholder="Nome da loja"
required
/>

<input
type="text"
nome="slug"
placeholder="slug-da-loja"
required
/>

<input
type="text"
nome="accessToken"
placeholder="Access Token Mercado Pago"
required
/>

<button type="submit">
Criar Loja
</button>

</form>

</div>

</body>
</html>

`);

});

app.post("/criar-loja", async (req, res) => {

  try {

    const { nome, slug, accessToken } = req.body;

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

app.get("/:slug", async (req, res) => {

  const slug = req.params.slug;

  const loja = await Merchant.findOne({
    slug
  });

  if (!loja) {
    return res.send("Loja não encontrada");
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
  

    // ✅ AQUI É O MAIS IMPORTANTE
    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PIX Gerado</title>

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

.card {
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  width: 340px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.valor {
  font-size: 26px;
  color: #2ecc71;
  font-weight: bold;
}

.qr {
  width: 220px;
  margin: 15px 0;
}

textarea {
  width: 100%;
  height: 70px;
  margin-top: 10px;
}

button {
  margin-top: 10px;
  padding: 12px;
  width: 100%;
  border: none;
  background: #2ecc71;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background: #27ae60;
}
</style>
</head>

<body>

<div class="card">
  <div class="valor">R$ ${valor.toFixed(2)}</div>

  <img class="qr" src="data:image/png;base64,${base64}" />

  <textarea id="pix">${copia}</textarea>

  <button onclick="copiar()">Copiar PIX</button>
</div>

<script>

// ✅ ID vindo do backend (SÓ UMA VEZ)
const pagamentoId = "${pagamentoId}";

// ✅ valor como número
const valor = Number("${valor}");

// 🟢 DATA E HORA
const agora = new Date();

function formatarDataHora(data) {
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

function copiar() {
  const texto = document.getElementById('pix');
  texto.select();
  document.execCommand('copy');
  alert("Copiado!");
}

console.log("SCRIPT CARREGOU");

// status na tela
const statusText = document.createElement("p");
statusText.innerText = "⏳ Aguardando pagamento...";
statusText.style.marginTop = "10px";
document.querySelector(".card").appendChild(statusText);

async function verificarStatus() {
  try {
    const response = await fetch('/status/' + pagamentoId);
    const data = await response.json();

    console.log("STATUS ATUAL:", data.status);

    statusText.innerText = "Status: " + data.status;

    if (data.status === "aprovado") {
      clearInterval(intervalo);

      const card = document.querySelector(".card");   

      card.innerHTML = \`
      <div style="text-align:center;">
        <h1 style="color:#2ecc71;">✅ Pagamento Aprovado</h1>

        <p>
          Seu pagamento de 
          <strong>R$ \${valor.toFixed(2)}</strong> 
          foi confirmado com sucesso.
        </p>

        <p style="margin-top:10px; font-size:14px; color:#555;">
          📅 \${formatarDataHora(agora)}
        </p>

        <button onclick="location.reload()" style="
          margin-top:20px;
          padding:12px;
          border:none;
          background:#2ecc71;
          color:white;
          border-radius:10px;
          cursor:pointer;
        ">
          Gerar novo PIX
        </button>
      </div>
      \`;
    }

  } catch (err) {
    console.log("ERRO:", err);
  }
}

let tentativas = 0;

const intervalo = setInterval(() => {
  tentativas++;

  if (tentativas > 100) {
    clearInterval(intervalo);
    statusText.innerText = "Tempo expirado. Gere um novo PIX.";
    return;
  }

  verificarStatus();
}, 3000);

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