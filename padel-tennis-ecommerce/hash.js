const bcrypt = require("bcryptjs")

const password = process.argv[2] // la contraseña la pasás por línea de comandos

if (!password) {
  console.error("⚠️  Tenés que pasar la contraseña como argumento.")
  process.exit(1)
}

bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    console.error("Error al hashear:", err)
    process.exit(1)
  }
  console.log("Hash generado:")
  console.log(hash)
})
