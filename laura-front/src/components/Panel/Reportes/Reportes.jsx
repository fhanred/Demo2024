import axios from 'axios'
import style from './Reportes.module.css'
import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Example from '../Financiero/ChartGasto';
import ReactHTMLTableToExcel from "react-html-table-to-excel"

const Reportes = () => {

  const [pagos, setPagos] = useState()
  const [usuarios, setUsuarios] = useState()
  const [cate, setCate] = useState()
  const [procedimientos, setProcedimientos] = useState()
  const [montos, setMontos] = useState()

  const getPagos = async () => {
    const cate = await axios.get("/user/categoria")
    const { data } = await axios.get("/financiero")
    setPagos(data)
    setCate(cate.data)
    setPagoFilter(data)
    const montos = data?.reduce((accumulator, pago) => {
      const existingMonth = accumulator.find((item) => item.name === pago.tipo);
      if (existingMonth) {
        if (existingMonth.total === undefined) {
          existingMonth.total = 0; // Inicializa como 0 si es undefined
        }
        existingMonth.total += Number(pago.monto);
      } else {
        accumulator.push({
          name: pago.tipo,
          total: Number(pago.monto),
        });
      }

      return accumulator;
    }, []);
    setMontos(montos)
  }

  useEffect(() => {
    getPagos()
    getData()
    axios.get("/user/categoria")
      .then(({ data }) => setCate(data))
    axios.get("/user/procedimientos")
      .then(({ data }) => setProcedimientos(data))
    axios.get("/user")
      .then(({ data }) => setUsuarios(data))
  }, [])

  const [comisionado, setComisionado] = useState(0)
  const [desde, setDesde] = useState("2022-10-20")
  const [hasta, setHasta] = useState("2025-10-20")
  const [tipo, setTipo] = useState("Todos")
  const [ingreso, setIngreso] = useState("Cualquiera")
  const [pagoFilter, setPagoFilter] = useState(pagos)
  const [categoria, setCategoria] = useState("Todos")
  const [atendio, setAtendio] = useState("Cualquiera")
  const [idAtendio, setIdAtendio] = useState(null)
  const [cliente, setCliente] = useState("Todos")
  const [sede, setSede] = useState("Cualquiera")
  const [procedimiento, setProcedimiento] = useState("Todos")

  const filtradoPago = () => {
    var fechasEnRango = pagos.filter((pago) => pago.date >= desde && pago.date <= hasta);
    if (tipo !== "Todos" && categoria !== "Todos") {
      fechasEnRango = fechasEnRango.filter(pago => pago.categoria == categoria && pago.tipo == tipo)
    }
    if (sede !== "Cualquiera") {
      fechasEnRango = fechasEnRango.filter(pago => pago.sede == sede)
    }
    if (cliente !== "Todos") {
      fechasEnRango = fechasEnRango.filter(pago => pago.user.includes(cliente))
    }
    if (atendio !== "Cualquiera") {
      fechasEnRango = fechasEnRango.filter(pago => pago.atendio != null && pago.atendio.includes(atendio))
    }
    if (tipo !== "Todos") {
      fechasEnRango = fechasEnRango.filter(pago => pago.tipo == tipo)
    }
    if (categoria !== "Todos") {
      fechasEnRango = fechasEnRango.filter(pago => pago.categoria == categoria)
    }
    if (procedimiento !== "Todos") {
      fechasEnRango = fechasEnRango.filter(pago => pago.reason.includes(procedimiento))
    }
    if (ingreso !== "Cualquiera") {
      if(ingreso == 1){
        fechasEnRango = fechasEnRango.filter(pago => pago.monto > 0)
      }else{
        fechasEnRango = fechasEnRango.filter(pago => pago.monto < 0)
      }
    }
    if (idAtendio >= 1) {
      axios.get("/user/id/" + idAtendio)
        .then(({ data }) => {
          const totalMonto = fechasEnRango.reduce((acc, pago) => pago.monto > 0 ? Number(acc) + Number(pago.monto) : Number(acc)+0, 0)
          setComisionado((totalMonto * data.comision) / 100)
        })
    }
    const montos = fechasEnRango.reduce((accumulator, pago) => {
      const existingMonth = accumulator.find((item) => item.name === pago.tipo);
      if (existingMonth) {
        if (existingMonth.total === undefined) {
          existingMonth.total = 0; // Inicializa como 0 si es undefined
        }
        existingMonth.total += Number(pago.monto);
      } else {
        accumulator.push({
          name: pago.tipo,
          total: Number(pago.monto),
        });
      }

      return accumulator;
    }, []);
    setMontos(montos)
    return setPagoFilter(fechasEnRango)
  }

  const [datos, setDatos] = useState()

  const getData = () => {
    const data = pagos?.reduce((accumulator, pago) => {
      const existingCat = accumulator.find((item) => item.name === pago.categoria);
      if (pago.monto < 0) {
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
        <h2>Reporte ventas/gastos</h2>
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
          <input className={style.input} onChange={(e) => setCliente(e.target.value)} placeholder=' ' />
          <label className={style.textInput}>Cliente</label>
        </div>
        <div className={style.inputContainer}>
          <select className={style.input} onChange={(e) => setTipo(e.target.value)}>
            <option value="Todos" selected>Todos</option>
            <option value="Bancolombia">Bancolombia</option>
            <option value="Daviplata">Daviplata</option>
            <option value="Nequi">Nequi</option>
            <option value="Datafono">Datafono</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Wompi">Wompi</option>
          </select>
          <label className={style.textInput}>Tipo de pago</label>
        </div>
        <div className={style.inputContainer}>
          <select className={style.input} onChange={(e) => setIngreso(e.target.value)}>
            <option value="Cualquiera" selected>Cualquiera</option>
            <option value={1}>Ingresos</option>
            <option value={2}>Gastos</option>
          </select>
          <label className={style.textInput}>Ingresos/Gastos</label>
        </div>
        <div className={style.inputContainer}>
          <select className={style.input} onChange={(e) => setProcedimiento(e.target.value)}>
            <option value="Todos" selected>Todos</option>
            {procedimientos?.sort((a,b) => a.label.localeCompare(b.label)).map(p => <option value={p.label}>{p.label}</option>)}
          </select>
          <label className={style.textInput}>Procedimiento</label>
        </div>
        <div className={style.inputContainer}>
          <select className={style.input} onChange={(e) => { setAtendio(e.target.value); setIdAtendio(e.target.options[e.target.selectedIndex].id) }}>
            <option selected value="Cualquiera">Cualquiera</option>
            {usuarios?.map(c => (c.role == 1 || c.role == 2 || c.role == 3) && <option id={c.id} value={`${c.name} ${c.lastname}`}>{c.name} {c.lastname}</option>)}
          </select>
          <label className={style.textInput}>Atendio</label>
        </div>
        <div className={style.inputContainer}>
          <select className={style.input} onChange={(e) => setSede(e.target.value)}>
            <option selected value="Cualquiera">Cualquiera</option>
            <option value={`Restrepo`}>Restrepo</option>
            <option value={`Villavicencio`}>Villavicencio</option>
          </select>
          <label className={style.textInput}>Sede</label>
        </div>
        <div className={style.inputContainer}>
          {/* <input name="reason" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input> */}
          <select onChange={(e) => setCategoria(e.target.value)} className={style.input}>
            <option value="Todos">Todas</option>
            {cate?.map(c => <option value={c.name}>{c.name}</option>)}
            {/* <option value="Personal">Personal</option>
            <option value="Salarios">Salarios</option>
            <option value="Insumos">Insumos</option>
            <option value="Arriendo">Arriendo</option> */}
          </select>
          <label className={style.textInput}>Categoria</label>
        </div>
        </div>
        <button className={style.button} onClick={filtradoPago}>Filtrar</button><br></br><br></br>
        <ReactHTMLTableToExcel 
          id="test"
          className={style.button}
          table="financiero"
          filename="reporteFinanciero"
          sheet="reporte"
          buttonText="Descargar excel"
        />
        {/* <button className={style.button} onClick={filtradoPago}>Descargar excel</button> */}
        <br></br><br></br>
        <br></br><br></br>
        <div>
          {montos?.map(m => <div>
            <p>{m.name}: ${m.total.toLocaleString()}</p>
          </div>)}
          <p>Total: ${montos?.reduce((acc, monto) => acc + monto.total, 0).toLocaleString()}</p>
          {(idAtendio || JSON.parse(localStorage.getItem("user")).role != 3) && <p>Comisionado: ${Number(comisionado)?.toLocaleString()}</p>}
        </div>
        {window.innerWidth < 1300 ? <Table className={style.tabla}>
          <Thead>
            <Tr>
              {/* <Th className={style.topTd}>Fecha</Th> */}
              <Th className={style.topTd}>Fecha</Th>
              <Th className={style.topTd}>Causante</Th>
              <Th className={style.topTd}>Atendio</Th>
              <Th className={style.topTd}>Categoria</Th>
              <Th className={style.topTd}>Descripcion</Th>
              <Th className={style.topTd}>Valor</Th>
              <Th className={style.topTd}>Pago</Th>
              <Th className={style.topTd}>Factura</Th>
              <Th className={style.topTd}>Recibo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pagoFilter?.map(u =>
              <Tr className={style.tr}>
                <Td className={style.td}>{u.date}</Td>
                <Td className={style.td}>{u.user}</Td>
                <Td className={style.td}>{u.atendio}</Td>
                <Td className={style.td}>{u.categoria}</Td>
                <Td className={style.td}>{u.reason}</Td>
                <Td className={style.td}>${Number(u.monto).toLocaleString()}</Td>
                <Td className={style.td}>{u.tipo}</Td>
                <Td className={style.td}>{u.factura == true ? "Si" : "No"}</Td>
                {u.comprobante == null ? <Td className={style.td}>No hay</Td> : <Td className={style.td}><a style={{ color: "black" }} href={`${u.comprobante}`} target='_blank'>Comprobante</a></Td>}
              </Tr>)}
          </Tbody>
        </Table> : <table className={style.tabla} id="financiero">
          <tr>
            <td className={style.topTd}>Fecha</td>
            <td className={style.topTd}>Causante</td>
            <td className={style.topTd}>Atendio</td>
            <td className={style.topTd}>Categoria</td>
            <td className={style.topTd}>Descripcion</td>
            <td className={style.topTd}>Valor pagado</td>
            <td className={style.topTd}>Metodo de pago</td>
            <td className={style.topTd}>Factura electronica</td>
            <td className={style.topTd}>Comprobante</td>
          </tr>
          {pagoFilter?.map(u =>
            <tr key={u.id} className={style.tr}>
              <td className={style.td}>{u.date}</td>
              <td className={style.td}>{u.user}</td>
              <td className={style.td}>{u.atendio}</td>
              <td className={style.td}>{u.categoria}</td>
              <td className={style.td}>{u.reason}</td>
              <td className={style.td}>${Number(u.monto).toLocaleString()}</td>
              <td className={style.td}>{u.tipo}</td>
              <td className={style.td}>{u.factura == true ? "Si" : "No"}</td>
              {u.comprobante == null ? <td className={style.td}>No hay</td> : <td className={style.td}><a style={{ color: "black" }} href={`${u.comprobante}`} target='_blank'>Comprobante</a></td>}
            </tr>)}
            {montos?.map(m => <tr className={style.tr}>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}>{m.name}:</td>
              <td className={style.td}>${m.total.toLocaleString()}</td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
            </tr>)}
            <tr className={style.tr}>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}>Total:</td>
              <td className={style.td}>${montos?.reduce((acc, monto) => acc + monto.total, 0).toLocaleString()}</td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
            </tr>
            {(idAtendio || JSON.parse(localStorage.getItem("user")).role != 3) && <tr className={style.tr}>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}>Comisionado:</td>
              <td className={style.td}>${comisionado?.toLocaleString()}</td>
              <td className={style.td}></td>
              <td className={style.td}></td>
              <td className={style.td}></td>
            </tr>}
        </table>}
        {/* {idAtendio && <p>Comisionado: ${Number(comisionado)?.toLocaleString()}</p>} */}
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