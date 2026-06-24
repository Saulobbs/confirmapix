const mongoose = require("mongoose");

const AssinaturaSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  pagamentoId: Number,

  valor: Number,

  status: {
    type: String,
    default: "pendente"
  },

  criadoEm: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Assinatura",
  AssinaturaSchema
);