const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema({

  nome: String,

  slug: {
    type: String,
    unique: true
  },

  accessToken: String,

  ativo: {
    type: Boolean,
    default: true
  }

});

module.exports = mongoose.model(
  "Merchant",
  MerchantSchema
);