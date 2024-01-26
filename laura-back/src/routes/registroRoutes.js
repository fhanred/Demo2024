const {Router} = require("express")
const { getRegistros, postRegistro , deleteRegistro, putRegistro} = require("../controllers/registroController")
const registroRoutes = Router()

registroRoutes.get("/", async (req,res) => {
    // if(req.params.id == "all"){
        const proveedores = await getRegistros()
        return res.json(proveedores)
    // }
})

registroRoutes.post("/", async (req,res) => {
    const proveedor = await postRegistro(req.body)
    return res.json(proveedor)
})

registroRoutes.put("/", async (req,res) => {
    const edit = await putRegistro(req.body)
    res.json(edit)
})

registroRoutes.delete("/:id", (req,res) => {
    const deleted = deleteRegistro(req.params.id)
    res.json(deleted)
})

module.exports = registroRoutes