const {Recordatorio} = require("../db")

module.exports = {
    getRecordatorio: async (id) => {
        const recordatorio = await Recordatorio.findByPk(id)
        return recordatorio
    },
    getRecordatorios: async () => {
        const recordatorio = await Recordatorio.findAll()
        return recordatorio
    },
    postRecordatorio: async (data) => {
        const recordatorio = await Recordatorio.create(data)
        return recordatorio
    },
    deleteRecordatorio: async (id) => {
        const recordatorio = await Recordatorio.findByPk(id)
        if(recordatorio){
            await recordatorio.destroy()
            return "Eliminado"
        }else return "No encontrado"
    }
}