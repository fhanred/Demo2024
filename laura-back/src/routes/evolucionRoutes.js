const {Router} = require("express")
const evolucionRoutes = Router()

evolucionRoutes.get("/", (req,res) => {
    res.json({users:"Retorna un array de evolucions"})
})

evolucionRoutes.post("/", (req,res) => {
    res.json({users:"Crea un nuevo evolucion"})
})

evolucionRoutes.put("/", (req,res) => {
    res.json({users:"Edita un evolucion"})
})

evolucionRoutes.delete("/", (req,res) => {
    res.json({users:"Elimina un evolucion"})
})

module.exports = evolucionRoutes