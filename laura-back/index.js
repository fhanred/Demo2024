const app = require("./src/app")
const {conn} = require("./src/db")
const {Procedimientos} = require("./src/db")
const precios = require("./src/precios.js")

conn.sync({alter:true}).then(() => {
    console.log("Conectado a la base de datos")
    Procedimientos.findAll()
    .then((data) => {
        if(!data.length){
            Procedimientos.bulkCreate(precios).then(() => {
                console.log("Procedimientos creados con exito")
            })
        }
    })
    app.listen(3002, () => {
        console.log("Servidor en linea en el puerto 3002")
    })
}, (error) => console.log(error))