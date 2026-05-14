const bcrypt = require("bcrypt");

bcrypt.hash("@91067734@", 10)
.then(hash => {
console.log(hash);
});