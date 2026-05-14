const bcrypt = require("bcrypt");

bcrypt.hash("@Sa241985confirmapix2026", 10)
.then(hash => {
console.log(hash);
});