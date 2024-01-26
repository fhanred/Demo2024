const {Router} = require("express")
const userRoutes = Router()
const {newUser, verifyUser, authUser, putUser, getUsers, deleteUser, newCate, getCate, getProce, postProce, getUserById, delCate, delProce} = require("../controllers/userController")

userRoutes.delete("/cate/id/:id", async (req,res) => {
    console.log(req.params.id)
    try{
    const user = await delCate(req.params.id)
    res.json({status:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.get("/", async (req,res) => {
    try{
        const users = await getUsers()
        res.json(users)
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.get("/id/:id", async (req,res) => {
    try{
        const users = await getUserById(req.params.id)
        res.json(users)
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.post("/verify", async (req,res) => {
    try{
    const {status,user,token} = await verifyUser(req.body)
    res.json({status:status,user:user, token:token})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.post("/auth", (req,res) => {
    try{
    const {status, user} = authUser(req.body)
    res.json({status:status, user:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.post("/", async (req,res) => {
    try{
        const user = await newUser(req.body)
        res.json({users:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.put("/", async (req,res) => {
    try{
    const edit = await putUser(req.body)
    res.json({users:edit})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.delete("/:id", async (req,res) => {
    try{
    const user = await deleteUser(req.params.id)
    res.json({status:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.post("/categoria", async (req,res) => {
    try{
    const user = await newCate(req.body)
    res.json({status:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.get("/categoria", async (req,res) => {
    try{
    const cate = await getCate()
    res.json(cate)
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.post("/procedimientos", async (req,res) => {
    try{
    const user = await postProce(req.body)
    res.json({status:user})
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.delete("/proce/id/:id", async (req,res) => {
    try{
    const cate = await delProce(req.params.id)
    res.json(cate)
    }
    catch(error){
        console.log(error)
    }
})

userRoutes.get("/procedimientos", async (req,res) => {
    try{
    const cate = await getProce()
    res.json(cate)
    }
    catch(error){
        console.log(error)
    }
})

module.exports = userRoutes