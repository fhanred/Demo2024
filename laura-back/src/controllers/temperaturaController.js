const {Temperatura} = require("../db")

module.exports = {
    getTemp: async () => {
        const temp = await Temperatura.findAll({where:{type:"1"}})
        const hume = await Temperatura.findAll({where:{type:"2"}})
        const frio = await Temperatura.findAll({where:{type:"3"}})
        return {temp,hume,frio}
    },
    newTemp: async (data) => {
        await Temperatura.create(data)
        return "Creado exitosamente"
    }
}