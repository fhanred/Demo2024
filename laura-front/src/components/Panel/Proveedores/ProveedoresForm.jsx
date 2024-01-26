import { useNavigate } from 'react-router-dom'
import style from './ProveedoresForm.module.css'
import CanvasDraw from 'react-canvas-draw'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const ProveedoresForm = ({ back, updateUsers }) => {

  const [form, setForm] = useState({
    image: "https://us.123rf.com/450wm/salamatik/salamatik1801/salamatik180100019/92979836-perfil-an%C3%B3nimo-icono-de-la-cara-persona-silueta-gris-avatar-masculino-por-defecto-foto-de.jpg"
  })

  const uploadImage = async (e) => {
    const files = e.target.files;
    const dato = new FormData();
    dato.append("file", files[0]);
    dato.append("upload_preset","natalie")
    dato.append("api_key","612393625364863")
    dato.append("timestamp", 0)
    const res = await axios.post("https://api.cloudinary.com/v1_1/dftvenl2z/image/upload", dato)
    setForm({...form, image:res.data.secure_url})
  }

  const handleForm = (e) => {
    const {name,value} = e.target
    setForm({...form, [name]: value})
  }

  const createClient = async () => {
    back()
    await axios.post("/proveedor", {...form, date:new Date()})
    updateUsers()
    toast.success("Creado con exito")
  }

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
              <input value={form?.name} name="name" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Nombre</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.celular} name="celular" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Celular</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.rut} name="rut" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Rut</label>
            </div>
            <div className={style.inputContainer}>
              <input type="file" name="image" onChange={uploadImage} className={style.input} placeholder=' '></input>
            </div>
          </div>
          <div className={style.column}>
            <div className={style.inputContainer}>
              <input value={form?.direccion} name="direccion" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Direccion</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.departamento} name="departamento" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Departamento</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.ciudad} name="ciudad" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Ciudad</label>
            </div>
          </div>
        </div>
        <button className={style.button} style={{display:"flex", margin:"20px auto"}} onClick={createClient}>Crear proveedor</button>
      </div>
    </>
  )
}

export default ProveedoresForm