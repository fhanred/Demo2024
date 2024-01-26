import { useState } from 'react'
import style from './SelectSede.module.css'
import Inventario from './Inventario'

const SelectSede = () => {

    const [sede, setSede] = useState(null)

    if(sede !== null) return <Inventario sede={sede}/>

    return (
        <>
                <div className={style.agenda}>
                    <h1>Selecciona una sede</h1>
                    <div style={{ display: "flex", flexDirection: "column", gap: "25px", margin: "0 auto" }}>
                        <div className={style.especialista} style={{ width: window.innerWidth < 500 ? "270px" : "350px" }} onClick={() => setSede("Restrepo")}>
                            <p className={style.nameCity}>Restrepo</p>
                        </div>
                        <div className={style.especialista} style={{ width: window.innerWidth < 500 ? "270px" : "350px" }} onClick={() => setSede("Villavicencio")}>
                            <p className={style.nameCity}>Villavicencio</p>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default SelectSede