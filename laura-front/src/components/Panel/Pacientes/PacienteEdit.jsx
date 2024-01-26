import { useNavigate } from 'react-router-dom'
import style from './PacienteForm.module.css'
import CanvasDraw from 'react-canvas-draw'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const PacienteEdit = ({ back, user }) => {

  const [form, setForm] = useState({
    id:user?.id,
    image: user?.image,
    cedula: user?.cedula,
    name: user?.name,
    nacimiento: user?.nacimiento,
    direccion: user?.direccion,
    departamento: user?.departamento,
    ciudad: user?.ciudad,
    celular: user?.celular
  })
  var formCheck = []

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

  const handleFormCheck = (e) => {
    const {name,checked} = e.target
    formCheck[name] = checked
  }

  const editClient = async () => {
      await axios.put("/client/", {...form, id:user.id})
      back()
    toast.success("Editado con exito")
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
              <input value={form?.cedula} name="cedula" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Cedula</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.name} name="name" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Nombre y apellido</label>
            </div>
            <div className={style.inputContainer}>
              <input value={form?.nacimiento} type="date" name="nacimiento" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Fecha de nacimiento</label>
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
            <div className={style.inputContainer}>
              <input value={form?.celular} name="celular" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Celular</label>
            </div>
            <div className={style.inputContainer}>
              <input type="date" name="proxci" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Proxima cita</label>
            </div>
          </div>
        </div>
        <button className={style.button} style={{display:"flex", margin:"20px auto"}} onClick={editClient}>Editar cliente</button>
      </div>
    </>
  )
}

export default PacienteEdit