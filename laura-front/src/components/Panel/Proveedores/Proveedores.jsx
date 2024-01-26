import style from './Proveedores.module.css'
import { useEffect, useState } from 'react';
import PacienteDetail from './ProveedoresDetail';
import PacienteForm from './ProveedoresForm';
import axios from "axios"
import toast, {Toaster} from "react-hot-toast"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Proveedores = ({find}) => {

  const [pacienteId, setPacienteId] = useState(null)
  const [create, setCreate] = useState(false)


  const [pacientes, setPacientes] = useState()
  
  const [filterP, setFilterP] = useState()
  
  const newClient = () => {
    updateUsers()
    setPacienteId(null); 
  }
  
  useEffect(() => {
    axios.get("/proveedor/all")
    .then(({data}) => {setPacientes(data); setFilterP(data)})
  },[])
  
  const updateUsers = () => {
    axios.get("/proveedor/all")
    .then(({data}) => {setPacientes(data); setFilterP(data)})
  }

  useEffect(() => {
    if(!find?.length){
      return setFilterP(pacientes)
    }else{
      setFilterP(pacientes?.filter(p => p.cedula.includes(find)))
    }
  },[find])

  return(
    <>
    <Toaster position="top-center"/>
      <div className={style.pacientes}>
      { create == false && pacienteId == null && <><h1>Proveedores</h1>
      {JSON.parse(localStorage.getItem("user")).role >= 3 && <button onClick={() => setCreate(true)} className={style.button}>Nuevo proveedor</button>}<br></br><br></br>
      {window.innerWidth < 1300 ? <Table className={style.tabla}>
      <Thead>
        <Tr>
          <Th className={style.topTd}>Nombre</Th>
          <Th className={style.topTd}>Fecha</Th>
        </Tr>
      </Thead>
      <Tbody>
        {filterP?.sort((a,b) => a.name.localeCompare(b.name)).map( u =>
          <Tr className={style.tr} onClick={() => setPacienteId(u.id)}>
          <Td className={style.td}>{u.name}</Td>
          <Td className={style.td}>{u.date}</Td>
          </Tr>)}
      </Tbody>
    </Table>:<table className={style.tabla}>
          <tr>
          <td className={style.topTd}>Nombre</td>
          <td className={style.topTd}>Fecha</td>
          </tr>
          {filterP?.sort((a,b) => a.name.localeCompare(b.name)).map( u =>
          <tr className={style.tr} onClick={() => setPacienteId(u.id)}>
          <td className={style.td}>{u.name}</td>
          <td className={style.td}>{u.date}</td>
          </tr>)}
        </table>}
    <br></br>
    </>}
        {create && <PacienteForm updateUsers={() => updateUsers()} back={() => setCreate(false)}/>}
        {pacienteId !== null && <PacienteDetail pacienteId={pacienteId} back={() => newClient()}/>}
        <br></br>
      </div>
    </>
  )
};

export default Proveedores