const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema({

  nome: String,

  slug: {
    type: String,
    unique: true
  },

  accessToken: String,

  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

  ativo: {
    type: Boolean,
    default: true
  }

});

module.exports = mongoose.model(
  "Merchant",
  MerchantSchema
);