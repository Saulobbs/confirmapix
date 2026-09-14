const express = require("express");
const jwt = require("jsonwebtoken");

const Pagamento = require("../models/pagamento");
const Merchant = require("../models/merchant");

const router = express.Router();

function verificarToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado"
    });
  }

  try {

    const token = authHeader.replace(
      "Bearer ",
      ""
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch {

    return res.status(401).json({
      erro: "Token inválido"
    });

  }

}

router.get("/stats", verificarToken, async (req, res) => {

  try {

    const merchant = await Merchant.findOne({
  userId: req.usuario.id
});

if (!merchant) {

  return res.json({

    pagamentosHoje: 0,

    pixConfirmados: 0,

    pixPendentes: 0,

    totalRecebido: 0,

    registrosTotais: 0,

    ultimasTransacoes: []

  });

}

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const pagamentosHoje =
  await Pagamento.countDocuments({
    merchantId: merchant._id,
    status: "aprovado",
    criadoEm: {
      $gte: hoje
    }
  });

    const pixConfirmados =
  await Pagamento.countDocuments({
    merchantId: merchant._id,
    status: "aprovado"
  });

    const pixPendentes =
  await Pagamento.countDocuments({
    merchantId: merchant._id,
    status: {
      $ne: "aprovado"
    }
  });

    const totalRecebido =
      await Pagamento.aggregate([
        {
          $match: {
  merchantId: merchant._id,
  status: "aprovado"
}
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$valor"
            }
          }
        }
      ]);

    const ultimasTransacoes =
  await Pagamento.find({
    merchantId: merchant._id
  })
      .sort({
        criadoEm: -1
      })
      .limit(10);

    res.json({

      pagamentosHoje,

      pixConfirmados,

      pixPendentes,

      totalRecebido:
        totalRecebido[0]?.total || 0,

      registrosTotais:
        pixConfirmados + pixPendentes,

      ultimasTransacoes

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao carregar estatísticas"
    });

  }

});

module.exports = router;