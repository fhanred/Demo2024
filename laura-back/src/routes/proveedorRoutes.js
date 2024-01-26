const {Router} = require("express")
const { getProveedor, getProveedores, postProveedor , deleteProveedor, putProveedor} = require("../controllers/proveedorController")
const proveedorRoutes = Router()

proveedorRoutes.get("/:id", async (req,res) => {
    if(req.params.id == "all"){
        const proveedores = await getProveedores()
        return res.json(proveedores)
    }else{
        const proveedor = await getProveedor(req.params.id)
        return res.json(proveedor)
    }
})

proveedorRoutes.post("/", async (req,res) => {
    const proveedor = await postProveedor(req.body)
    return res.json(proveedor)
})

proveedorRoutes.put("/", async (req,res) => {
    const edit = await putProveedor(req.body)
    res.json(edit)
})

proveedorRoutes.delete("/:id", (req,res) => {
    const deleted = deleteProveedor(req.params.id)
    res.json(deleted)
})

module.exports = proveedorRoutes