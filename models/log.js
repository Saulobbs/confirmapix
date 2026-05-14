const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  tipo: String,
  mensagem: String,
  ip: String,
  data: {
    type: Date,
    default: Date.now
  }
});

const LogModel = mongoose.model("Log", LogSchema);

module.exports = LogModel;