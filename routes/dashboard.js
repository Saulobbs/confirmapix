const express = require("express");

const Pagamento = require("../models/pagamento");

const router = express.Router();

router.get("/stats", async (req, res) => {

  try {

    const pagamentosHoje =
      await Pagamento.countDocuments({
        status: "aprovado", 
        criadoEm: {
          $gte: new Date(
            new Date().setHours(0, 0, 0, 0)
          )
        }
      });

    const pixConfirmados =
      await Pagamento.countDocuments({
        status: "aprovado"
      });

    const pixPendentes =
      await Pagamento.countDocuments({
        status: {
          $ne: "aprovado"
        }
      });

    const totalRecebido =
      await Pagamento.aggregate([
        {
          $match: {
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
  await Pagamento.find()
    .sort({ criadoEm: -1 })
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