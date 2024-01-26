import style from './InventarioCreate.module.css'
import { useEffect, useState } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const InventarioEdit = ({ back, updateInventario, id }) => {

  const [form, setForm] = useState()

  const [item, setItem] = useState()

  const [proveedores, setProveedores] = useState()

  const handleForm = (e) => {
    const {name,value} = e.target
    setForm({...form, [name]: value})
  }

  const editItem = async () => {
    back()
    await axios.put("/inventario", {...form, id:id})
    updateInventario()
    toast.success("Editado con exito")
  }

  const deleteItem = async () => {
    back()
    await axios.delete("/inventario/delete/"+id)
    updateInventario()
    toast.success("Eliminado con exito")
  }

  useEffect(() => {
    axios.get("/proveedor/all").then(({data}) => setProveedores(data))
    axios.get("/inventario/item/"+id).then(({data}) => setForm(data))
  },[])

  return (
    <>
    <Toaster/>
<div className={style.clinicHistory}>
        <button className={style.button} onClick={back}>Volver</button>
        <br></br>
        <br></br>
        <div className={style.row} style={window.innerWidth > 1300 ? {flexDirection:"row"} : {flexDirection:"column"}}>
          <div className={style.column}>
            <div className={style.inputContainer}>
              <input value={form?.codigo} name="codigo" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Codigo</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.name} name="name" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Nombre</label>
            </div>
            <div className={style.inputContainer}>
            <select name="proveedor" onChange={handleForm} className={style.input} placeholder=' '>
              <option selected value={null}>Seleccionar</option>
              {proveedores?.map(p => <option value={`${p.name}`}>{p.name}</option>)}
            </select>
            <label className={style.textInput}>Proveedor</label>
          </div>
          <div className={style.inputContainer}>
              <input value={form?.costo} name="costo" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Costo</label>
            </div>
          </div>
          <div className={style.column}>
            <div className={style.inputContainer}>
              <input value={form?.descripcion} name="descripcion" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Descripcion</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.cantidad} name="cantidad" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.alerta} name="alerta" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad Alerta</label>
            </div>
          </div>
        </div>
        <button className={style.button} style={{display:"flex"}} onClick={editItem}>Guardar</button>
        <br></br>
        <button className={style.button} style={{display:"flex"}} onClick={deleteItem}>Eliminar item</button>
      </div>
    </>
  )
}

export default InventarioEdit