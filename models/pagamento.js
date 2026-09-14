const mongoose = require("mongoose");

const PagamentoSchema = new mongoose.Schema({
  valor: Number,
  status: String,
  pix: String,
  pagamentoId: Number,
  email: String,
  slug: String,

  merchantId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Merchant"
},

userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

  criadoEm: {
    type: Date,
    default: Date.now
  },

  aprovadoEm: Date
});

module.exports = mongoose.model("Pagamento", PagamentoSchema);