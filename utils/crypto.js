const crypto = require("crypto");

function criptografar(texto) {

  const iv = crypto.randomBytes(16);

  const chave = crypto
    .createHash("sha256")
    .update(process.env.TOKEN_SECRET)
    .digest();

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    chave,
    iv
  );

  let criptografado =
    cipher.update(texto, "utf8", "hex");

  criptografado += cipher.final("hex");

  return iv.toString("hex") + ":" + criptografado;

}

function descriptografar(texto) {

  const partes = texto.split(":");

  const iv = Buffer.from(partes[0], "hex");

  const chave = crypto
    .createHash("sha256")
    .update(process.env.TOKEN_SECRET)
    .digest();

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    chave,
    iv
  );

  let descriptografado =
    decipher.update(partes[1], "hex", "utf8");

  descriptografado += decipher.final("utf8");

  return descriptografado;

}

module.exports = {
  criptografar,
  descriptografar
};