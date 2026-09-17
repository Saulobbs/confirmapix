const mongoose = require("mongoose");

const PagamentoSchema = new mongoose.Schema({
  valor: Number,
  status: String,
  pix: String,
  pagamentoId: Number,

// 👤 DADOS DE QUEM PAGOU
nomePagador: String,
documentoPagador: String,
tipoDocumento: String,

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
