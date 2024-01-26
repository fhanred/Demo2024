import style from './Inventario.module.css'
import { useEffect, useState } from 'react';
import axios from "axios"
import toast, {Toaster} from "react-hot-toast"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InventarioCreate from './InventarioCreate';
import { GoAlertFill } from "react-icons/go";
import InventarioEdit from './InventarioEdit';
import InventarioGestion from './InventarioGestion';
import ReactHTMLTableToExcel from "react-html-table-to-excel"

const Inventario = ({sede}) => {

  const [edit, setEdit] = useState(null)
  const [create, setCreate] = useState(false)
  const [entrada, setEntrada] = useState(false)
  const [salida, setSalida] = useState(false)


  const [inventario, setInventario] = useState()
  
  const updateInventario = () => {
    axios.get("/inventario")
    .then(({data}) => setInventario(data.filter(d => d.sede.includes(sede))))
  }

  useEffect(() => {
    updateInventario()
  },[])
  
  if(edit) return <InventarioEdit id={edit} back={() => setEdit(null)} updateInventario={updateInventario}/>
  if(create) return <InventarioCreate sede={sede} back={() => setCreate(false)} updateInventario={updateInventario}/>
  if(entrada) return <InventarioGestion back={() => setEntrada(false)} entrada={true}/>
  if(salida) return <InventarioGestion back={() => setSalida(false)} entrada={false}/> 

  return(
    <>
    <Toaster position="top-center"/>
      <div className={style.pacientes}>
      <><h1>Inventario {sede}</h1>
      <button onClick={() => setCreate(true)} className={style.button}>Nuevo item</button><br></br><br></br>
      <button onClick={() => setEntrada(true)} className={style.button}>Entrada</button><br></br><br></br>
      <button onClick={() => setSalida(true)} className={style.button}>Salida</button><br></br><br></br>
      <ReactHTMLTableToExcel 
          id="test"
          className={style.button}
          table="inventario2"
          filename="inventario"
          sheet="reporte"
          buttonText="Descargar excel"
        /><br></br><br></br>
      {window.innerWidth < 1300 ? <Table className={style.tabla}>
      <Thead>
        <Tr>
          <Th className={style.topTd}>Codigo</Th>
          <Th className={style.topTd}>Nombre</Th>
          <Th className={style.topTd}>Descripcion</Th>
          <Th className={style.topTd}>Proveedor</Th>
          <Th className={style.topTd}>Cantidad</Th>
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <Th className={style.topTd}>Costo</Th>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) &&<Th className={style.topTd}>Total</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {inventario?.sort((a,b) => a.codigo-b.codigo).map( u =>
          <Tr className={style.tr} onClick={() => setEdit(u.id)}>
          <Td className={style.td}>{u.codigo}</Td>
          <Td className={style.td}>{u.name}</Td>
          <Td className={style.td}>{u.descripcion}</Td>
          <Td className={style.td}>{u.proveedor}</Td>
          <Td className={style.td}>{u.cantidad <= u.alerta && <GoAlertFill color='orange'/>} {u.cantidad}</Td>
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <Td className={style.td}>${u.costo ? u.costo.toLocaleString(): ""}</Td>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) &&<Td className={style.td}>${u.costo ? (u.cantidad*u.costo).toLocaleString() : ""}</Td>}
          </Tr>)}
      </Tbody>
    </Table>:<table className={style.tabla} id="inventario2">
          <tr>
          <td className={style.topTd}>Codigo</td>
          <td className={style.topTd}>Nombre</td>
          <td className={style.topTd}>Descripcion</td>
          <td className={style.topTd}>Proveedor</td>
          <td className={style.topTd}>Cantidad</td>
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <td className={style.topTd}>Costo</td>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) &&<td className={style.topTd}>Total</td>}
          </tr>
          {inventario?.sort((a,b) => a.codigo-b.codigo).map( u =>
          <tr className={style.tr} onClick={() => setEdit(u.id)}>
          <td className={style.td}>{u.codigo}</td>
          <td className={style.td}>{u.name}</td>
          <td className={style.td}>{u.descripcion}</td>
          <td className={style.td}>{u.proveedor}</td>
          <td className={style.td}>{u.cantidad <= u.alerta && <GoAlertFill color='orange'/>} {u.cantidad}</td>
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <td className={style.td}>${u.costo ? u.costo.toLocaleString(): ""}</td>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) &&<td className={style.td}>${u.costo ? (u.cantidad*u.costo).toLocaleString():""}</td>}
          </tr>)}
        </table>}
    <br></br>
        </>
        {/* {create && <PacienteForm updateInventario={() => updateInventario()} back={() => setCreate(false)}/>}
        {pacienteId !== null && <PacienteDetail pacienteId={pacienteId} back={() => newClient()}/>} */}
        <br></br>
      </div>
    </>
  )
};

export default Inventario