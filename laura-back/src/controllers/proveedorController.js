const {Proveedor} = require("../db")

module.exports = {
    getProveedor: async (id) => {
    const proveedor = await Proveedor.findOne({where:{id:id}})
    return proveedor
    },
    getProveedores: async () => {
        const proveedor = await Proveedor.findAll()
        return proveedor
    },
    postProveedor: async (data) => {
        await Proveedor.create(data)
        return "Exitoso"
    },
    deleteProveedor: async (id) => {
        const proveedor = await Proveedor.findOne({where:{id:id}})
        if(proveedor){
            await proveedor.destroy()
            return "Proveedor eliminado"
        }else{
            return "Proveedor no encontrado"
        }
    },
    putProveedor: async (data) => {
        const proveedor = await Proveedor.findByPk(data.id)
        if(proveedor){
            if(data.name) proveedor.name = data.name
            if(data.celular) proveedor.celular = data.celular
            if(data.direccion) proveedor.direccion = data.direccion
            if(data.departamento) proveedor.departamento = data.departamento
            if(data.ciudad) proveedor.ciudad = data.ciudad
            if(data.image) proveedor.image = data.image
            await proveedor.save()
            return "Proveedor editado con exito"
        }else return "No encontrado"
    }
}