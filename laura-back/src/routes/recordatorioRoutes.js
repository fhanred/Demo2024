const {Router} = require("express")
const {getRecordatorios, getRecordatorio, postRecordatorio, deleteRecordatorio, } = require("../controllers/recordatorioController")
const recordatorioRoutes = Router()

recordatorioRoutes.get("/:id", async (req,res) => {
    if(req.params.id == "all"){
        const proveedores = await getRecordatorios()
        return res.json(proveedores)
    }else{
        const proveedor = await getRecordatorio(req.params.id)
        return res.json(proveedor)
    }
})

recordatorioRoutes.post("/", async (req,res) => {
    const proveedor = await postRecordatorio(req.body)
    return res.json(proveedor)
})

recordatorioRoutes.delete("/:id", async (req,res) => {
    const proveedor = await deleteRecordatorio(req.params.id)
    return res.json(proveedor)
})

module.exports = recordatorioRoutes