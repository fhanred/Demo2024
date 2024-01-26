import axios from 'axios'
import style from './Reportes.module.css'
import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Example from '../Financiero/ChartGasto';
import ReactHTMLTableToExcel from "react-html-table-to-excel"

const Reportes = () => {

    const [inventario, setInventario] = useState()
    const [usuarios, setUsuarios] = useState()
    const [cate,setCate] = useState()
    const [proveedores, setProveedores] = useState()

  const getInventario = async () => {
    axios.get("/proveedor/all")
    .then(({data}) => {setProveedores(data)})
    const { data } = await axios.get("/registro")
    setInventario(data)
    // setCate(cate.data)
    setInventarioFilter(data)
  }

  useEffect(() => {
    getInventario()
    getData()
    axios.get("/user/categoria")
    .then(({data}) => setCate(data))
    axios.get("/user")
    .then(({data}) => setUsuarios(data))
  },[])

  const [comisionado, setComisionado] = useState(0)
  const [desde, setDesde] = useState("2022-10-20")
  const [hasta, setHasta] = useState("2025-10-20")
  const [tipo, setTipo] = useState("Todos")
  const [inventarioFilter, setInventarioFilter] = useState(inventario)
  const [proveedor, setProveedor] = useState("Todos")
  const [atendio, setAtendio] = useState("Cualquiera")
  const [idAtendio, setIdAtendio] = useState(null)
  const [codigo, setCodigo] = useState(null)
  const [costo, setCosto] = useState(1)

  const filtradoPago = () => {
    // var fechasEnRango = inventario
    var fechasEnRango = inventario.filter((pago) => pago.date >= desde && pago.date <= hasta);
    // if(codigo !== null){
    //   fechasEnRango = fechasEnRango.filter(pago => pago.codigo.includes(codigo))
    // }
    if (proveedor !== "Todos"){
      fechasEnRango = fechasEnRango.filter(pago => pago.proveedor == proveedor)
    }
    if(costo == 1) {
      fechasEnRango = fechasEnRango.sort((a,b) => a.precio - b.precio)
    }
    if(costo == 2) {
      fechasEnRango = fechasEnRango.sort((a,b) => b.precio - a.precio)
    }
    return setInventarioFilter(fechasEnRango)
  }

  const [datos, setDatos] = useState()

const getData = () => {
    const data = inventario?.reduce((accumulator, pago) => {
          const existingCat = accumulator.find((item) => item.name === pago.categoria);
          if(pago.monto < 0){
            if (existingCat) {
              if (existingCat.value == undefined) {
                existingCat.value = 0; // Inicializa como 0 si es undefined
              }
              existingCat.value += Number(pago.monto.split("-")[1]);
            } else {
              accumulator.push({
                name: pago.categoria,
                value: Number(pago.monto.split("-")[1]),
              });
            }
          }
          return accumulator
        }, []);
        return setDatos(data);
}

    return (
        <>
        <div className={style.financiero}>
        <h2>Reporte inventario</h2>
        <div className={window.innerWidth > 700 && style.filtros}>
        <div className={style.inputContainer}>
          <input type="date" name="user" onChange={(e) => setDesde(e.target.value)} className={style.input} placeholder=' '></input>
          <label className={style.textInput}>Desde</label>
        </div>
        <div className={style.inputContainer}>
          <input type="date" name="user" onChange={(e) => setHasta(e.target.value)} className={style.input} placeholder=' '></input>
          <label className={style.textInput}>Hasta</label>
        </div>
        <div className={style.inputContainer}>
          <select onChange={(e) => setProveedor(e.target.value)} className={style.input}>
          <option value="Todos">Todos</option>
          {proveedores?.map(c => <option value={c.name}>{c.name}</option>)}
          </select>
          <label className={style.textInput}>Proveedor</label>
        </div>
        <div className={style.inputContainer}>
          <select onChange={(e) => setCosto(e.target.value)} className={style.input}>
          <option value={1}>Menor a mayor</option>
          <option value={2}>Mayor a menor</option>
          </select>
          <label className={style.textInput}>Costo</label>
        </div>
        </div>
        {/* <div className={style.inputContainer}>
          <input onChange={(e) => setCodigo(e.target.value.length == 0 ? null : e.target.value)} className={style.input} placeholder=' '/>
          <label className={style.textInput}>Codigo</label>
        </div> */}
        <button className={style.button} onClick={filtradoPago}>Filtrar</button><br></br><br></br> 
        <ReactHTMLTableToExcel 
          id="test"
          className={style.button}
          table="inventario"
          filename="reporteInventario"
          sheet="reporte"
          buttonText="Descargar excel"
        />
        <br></br><br></br>
        <br></br><br></br>
        {window.innerWidth < 1300 ? <Table className={style.tabla}>
      <Thead>
        <Tr>
          {/* <Th className={style.topTd}>Fecha</Th> */}
          <Th className={style.topTd}>Fecha</Th>
          {/* <Th className={style.topTd}>Codigo</Th> */}
          <Th className={style.topTd}>Nombre</Th>
          <Th className={style.topTd}>Proveedor</Th>
          <Th className={style.topTd}>Cantidad</Th>
          <Th className={style.topTd}>Costo</Th>
        </Tr>
      </Thead>
      <Tbody>
        {inventarioFilter?.map( u =>
          <Tr className={style.tr}>
          <Td className={style.td}>{u.date}</Td>
              <Td className={style.td}>{u.producto}</Td>
              <Td className={style.td}>{u.proveedor}</Td>
              <Td className={style.td}>{u.cantidad}</Td>
              {/* <Td className={style.td}>{u.reason}</Td> */}
              <Td className={style.td}>${Number(u.precio).toLocaleString()}</Td>
          </Tr>)}
      </Tbody>
    </Table>:<table className={style.tabla} id="inventario">
          <tr>
            <td className={style.topTd}>Fecha</td>
            {/* <td className={style.topTd}>Codigo</td> */}
            <td className={style.topTd}>Nombre</td>
            <td className={style.topTd}>Proveedor</td>
            <td className={style.topTd}>Cantidad</td>
            <td className={style.topTd}>Costo</td>
            <td className={style.topTd}>Total</td>
          </tr>
          {inventarioFilter?.map(u =>
            <tr key={u.id} className={style.tr} onClick={() => setDeleteId(u.id)}>
              <td className={style.td}>{u.date}</td>
              {/* <td className={style.td}>{u.codigo}</td> */}
              <td className={style.td}>{u.producto}</td>
              <td className={style.td}>{u.proveedor}</td>
              <td className={style.td}>{u.cantidad}</td>
              <td className={style.td}>${Number(u.precio).toLocaleString()}</td>
              <td className={style.td}>${u.cantidad ? (Number(u.cantidad) * Number(u.precio)).toLocaleString() : Number(u.precio).toLocaleString()}</td>
            </tr>)}
        </table>}
          {idAtendio && <p>Comisionado: ${Number(comisionado)?.toLocaleString()}</p>}
        {/* <h3 style={{margin:"50px 0px -50px 0px"}}>Grafica de gastos por categoria</h3>
        <div style={{width:window.innerWidth < 1300 ? "300px": "800px", height:"400px", margin:"0 auto"}}>
        <Example datos={datos}/>
        </div> */}
        <br></br>
        {/* <button className={style.button} onClick={() => setDetail(false)}>Volver</button> */}
      </div>
        </>
    )
}

export default Reportes