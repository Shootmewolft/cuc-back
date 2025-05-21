import Admin from "../models/admin.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const admin = await Admin.findOne({ where: { email } })

    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" })
    }
    // const validPassword = await bcrypt.compare(password, admin.password);
    const validPassword = admin.password === password
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = jwt.sign(
      { id: admin.id_admin, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    )

    res.json({
      token,
      admin: { id: admin.id_admin, name: admin.name, email: admin.email },
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
