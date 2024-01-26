import style from './Agenda.module.css'
import { useEffect, useState } from 'react';
import Calendary from './Calendary';
import axios from 'axios';

const Agenda = ({fn, newDate,dateSelected, date, esp, hijoFunc}) => {

  const [id, setId] = useState()

  const [users, setUsers] = useState()
  const [sede, setSede] = useState(null)


  useEffect(() => {
    axios.get("/user").then(({data}) => {
      if(JSON.parse(localStorage.getItem("user")).role == 3){
        return
      }else if (JSON.parse(localStorage.getItem("user")).role == 2 || JSON.parse(localStorage.getItem("user")).role == 1){
        setSede(JSON.parse(localStorage.getItem("user")).sede[0])
      }
    })
  },[])

  useEffect(() => {
    axios.get("/user").then(({data}) => {
    setUsers(data.filter(u => (u.sede.includes(sede) && u.role != 4 && u.especialidad != "Otra")))
    })
  },[sede])

  if(id) return <Calendary volver={() => setId(null)} dateSelected={dateSelected} hijoFunc={hijoFunc} id={id} date={date} newDate={newDate} esp={esp} fn={fn}/>


  return(
    <>
    {sede === null ?
    <div className={style.agenda}>
    <h1>Selecciona una sede</h1>
    <div style={{display:"flex", flexDirection:"column", gap:"25px", margin:"0 auto"}}>
    <div className={style.especialista} style={{width: window.innerWidth < 500 ? "270px":"350px"}} onClick={() => setSede("Restrepo")}>
      <p className={style.nameCity}>Restrepo</p>
    </div>
    <div className={style.especialista} style={{width: window.innerWidth < 500 ? "270px":"350px"}} onClick={() => setSede("Villavicencio")}>
      <p className={style.nameCity}>Villavicencio</p>
    </div>
    </div>
  </div>
    :
      <div className={style.agenda}>
        <h1>Selecciona una especialista</h1>
        <div style={{display:"flex", flexDirection:"column", gap:"25px", margin:"0 auto"}}>
        {users?.map(u => 
        <div className={style.especialista} style={{width: window.innerWidth < 500 ? "280px":"350px"}} onClick={() => setId(u.id)}>
          <img className={style.userImage} src={u.image}/>
          <div className={style.detailContainer}>
          <p className={style.name}>{u.name} {u.lastname}</p>
          <p className={style.especialidad}>{u.especialidad}</p>
          </div>
        </div>
        )}
        {(JSON.parse(localStorage.getItem("user")).role >= 3) && <button className={style.button} style={{width:"200px", margin:"0 auto"}} onClick={() => setSede(null)}>Volver</button>}
        </div>
      </div>}
    </>
  )
};

export default Agenda