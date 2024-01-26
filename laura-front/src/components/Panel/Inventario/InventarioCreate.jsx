import style from './InventarioCreate.module.css'
import { useEffect, useState } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const InventarioCreate = ({ back, updateInventario, sede }) => {

  const [form, setForm] = useState({})
  const [proveedores, setProveedores] = useState()

  const handleForm = (e) => {
    const {name,value} = e.target
    setForm({...form, [name]: value})
  }

  const createItem = async () => {
    back()
    const {data} = await axios.post("/inventario", {...form, sede:sede})
    updateInventario()
    toast.success("Creado con exito")
  }

  useEffect(() => {
    axios.get("/proveedor/all").then(({data}) => setProveedores(data))
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
          {JSON.parse(localStorage.getItem("user"))?.role == 3 && <div className={style.inputContainer}>
              <input value={form?.ciudad} name="costo" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Costo</label>
            </div>}
          </div>
          <div className={style.column}>
            <div className={style.inputContainer}>
              <input value={form?.descripcion} name="descripcion" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Descripcion</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.ciudad} name="cantidad" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.ciudad} name="alerta" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cantidad Alerta</label>
            </div>
          </div>
        </div>
        <button className={style.button} style={{display:"flex"}} onClick={createItem}>Crear item</button>
      </div>
    </>
  )
}

export default InventarioCreate