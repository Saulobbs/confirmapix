const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


function verificarToken(req, res, next) {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      erro: "Token não informado"
    });

  }

  try {

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const decoded =
      jwt.verify(
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

/*
|--------------------------------------------------------------------------
| CADASTRO
|--------------------------------------------------------------------------
*/

router.post("/register", async (req, res) => {

    console.log("CHEGOU NA ROTA REGISTER");

  try {

    const {
      nome,
      email,
      senha
    } = req.body;

    if (!nome || !email || !senha) {

      return res.status(400).json({
        erro: "Preencha todos os campos"
      });

    }

    const existe = await User.findOne({
      email
    });

    if (existe) {

      return res.status(400).json({
        erro: "Email já cadastrado"
      });

    }

    const senhaHash =
      await bcrypt.hash(senha, 10);

    const usuario =
      await User.create({

        nome,

        email,

        senhaHash

      });

    return res.status(201).json({

      sucesso: true,

      id: usuario._id,

      plano: usuario.plano,

      testeExpiraEm:
        usuario.testeExpiraEm

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: "Erro interno"
    });

  }

});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      senha
    } = req.body;

    if (!email || !senha) {

      return res.status(400).json({
        erro: "Preencha email e senha"
      });

    }

    const usuario =
      await User.findOne({
        email
      });

    if (!usuario) {

      return res.status(401).json({
        erro: "Email ou senha inválidos"
      });

    }

    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senhaHash
      );

    if (!senhaCorreta) {

      return res.status(401).json({
        erro: "Email ou senha inválidos"
      });

    }

    if (!usuario.ativo) {

      return res.status(403).json({
        erro: "Conta desativada"
      });

    }

    const token = jwt.sign(

      {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

console.log(usuario);
console.log("LOGIN RESPONSE:");

    return res.json({

      sucesso: true,

      token,

      usuario: {

        id: usuario._id,

        nome: usuario.nome,

        email: usuario.email,

        plano: usuario.plano,

        statusAssinatura: usuario.statusAssinatura,

        testeExpiraEm: usuario.testeExpiraEm,
        

        
        apiKey: usuario.apiKey,
        webhookUrl: usuario.webhookUrl


          
        
      }

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: "Erro interno"
    });

  }

});

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

  } catch (err) {

    return res.status(401).json({
      erro: "Token inválido"
    });

  }

}

router.put("/config", verificarToken, async (req, res) => {

console.log("CONFIG RECEBIDA:");
console.log(req.body);

  try {

    const {
  apiKey,
  webhookUrl
} = req.body;

    console.log("ID RECEBIDO:", req.usuario.id);
    const usuario = await User.findByIdAndUpdate(
  req.usuario.id,
  {
    apiKey,
    webhookUrl
  },
  {
    returnDocument: "after"
  }
);

res.json({
  sucesso: true,
  usuario: {
    id: usuario._id,
    apiKey: usuario.apiKey,
    webhookUrl: usuario.webhookUrl
  }
});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao salvar configuração"
    });

  }

});

module.exports = router;