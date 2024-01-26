import { Toaster } from "react-hot-toast"
import style from "./CotizacionDetail.module.css"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import { useEffect, useState } from "react"
import axios from "axios"
import { PDFDownloadLink } from "@react-pdf/renderer"
import CotizacionPDF from "./CotizacionPDF"

const CotizacionDetail = ({volver,id}) => {

  const [coti, setCoti] = useState()

  useEffect(() => {
    axios.get("/client/cotizacion/"+id).then(({data}) => setCoti(data))
  },[])

    return(
        <>
        <Toaster position="top-center"/>
          <div className={style.pacientes}>
          <><h1>Detalles de la cotizacion #{coti?.id}</h1>
          <br></br><br></br>
          <div className={style.header}>
          <p>Paciente: {coti?.client?.name}</p>
          <p>CC: {coti?.client?.cedula}</p>
          <p>Telefono: {coti?.client?.celular}</p>
          <p>Fecha: {coti?.date}</p>
          {/* <p>Tratamiento: No definido</p> */}
          </div>
          {window.innerWidth < 1300 ? <Table className={style.tabla}>
          <Thead>
            <Tr>
              <Th className={style.topTd}>Item</Th>
              <Th className={style.topTd}>Descripcion</Th>
              <Th className={style.topTd}>Precio</Th>
              {/* <Th className={style.topTd}>Cantidad</Th>
              <Th className={style.topTd}>Total</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {coti?.proced.map((p,index) => {
            return(
              <Tr className={style.tr}>
              <Td className={style.td}>{index+1}</Td>
              <Td className={style.td}>{p.label}</Td>
              <Td className={style.td}>${Number(p.value).toLocaleString()}</Td>
              {/* <Td className={style.td}>2</Td>
              <Td className={style.td}>$2,000,000</Td> */}
              </Tr>)
            })}
          </Tbody>
        </Table>:<table className={style.tabla}>
              <tr>
              <td className={style.topTd}>Item</td>
              <td className={style.topTd}>Descripcion</td>
              <td className={style.topTd}>Precio</td>
              {/* <td className={style.topTd}>Cantidad</td>
              <td className={style.topTd}>Total</td> */}
              </tr>
              {coti?.proced.map((p, index) => {
                return(
              <tr className={style.tr}>
              <td className={style.td}>{index+1}</td>
              <td className={style.td}>{p.label}</td>
              <td className={style.td}>${Number(p.value).toLocaleString()}</td>
              {/* <td className={style.td}>2</td>
              <td className={style.td}>$2,000,000</td> */}
              </tr>)})}
            </table>}
        <br></br>
        <div className={style.footer}>
          <div className={style.footerItem}>
            <p>Subtotal:</p>
            <p>${Number(coti?.price).toLocaleString()}</p>
          </div>
          <div className={style.footerItem}>
            <p>Impuestos (0%):</p>
            <p>$0</p>
          </div>
          <div className={style.footerItem}>
            <p>Total:</p>
            <p>${Number(coti?.price).toLocaleString()}</p>
          </div>
        </div>

            <h5>Oferta valida por 5 dias a partir de la emision</h5>
            </>
            <button className={style.button} onClick={volver}>Volver</button>
            <br></br><br></br>
            <PDFDownloadLink document={<CotizacionPDF coti={coti}/>} fileName={`cotizacion${coti?.id}.pdf`}>
            <button className={style.button}>Descargar PDF</button>
            </PDFDownloadLink>
            <br></br>
          </div>
        </>
      )
}

export default CotizacionDetail