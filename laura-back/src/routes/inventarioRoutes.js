const {Router} = require("express")
const inventarioRoutes = Router()
const {getItems, postItem, putItem, getItem, deleteItem} = require("../controllers/inventarioController")

inventarioRoutes.get("/", async (req,res) => {
    try{
    const finanza = await getItems()
    res.json(finanza)
    }catch(error){
        console.log(error)
    }
})

inventarioRoutes.get("/item/:id", async (req,res) => {
    try{
    const finanza = await getItem(req.params.id)
    res.json(finanza)
    }catch(error){
        console.log(error)
    }
})

inventarioRoutes.post("/", async (req,res) => {
    try{
    const newPago = await postItem(req.body)
    res.json({status:newPago})
    }
    catch(error){
        console.log(error)
    }
})

inventarioRoutes.put("/", async (req,res) => {
    try{
        const newPago = await putItem(req.body)
        res.json({status:newPago})
        }
        catch(error){
            console.log(error)
        }
})

inventarioRoutes.delete("/delete/:id", async (req,res) => {
    try{
        const newPago = await deleteItem(req.params.id)
        res.json({status:newPago})
        }
        catch(error){
            console.log(error)
        }
})

module.exports = inventarioRoutes