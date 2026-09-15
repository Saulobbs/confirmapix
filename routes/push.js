const express = require("express");
const webpush = require("web-push");

const PushSubscription = require("../models/PushSubscription");

const router = express.Router();

/*
  CONFIGURAÇÃO VAPID
  As chaves ficam somente no backend.
*/
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/*
  Middleware de autenticação
  Usa o mesmo JWT do ConfirmaPix.
*/
const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: "Token não informado"
      });
    }

    const partes = authHeader.split(" ");

    if (
      partes.length !== 2 ||
      partes[0] !== "Bearer"
    ) {
      return res.status(401).json({
        erro: "Formato de token inválido"
      });
    }

    const token = partes[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (err) {
    console.error(
      "❌ ERRO JWT PUSH:",
      err.message
    );

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}


/*
  REGISTRAR CELULAR / NAVEGADOR
*/
router.post(
  "/subscribe",
  autenticar,
  async (req, res) => {
    try {
      const { endpoint, keys } = req.body;

      if (!endpoint || !keys) {
        return res.status(400).json({
          erro: "Inscrição Push inválida"
        });
      }

      if (!keys.p256dh || !keys.auth) {
        return res.status(400).json({
          erro: "Chaves Push não informadas"
        });
      }

      const userId =
        req.usuario.id ||
        req.usuario._id ||
        req.usuario.userId;

      if (!userId) {
        return res.status(400).json({
          erro: "Usuário não identificado"
        });
      }

      const subscription =
        await PushSubscription.findOneAndUpdate(
          {
            endpoint
          },
          {
            userId,
            endpoint,
            keys: {
              p256dh: keys.p256dh,
              auth: keys.auth
            }
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        );

      console.log(
        "🔔 PUSH REGISTRADO:",
        userId
      );

      return res.json({
        sucesso: true,
        mensagem: "Notificações ativadas",
        id: subscription._id
      });

    } catch (err) {
      console.error(
        "❌ ERRO AO REGISTRAR PUSH:",
        err
      );

      return res.status(500).json({
        erro: "Erro ao registrar notificações"
      });
    }
  }
);


/*
  REMOVER CELULAR / NAVEGADOR
*/
router.delete(
  "/unsubscribe",
  autenticar,
  async (req, res) => {
    try {
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          erro: "Endpoint não informado"
        });
      }

      const userId =
        req.usuario.id ||
        req.usuario._id ||
        req.usuario.userId;

      await PushSubscription.deleteOne({
        userId,
        endpoint
      });

      console.log(
        "🔕 PUSH REMOVIDO:",
        userId
      );

      return res.json({
        sucesso: true,
        mensagem: "Notificações desativadas"
      });

    } catch (err) {
      console.error(
        "❌ ERRO AO REMOVER PUSH:",
        err
      );

      return res.status(500).json({
        erro: "Erro ao remover notificações"
      });
    }
  }
);


module.exports = router;