const mongoose = require("mongoose");

const PagamentoSchema = new mongoose.Schema({
  pagamentoId: String,
  status: String,
  valor: Number,
  email: String,
  pix: String,
  criado_em: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pagamento", PagamentoSchema);