const {Router} = require("express")
const temperaturaRoutes = Router()
const {newTemp, getTemp} = require("../controllers/temperaturaController")

temperaturaRoutes.get("/", async (req,res) => {
    try{
        const temp = await getTemp()
        res.json(temp)
    }
    catch(error){
        console.log(error)
    }
})

temperaturaRoutes.post("/", async (req,res) => {
    try{
    const temp = await newTemp(req.body)
    res.json({users:temp})
    }
    catch(error){
        console.log(error)
    }
})

module.exports = temperaturaRoutes