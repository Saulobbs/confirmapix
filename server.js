require('dotenv').config()
console.log("🚀 SERVIDOR NOVO RODANDO");
console.log("TOKEN:", process.env.ACCESS_TOKEN);
const mongoose = require('mongoose');
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const Pagamento = require("./models/pagamento");

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

  <form action="/pix" method="GET">
    <input type="text" name="valor" value="R$ 0,00" required />

    <div class="erro" id="erro">Valor mínimo: R$ 1,00</div>

    <button id="btn" type="submit" disabled>Gerar PIX</button>
  </form>
</div>
<script>
const input = document.querySelector('input[name="valor"]');
const btn = document.getElementById('btn');
const erro = document.getElementById('erro');

// valor interno (em centavos)
let centavos = 0;

input.addEventListener('keydown', function (e) {
  // permite apagar
  if (e.key === "Backspace") {
    centavos = Math.floor(centavos / 10);
    atualizar();
    e.preventDefault();
    return;
  }

  // só números
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
    return;
  }

  centavos = centavos * 10 + Number(e.key);
  atualizar();

  e.preventDefault();
});

function atualizar() {
  let valor = (centavos / 100).toFixed(2);

  let formatado = valor
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  input.value = 'R$ ' + formatado;

  let numero = Number(valor);

  if (numero >= 1) {
    btn.disabled = false;
    btn.classList.add("ativo");
    erro.style.display = "none";
  } else {
    btn.disabled = true;
    btn.classList.remove("ativo");
    erro.style.display = "block";
  }
}

// valor inicial
atualizar();
</script>
  </body>
  </html>
  `);
});


app.get("/pix", async (req, res) => {
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
    notification_url: `https://keisha-peremptory-meta.ngrok-free.dev/webhook`
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "X-Idempotency-Key": Date.now().toString()
    }
  }
);
const pagamentoId = response.data.id;
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
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
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
      status: "pending",
      pix: copia,
      pagamentoId: response.data.id,
      email: "teste@test.com"
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
    const response = await fetch(\`/status?pagamentoId=\${pagamentoId}\`);
    const data = await response.json();

    console.log("STATUS ATUAL:", data.status);

    statusText.innerText = "Status: " + data.status;

    if (data.status === "approved") {
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


app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  console.log("BODY:", JSON.stringify(req.body));

  if (!req.body || !req.body.data || !req.body.data.id) {
    console.log("❌ SEM ID");
    return;
  }

  const paymentId = req.body.data.id;

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const status = response.data.status;

    console.log("🔥 STATUS REAL:", status);

    if (status === 'approved') {
      console.log("✅ PAGAMENTO APROVADO");
    } else {
      console.log("⏳ AINDA NÃO APROVADO:", status);
    }

  } catch (err) {
    console.error("❌ ERRO:", err.response?.data || err.message);
  }
});

app.get("/status", async (req, res) => {
  try {
    const pagamentoId = Number(req.query.pagamentoId);

    const pagamento = await Pagamento.findOne({ pagamentoId });

    if (!pagamento) {
      return res.json({ status: "not_found" });
    }

    return res.json({ status: pagamento.status });

  } catch (err) {
    console.log("ERRO STATUS:", err);
    return res.json({ status: "pending" });
  }
});
// 🚀 SERVIDOR
app.listen(3000, () => {
  console.log("🚀 Rodando em http://localhost:3000");
});