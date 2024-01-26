const {Registro} = require("../db")

module.exports = {
    getRegistros: async () => {
    const proveedor = await Registro.findAll()
    return proveedor
    },
    postRegistro: async (data) => {
        await Registro.create(data)
        return "Exitoso"
    },
    deleteRegistro: async (id) => {
        const registro = await Registro.findOne({where:{id:id}})
        if(registro){
            await registro.destroy()
            return "Proveedor eliminado"
        }else{
            return "Proveedor no encontrado"
        }
    },
    putRegistro: async (data) => {
        const registro = await Registro.findByPk(data.id)
        if(registro){
            if(data.producto) registro.producto = data.producto
            if(data.proveedor) registro.proveedor = data.proveedor
            if(data.precio) registro.precio = data.precio
            if(data.date) registro.date = data.date
            await registro.save()
            return "Proveedor editado con exito"
        }else return "No encontrado"
    }
}