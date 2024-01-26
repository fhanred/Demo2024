import { useState } from 'react'
import style from './SelectReport.module.css'
import Reportes from "./Reportes"
import ReportesInventario from "./ReportesInventario"

const SelectReport = () => {

    const [type, setType] = useState(0)

    if(type == 1) return <Reportes />
    if(type == 2) return <ReportesInventario />
    return (
        <>
            <div className={style.agenda}>
    <h1>Selecciona un tipo</h1>
    <div style={{display:"flex", flexDirection:"column", gap:"25px", margin:"0 auto"}}>
    <div className={style.especialista} style={{width: window.innerWidth < 500 ? "270px":"350px"}} onClick={() => setType(1)}>
      <p className={style.nameCity}>Ventas/Gastos</p>
    </div>
    <div className={style.especialista} style={{width: window.innerWidth < 500 ? "270px":"350px"}} onClick={() => setType(2)}>
      <p className={style.nameCity}>Inventario</p>
    </div>
    </div>
  </div>
        </>
    )
}

export default SelectReport