import { useEffect, useState } from 'react'
import style from './Recordatorios.module.css'
import toast, { Toaster } from 'react-hot-toast'
import axios from "axios"
import reminder from "../../../assets/reminder.png"
import { confirmAlert } from 'react-confirm-alert'

const Recordatorios = ({newReco, update}) => {

    const [recordatorio, setRecordatorio] = useState()

    const getRecordatorios = () => {
        axios.get("/recordatorio/all")
        .then(({data}) => setRecordatorio(data))
    }

    const [deleteId, setDeleteId] = useState(null)

    const options = {
        title: '¿Estás seguro?',
        message: 'Este proceso no se puede revertir',
        buttons: [
          {
            label: 'Si',
            onClick: () => deleteRecordatorio(deleteId)
          },
          {
            label: 'No',
            onClick: () => setDeleteId(null)
          }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        keyCodeForClose: [8, 32],
        willUnmount: () => {},
        afterClose: () => {},
        onClickOutside: () => {},
        onKeypress: () => {},
        onKeypressEscape: () => {},
        overlayClassName: "overlay-custom-class-name"
      };

    useEffect(() => {
        if(deleteId == null) return
        confirmAlert(options)
    },[deleteId])

    useEffect(() => {
        getRecordatorios()
    },[])

    const deleteRecordatorio = async (id) => {
        await axios.delete("recordatorio/"+id)
        toast.success("Eliminado exitosamente")
        getRecordatorios()
    }

    useEffect(() => {
        getRecordatorios()
    },[update])

    return (
        <>
        <Toaster position="top-center"/>
      <div className={style.pacientes}>
      <h1>Recordatorios</h1>
      <button onClick={newReco} className={style.button}>Nuevo recordatorio</button><br></br><br></br>
      {recordatorio?.map (r => 
      <div onClick={() => setDeleteId(r.id)} className={style.especialista} style={{width: window.innerWidth < 500 ? "280px":"350px"}}>
          <img className={style.userImage} src={reminder}/>
          <div className={style.detailContainer}>
          <p className={style.name}>{r.recuerda}</p>
          <p className={style.especialidad}>El dia {r.dia} de cada mes</p>
          </div>
        </div>)}
      </div>
      </>
    )
}

export default Recordatorios