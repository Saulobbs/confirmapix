const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  senhaHash: {
    type: String,
    required: true
  },

  plano: {
    type: String,
    enum: ["teste", "pro"],
    default: "teste"
  },

  statusAssinatura: {
    type: String,
    enum: [
      "ativo",
      "cancelado",
      "expirado",
      "inadimplente"
    ],
    default: "ativo"
  },

  apiKey: {
    type: String,
    default: ""
  },

  webhookUrl: {
    type: String,
    default: ""
  },

  ativo: {
    type: Boolean,
    default: true
  },

  role: {
    type: String,
    default: "user"
  },

  testeExpiraEm: {
    type: Date,
    default: () => {
      const data = new Date();
      data.setDate(
        data.getDate() + 30
      );
      return data;
    }
  },

  assinaturaExpiraEm: {
    type: Date,
    default: null
  },

  ultimoPagamentoEm: {
  type: Date,
  default: null
},

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "User",
  UserSchema
);