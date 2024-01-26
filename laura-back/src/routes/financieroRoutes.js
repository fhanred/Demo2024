const {Router} = require("express")
const financieroRoutes = Router()
const {getFinanza, newPay, deletePay} = require("../controllers/financieroController")

financieroRoutes.get("/", async (req,res) => {
    try{
    const finanza = await getFinanza()
    res.json(finanza)
    }catch(error){
        console.log(error)
    }
})

financieroRoutes.post("/", async (req,res) => {
    try{
    const newPago = await newPay(req.body)
    res.json({status:newPago})
    }
    catch(error){
        console.log(error)
    }
})

financieroRoutes.put("/", (req,res) => {
    res.json({users:"Edita un ingreso"})
})

financieroRoutes.delete("/:id", async (req,res) => {
    try{
        const newPago = await deletePay(req.params.id)
        res.json({status:newPago})
        }
        catch(error){
            console.log(error)
        }
})

module.exports = financieroRoutes