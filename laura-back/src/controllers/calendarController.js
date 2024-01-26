const {Calendar} = require("../db")

module.exports = {
    getDates: async () => {
        const dates = await Calendar.findAll()
        return dates
    },
    getDatesById: async (id) => {
        const dates = await Calendar.findAll({where:{
            especialista:id
        }})
        return dates
    },
    postDate: async (data) => {
        await Calendar.create(data)
        return "Creado exitosamente"
    },
    deleteDate: async (id) => {
        const date = await Calendar.findOne({
            where:{
                id:id
            }
        })
        if(date){
            date.destroy()
            date.save()
            return "Eliminado exitosamente"
        }
        return "Date no encontrada"
    },
    putDate: async (data) => {
        const date = await Calendar.findOne({
            where:{
                id:data.id
            }
        })
        if(date){
            if(data.confirmada) date.confirmada = data.confirmada
            if(data.start) date.start = data.start
            if(data.end) date.end = data.end
            await date.save()
            return "Eliminado exitosamente"
        }
        return "Date no encontrada"
    }
}