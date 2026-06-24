const express = require("express");
const axios = require("axios");

const Assinatura = require("../models/Assinatura");
const User = require("../models/User");

const router = express.Router();

router.get("/pix", (req, res) => {
  res.send("Rota assinatura OK");
});

router.post("/pix", async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        erro: "Usuário não informado"
      });
    }

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
     
{
  transaction_amount: 19.90,
  payment_method_id: "pix",
  payer: {
    email: "assinatura@confirmapix.com"
  },
  notification_url:
    "https://confirmapix.onrender.com/assinatura/webhook"
},
      
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ASSINATURA_TOKEN}`,
          "X-Idempotency-Key":
            Date.now().toString()
        }
      }
    );

    const pagamentoId = response.data.id;

    await Assinatura.create({
      userId,
      pagamentoId,
      valor: 19.90,
      status: "pendente"
    });

    return res.json({
      sucesso: true,
      pagamentoId,
      qrCode:
        response.data.point_of_interaction
          ?.transaction_data?.qr_code,
      qrCodeBase64:
        response.data.point_of_interaction
          ?.transaction_data?.qr_code_base64
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: "Erro ao gerar assinatura"
    });

  }

});

router.get("/webhook", (req, res) => {
  res.send("Webhook assinatura ativo");
});

router.post("/webhook", async (req, res) => {

    console.log("🔥 WEBHOOK ASSINATURA RECEBIDO");
console.log("BODY:", req.body);
console.log("QUERY:", req.query);

  try {

    const pagamentoId =
      req.body?.data?.id;

    if (!pagamentoId) {
      return res.sendStatus(200);
    }

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${pagamentoId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ASSINATURA_TOKEN}`
        }
      }
    );

    const pagamento = response.data;

    if (pagamento.status !== "approved") {
      return res.sendStatus(200);
    }

    const assinatura =
      await Assinatura.findOne({
        pagamentoId
      });

    if (!assinatura) {
      return res.sendStatus(200);
    }

    assinatura.status = "aprovado";
    assinatura.aprovadoEm = new Date();

    await assinatura.save();

    const dataExpiracao = new Date();
    dataExpiracao.setDate(
      dataExpiracao.getDate() + 30
    );

    await User.findByIdAndUpdate(
      assinatura.userId,
      {
        plano: "pro",
        statusAssinatura: "ativo",
        assinaturaExpiraEm:
          dataExpiracao
      }
    );

    console.log(
      "ASSINATURA PRO ATIVADA"
    );

    return res.sendStatus(200);

  } catch (err) {

    console.error(err);

    return res.sendStatus(500);

  }

});

module.exports = router;