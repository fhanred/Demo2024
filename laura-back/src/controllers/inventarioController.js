const {Inventario} = require("../db")

module.exports = {
    getItems: async () => {
        const inventario = Inventario.findAll()
        return inventario
    },
    getItem: async (id) => {
        const item = Inventario.findByPk(id)
        return item
    },
    postItem: async (item) => {
        await Inventario.create(item)
    },
    putItem: async (data) => {
        const item = await Inventario.findByPk(data.id)
        if(item){
            //Actualizar el item
            if(data.name) item.name = data.name
            if(data.descripcion) item.descripcion = data.descripcion
            if(data.cantidad) item.cantidad = data.cantidad
            if(data.alerta) item.alerta = data.alerta
            if(data.codigo) item.codigo = data.codigo
            if(data.proveedor) item.proveedor = data.proveedor
            await item.save()
            return "Encontrado"
        }
        else return "No encontrado"
    },
    deleteItem: async (id) => {
        const item = await Inventario.findByPk(id)
        if(item){
           await item.destroy()
           return "Eliminado"
        } else return "No encontrado"
    }
}