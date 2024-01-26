import { useEffect, useState } from 'react'
import style from './InventarioCreate.module.css'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'

const InventarioGestion = ({entrada, back}) => {

    const [inventario, setInventario] = useState()
    const [proveedores, setProveedores] = useState()
    const [form, setForm] = useState()
    const [idProduct, setIdProduct] = useState()

    const handleForm = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]:value})
    }

    const getInventario = () => {
        axios.get("/inventario")
        .then(({data}) => setInventario(data))
    }

    const getProveedores = () => {
        axios.get("/proveedor/all")
        .then(({data}) => setProveedores(data))
    }

    useEffect(() => {
        getInventario()
        getProveedores()
    },[])

    const createEntrada = async () => {
        const producto = inventario.find(i => i.id == idProduct)
        await axios.post("/registro", {...form, entrada:true})
        await axios.put("/inventario", {id:producto.id, cantidad:Number(producto.cantidad)+Number(form.cantidad)})
        alert("Exitoso")
    }

    const createSalida = async () => {
        const producto = inventario.find(i => i.id == idProduct)
        if(producto.cantidad < form.cantidad) return alert("No tienes la cantidad suficiente")
        await axios.post("/registro", {...form, entrada:false})
        await axios.put("/inventario", {id:producto.id, cantidad:producto.cantidad-form.cantidad})
        alert("Exitoso")
    }

    return (
        <>
            {entrada ? <>
    <Toaster/>
<div style={{textAlign:"center", marginTop:"50px"}}>
        <button className={style.button} onClick={back}>Volver</button>
        <br></br>
        <br></br>
        {/* <div className={style.row} style={window.innerWidth > 1300 ? {flexDirection:"row"} : {flexDirection:"column"}}> */}
          <div>
          <div className={style.inputContainer2}>
              <input type="date" value={form?.date} name="date" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Fecha</label>
            </div>
            <div className={style.inputContainer2}>
              <select value={form?.producto} name="producto" onChange={(e) => {handleForm(e); setIdProduct(e.target.options[e.target.selectedIndex].id)}} className={style.input} placeholder=' '>
                {inventario?.map(p => <option id={p.id} value={`${p.name} - ${p.descripcion}`}>{p.name} - {p.descripcion}</option>)}
              </select>
              <label className={style.textInput}>Producto</label>
            </div>
            <div className={style.inputContainer2}>
            <select value={form?.proveedor} name="proveedor" onChange={handleForm} className={style.input} placeholder=' '>
                {proveedores?.map(p => <option value={p.name}>{p.name}</option>)}
              </select>
              <label className={style.textInput}>Proveedor</label>
            </div>
            <div className={style.inputContainer2}>
              <input value={form?.cantidad} name="cantidad" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad</label>
            </div>
            <div className={style.inputContainer2}>
              <input value={form?.precio} name="precio" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Precio</label>
            </div>
        <button className={style.button} onClick={createEntrada}>Crear entrada</button>
          </div>
        {/* </div> */}
      </div>
    </>: 
    <>
    <Toaster/>
<div style={{textAlign:"center", marginTop:"50px"}}>
        <button className={style.button} onClick={back}>Volver</button>
        <br></br>
        <br></br>
        {/* <div className={style.row} style={window.innerWidth > 1300 ? {flexDirection:"row"} : {flexDirection:"column"}}> */}
          <div>
          <div className={style.inputContainer2}>
              <input type="date" value={form?.date} name="date" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Fecha</label>
            </div>
            <div className={style.inputContainer2}>
              <select value={form?.producto} name="producto" onChange={(e) => {handleForm(e); setIdProduct(e.target.options[e.target.selectedIndex].id)}} className={style.input} placeholder=' '>
                {inventario?.map(p => <option id={p.id} value={`${p.name} - ${p.descripcion}`}>{p.name} - {p.descripcion}</option>)}
              </select>
              <label className={style.textInput}>Producto</label>
            </div>
            <div className={style.inputContainer2}>
              <input value={form?.cantidad} name="cantidad" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad</label>
            </div>
        <button className={style.button} onClick={createSalida}>Crear salida</button>
          </div>
        {/* </div> */}
      </div>
    </>}
        </>
    )
}

export default InventarioGestion