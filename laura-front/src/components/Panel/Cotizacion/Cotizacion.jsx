import { useEffect, useState } from 'react'
import style from '../Pacientes/Pacientes.module.css'
import CotizacionDetail from './CotizacionDetail'
import CotizacionCrear from './CotizacionCrear'
import axios from 'axios'

const Cotizacion = () => {

    const [id, setId] = useState(null)
    const [creator, setCreator] = useState(null)
    const [coti, setCoti] = useState()

    useEffect(() => {
      axios.get("/client/cotizaciones/all").then(({data}) => {setCoti(data)})
    },[])

    const updateCoti = () => {
      axios.get("/client/cotizaciones/all").then(({data}) => {setCoti(data)})
    }

    if(id) return <CotizacionDetail id={id} volver={() => setId(null)}/>
    if(creator) return <CotizacionCrear volver={() => {setCreator(null); updateCoti()}}/>
    return(
        <div>
        <h1 style={{textAlign:"center"}}>Cotizaciones</h1> 
        <table className={style.evolucion}>
          <tr>
          <td className={style.topTd}>ID</td>
          <td className={style.topTd}>Fecha</td>
          <td className={style.topTd}>Cliente</td>
          <td className={style.topTd}>Items</td>
          <td className={style.topTd}>Precio</td>
          </tr>
          {coti?.map (c => 
          <tr onClick={() => setId(c.id)}>
          <td className={style.td}>{c.id}</td>
          <td className={style.td}>{c.date}</td>
          <td className={style.td}>{c.client?.name}</td>
          <td className={style.td}>{c.proced.length}</td>
          <td className={style.td}>${Number(c.price).toLocaleString()}</td>
          </tr>
          )}
        </table>
        <br></br>
        <div className={style.buttons}>
        <button className={style.button} onClick={() => setCreator(true)}>Agregar</button>
        </div>
        </div>
    )
}

export default Cotizacion