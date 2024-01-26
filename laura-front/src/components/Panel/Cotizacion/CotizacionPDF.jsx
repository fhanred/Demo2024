import style from './CotizacionDetail.module.css'
import {Document, Page, View, Text, Image} from "@react-pdf/renderer"
import logo from "../../../assets/logolaurapdf.png"

const CotizacionPDF = ({coti}) => {

    return (
        <>
            <Document>
                <Page>
                <View style={{marginTop:"30px"}} className={style.pacientes}>
                    <Image
                    source={{uri:logo}}
                    style={{width:"250px", margin:"0 auto", textAlign:"center"}}
                    />
          <><Text style={{textAlign:"center", margin:"20px 0px", fontSize:"16px"}}>Detalles de la cotizacion #{coti?.id}</Text>
          {/* <br></br><br></br> */}
          <View style={{marginLeft:"40px", fontSize:"14px"}} className={style.header}>
          <Text>Paciente: {coti?.client?.name}</Text>
          <Text>CC: {coti?.client?.cedula}</Text>
          <Text>Telefono: {coti?.client?.celular}</Text>
          <Text>Fecha: {coti?.date}</Text>
          </View>
          <View>
            <View style={{display:"flex", flexDirection:"row", fontSize:"12px", padding:"4px 0px", marginTop:"30px", textAlign:"center", borderBottom:"2px solid black", borderTop:"2px solid black"}}>
            <Text style={{width:"200px"}}>ITEM</Text>
            <Text style={{width:"200px"}}>DESCRIPCION</Text>
            <Text style={{width:"200px"}}>PRECIO</Text>
            </View>
            {coti?.proced.map((p, index) => {
            return(
            <View style={{display:"flex", height:"50px", justifyContent:"center", alignItems:"center", flexDirection:"row", fontSize:"12px", margin:"0 auto", textAlign:"center", borderBottom:"1px solid gray"}}>
            <Text style={{width:"200px"}}>{index+1}</Text>
              <Text style={{width:"200px"}}>{p.label}</Text>
              <Text style={{width:"200px"}}>${Number(p.value).toLocaleString()}</Text>
            </View>)})}
          </View>
          {/* <table className={style.tabla}>
              <tr>
              <td className={style.topTd}>Item</Text>
              <td className={style.topTd}>Descripcion</td>
              <td className={style.topTd}>Precio</td>
              </tr>
              {coti?.proced.map((p, index) => {
                return(
              <tr className={style.tr}>
              <td className={style.td}>{index+1}</td>
              <td className={style.td}>{p.label}</td>
              <td className={style.td}>${Number(p.value).toLocaleString()}</td>
              </tr>)})}
        </table> */}
        <View style={{display:"flex", gap:"6px", marginTop:"30px", marginLeft:"40px", fontSize:"14px"}} className={style.footer}>
          <View style={{display:"flex", flexDirection:"row"}} className={style.footerItem}>
            <Text>Subtotal: </Text>
            <Text>${Number(coti?.price).toLocaleString()}</Text>
          </View>
          <View style={{display:"flex", flexDirection:"row"}} className={style.footerItem}>
            <Text>Impuestos (0%): </Text>
            <Text>$0</Text>
          </View>
          <View  style={{display:"flex", flexDirection:"row"}} className={style.footerItem}>
            <Text>Total: </Text>
            <Text>${Number(coti?.price).toLocaleString()}</Text>
          </View>
        </View>

            <Text style={{textAlign:"center", fontWeight:"800", marginTop:"40px", fontSize:"14px"}}>Oferta valida por 5 dias a partir de la emision</Text>
            </>
          </View>
                </Page>
            </Document>
        </>
    )
}

export default CotizacionPDF