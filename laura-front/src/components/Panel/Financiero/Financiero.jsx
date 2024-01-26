import { useEffect, useState } from 'react';
import style from './Financiero.module.css'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FinancieroPDF from './FinancieroPDF';
import Example from './ChartGasto';
import Select from "react-select"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { confirmAlert } from 'react-confirm-alert';


const Financiero = ({fn, fnProce}) => {

  const [chartType, setChartType] = useState(1)
  const [creatorPay, setCreatorPay] = useState(false)
  const [creatorGasto, setCreatorGasto] = useState(false)
  const [cate, setCate] = useState()
  const [detail, setDetail] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [proveedores, setProveedores] = useState()
  const [usuarios, setUsuarios] = useState()

  const [pagos, setPagos] = useState()

  const getPagos = async () => {
    const cate = await axios.get("/user/categoria")
    const { data } = await axios.get("/financiero")
    setPagos(data)
    setCate(cate.data)
    setPagoFilter(data)
  }

  useEffect(() => {
    axios.get("/user/categoria").then((data) => setCate(data.data))
  },[creatorGasto])

  useEffect(() => {
    getData()
  },[pagos])

  const [idAtendio, setIdAtendio] = useState(null)
  const [atendedor, setAtendedor] = useState()
  const [comisionado, setComisionado] = useState(0)

  const newPay = async () => {
    if (creatorGasto) {
      setCreatorGasto(false)
      const { data } = await axios.post("/financiero", { ...formPay, monto: "-" + formPay.monto })
      setFormPay({
        user: "",
        monto: "",
        reason: "",
        tipo: "Bancolombia"
      })
      // alert(data.status)
      getPagos()
      toast.success('Gasto creado con exito')
      return;
    }
    var deberia = 0;
    for(let i = 0; i < formPay.tipo.length; i++){
      deberia += Number(formPay[formPay.tipo[i]])
    }
    if(deberia !== Number(precio+masMonto)) return toast.error('El pago debe ser total al monto')
    if (formPay.user == "" || formPay.user == "null") return alert("Debes seleccionar un paciente")
    setCreatorPay(false)
    const precioTotal = Number(precio)+Number(masMonto)
    const user = await axios.get("/user/id/"+idAtendio)
    await axios.put("/user", {id:idAtendio, comisionado: user.data.comisionado + (user.data.comision*precioTotal)/100})
    for(let i = 0; i < formPay.tipo.length; i++){
      await axios.post("/financiero", {...formPay, tipo:formPay.tipo[i], monto:Number(formPay[formPay.tipo[i]])})
    }
    // const { data } = await axios.post("/financiero", {...formPay, monto:precioTotal})
    setFormPay({
      user: "",
      monto: "",
      reason: "",
      tipo: []
    })
    toast.success('Pago creado con exito')
    getPagos()
  }

  const [formPay, setFormPay] = useState({
    user: null,
    monto: "",
    reason: "",
    tipo: [],
    sede: JSON.parse(localStorage.getItem("user")).sede.length == 1 ? JSON.parse(localStorage.getItem("user")).sede[0]:"",
    factura:true,
  })

  const handleForm = (name, value) => {
    setFormPay({ ...formPay, [name]: value })
  }

  const [procedimientos, setProcedimientos] = useState([{value:"123",label:"hola"}, {value:"321",label:"chao"}])

  useEffect(() => {
    getPagos()
    axios.get("/user/procedimientos")
    .then(({data}) => setProcedimientos(data))
    axios.get("/proveedor/all")
    .then(({data}) => setProveedores(data))
    axios.get("/user")
    .then(({data}) => setUsuarios(data))
  }, [])

  const days = pagos?.reduce((accumulator, pago) => {
    const today = new Date()
    const day = pago.date?.split("-")[2];
    const month = pago.date?.split("-")[1];
    const year = pago.date?.split("-")[0];

    if (year == new Date().getUTCFullYear() && month == new Date().getMonth() + 1) {
      if (today.getDate() >= day && day > today.getDate() - 3) {
        const existingMonth = accumulator.find((item) => item.name === day);
        if (existingMonth) {
          if (existingMonth[pago.tipo] === undefined) {
            existingMonth[pago.tipo] = 0; // Inicializa como 0 si es undefined
          }
          existingMonth[pago.tipo] += Number(pago.monto);
        } else {
          accumulator.push({
            name: day,
            [pago.tipo]: Number(pago.monto),
          });
        }
      }
    }

    return accumulator;
  }, []);

  days?.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const years = pagos?.reduce((accumulator, pago) => {
    const year = pago.date?.split("-")[0];
    const existingMonth = accumulator.find((item) => item.name === year);

    if (existingMonth) {
      if (existingMonth[pago.tipo] === undefined) {
        existingMonth[pago.tipo] = 0; // Inicializa como 0 si es undefined
      }
      existingMonth[pago.tipo] += Number(pago.monto);
    } else {
      accumulator.push({
        name: year,
        [pago.tipo]: Number(pago.monto),
      });
    }

    return accumulator;
  }, []);

  years?.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const months = pagos?.reduce((accumulator, pago) => {
    const year = pago.date?.split("-")[0];
    const month = pago.date?.split("-")[1];

    if (year == new Date().getUTCFullYear()) {
      const existingMonth = accumulator.find((item) => item.name === month);
      if (existingMonth) {
        if (existingMonth[pago.tipo] === undefined) {
          existingMonth[pago.tipo] = 0; // Inicializa como 0 si es undefined
        }
        existingMonth[pago.tipo] += Number(pago.monto);
      } else {
        accumulator.push({
          name: month,
          [pago.tipo]: Number(pago.monto),
        });
      }
    }

    return accumulator;
  }, []);
  // Ordenar los meses por número (1 al 12)
  months?.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const [pacientes, setPacientes] = useState()

  useEffect(() => {
    axios.get("/client/all").then(({ data }) => setPacientes(data))
  }, [])


  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    const formattedValue = Number(payload.value).toLocaleString(); // Agrega los puntos de separación de miles
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fontSize={12} textAnchor="end" fill="#666">
          {`$${formattedValue}`}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className={style.tooltip}>
          <p className="label">{`${label}`}</p>
          {payload.map((p) => {
            const formattedValue = Number(p.value).toLocaleString(); // Formatea el valor con puntos de separación de miles
            return (<>
              <p className={style.intro} style={{ color: p.fill }}>{`${p.name}: $${formattedValue}`}</p>
            </>)
          })}
        </div>
      );
    }
    return null;
  };

  const [desde, setDesde] = useState("2022-10-20")
  const [hasta, setHasta] = useState("2025-10-20")
  const [tipo, setTipo] = useState("Todos")
  const [pagoFilter, setPagoFilter] = useState(pagos)
  const [categoria, setCategoria] = useState("Todos")
  const [atendio, setAtendio] = useState("Cualquiera")

  const filtradoPago = () => {
    var fechasEnRango = pagos.filter((pago) => pago.date >= desde && pago.date <= hasta);
    if(tipo !== "Todos" && categoria !== "Todos"){
      fechasEnRango = fechasEnRango.filter(pago => pago.categoria == categoria && pago.tipo == tipo)
    }
    if(atendio !== "Cualquiera"){
      fechasEnRango = fechasEnRango.filter(pago => pago.atendio?.trim() == atendio)
    }
    if(tipo !== "Todos"){
      fechasEnRango = fechasEnRango.filter(pago => pago.tipo == tipo)
    }
    if (categoria !== "Todos"){
      fechasEnRango = fechasEnRango.filter(pago => pago.categoria == categoria)
    }
    if(idAtendio >= 1){
      axios.get("/user/id/"+idAtendio)
      .then(({data}) => {
        setAtendedor(data)
        const totalMonto = fechasEnRango.reduce((acc, pago) => pago.monto > 0 ? Number(acc) + Number(pago.monto) : Number(acc)+0, 0)
        setComisionado((totalMonto*data.comision)/100)
    })}
    return setPagoFilter(fechasEnRango)
  }

  const [precio, setPrecio] = useState(0)

  const uploadImage = async (e) => {
    const files = e.target.files;
    const dato = new FormData();
    dato.append("file", files[0]);
    dato.append("upload_preset","natalie")
    dato.append("api_key","612393625364863")
    dato.append("timestamp", 0)
    const res = await axios.post("https://api.cloudinary.com/v1_1/dftvenl2z/auto/upload", dato)
    setFormPay({...formPay, comprobante:res.data.secure_url})
  }

  const [datos, setDatos] = useState()

const getData = () => {
    const data = pagos?.reduce((accumulator, pago) => {
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

const calcularPrecio = (array) => {
  const total = array.reduce((acc, proce) => acc + proce.value, 0)
  const a = array.reduce((acc, proce, index) => {
    if (index === 0) {
      return proce.label;
    } else {
      return acc + ", " + proce.label;
    }},"")
  handleForm("reason", a)
  setPrecio(total)
}

const customStyles = {
  control: base => ({
    ...base,
    // height: 60,
    // minHeight: 60,
    // overflow:"hidden"
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    paddingTop: 7,
    paddingBottom: 7,
}),
clearIndicator: (styles) => ({
    ...styles,
    paddingTop: 7,
    paddingBottom: 7,
}),
};
const [masMonto, setMasMonto] = useState(0)

const [deleteId, setDeleteId] = useState(null)

const options = {
  title: '¿Deseas eliminarlo?',
  message: 'Este proceso no se puede revertir',
  buttons: [
    {
      label: 'Si',
      onClick: () => axios.delete("/financiero/"+deleteId).then(() => {getPagos(); toast.success("Eliminado con exito")})
    },
    {
      label: 'No',
      onClick: () => setDeleteId(null)
    }
  ],
  closeOnEscape: true,
  closeOnClickOutside: true,
  keyCodeForClose: [8, 32],
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypress: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name"
};


useEffect(() => {
  if(deleteId !== null){
    confirmAlert(options)
  }
},[deleteId])

const today = new Date().toISOString().split('T')[0];

  return (
    <>
    <Toaster position='top-center'/>
      {(!creatorPay && !creatorGasto && !detail) && <div className={style.financiero}>
        <h1 className={style.titleSection}>Financiero</h1>
        <div className={style.doblePage} style={window.innerWidth < 600 ? {display:"initial"}:{display:"flex"}}>
          <div>
            <select onChange={(e) => setChartType(e.target.value)} className={style.select}>
              <option value={1} selected>Diario</option>
              {/* <option value={2}>Semanal</option> */}
              <option value={2}>Mensual</option>
              <option value={3}>Anual</option>
            </select>
              <div>
                {chartType == 1 && days?.length ? <BarChart
                  className={style.grafica}
                  // style={{width:"100vw"}}
                  width={window.innerWidth < 1300 ? window.innerWidth-window.innerWidth/3 : 500}
                  height={window.innerWidth > 900 ? 350 : 250}
                  data={days}
                  // onClick={(e) => alert("Mostrar detalles de " + e.activeTooltipIndex)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tick={CustomYAxisTick} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="Bancolombia" fill="#8884d8" />
                  <Bar dataKey="Efectivo" fill="#82ca9d" />
                  <Bar dataKey="Daviplata" fill="#3386FF" />
                  <Bar dataKey="Nequi" fill="#E684D7" />
                  <Bar dataKey="Datafono" fill="#FF5733" />
                  <Bar dataKey="Wompi" fill="#c16c7a" />
                </BarChart> : null}
                {chartType == 2 && months?.length ? <BarChart
                  className={style.grafica}
                  width={600}
                  height={350}
                  data={months}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tick={CustomYAxisTick} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="Bancolombia" fill="#8884d8" />
                  <Bar dataKey="Efectivo" fill="#82ca9d" />
                  <Bar dataKey="Daviplata" fill="#3386FF" />
                  <Bar dataKey="Nequi" fill="#E684D7" />
                  <Bar dataKey="Datafono" fill="#FF5733" />
                  <Bar dataKey="Wompi" fill="#c16c7a" />
                </BarChart> : null}
                {chartType == 3 && years?.length ? <BarChart
                  className={style.grafica}
                  width={600}
                  height={350}
                  data={years}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tick={CustomYAxisTick} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="Bancolombia" fill="#8884d8" />
                  <Bar dataKey="Efectivo" fill="#82ca9d" />
                  <Bar dataKey="Daviplata" fill="#3386FF" />
                  <Bar dataKey="Nequi" fill="#E684D7" />
                  <Bar dataKey="Datafono" fill="#FF5733" />
                  <Bar dataKey="Wompi" fill="#c16c7a" />
                </BarChart> : null}
              </div>
            <br></br>
            <button className={style.button} onClick={() => setDetail(true)}>Detalles</button>
          </div>
          <div className={style.buttones} style={window.innerWidth < 600 ? {margin:"20px auto"}:{margin:"0 50px"}}>
            <button className={style.button} onClick={() => { setCreatorPay(true); setFormPay({ ...formPay, user: "" }) }}>Nuevo pago</button>
            <button className={style.button} onClick={() => setCreatorGasto(true)}>Nuevo gasto</button>
            <button className={style.button} onClick={fn}>Categorias</button>
            <button className={style.button} onClick={fnProce}>Procedimientos</button>
          </div>
        </div>
      </div>}
      {(creatorPay && !detail) && <div className={style.financiero}>
        <h1 onClick={() => setCreatorPay(false)}>Nuevo pago</h1>
        <div className={style.inputContainer2}>
          <select name="user" onChange={(e) => { handleForm(e.target.name, e.target.value) }} className={style.input} placeholder=' '>
            <option value={null} selected>Seleccionar</option>
            {pacientes?.sort((a,b) => a.name.localeCompare(b.name)).map((p) => <option value={`${p.name}`}>{p.name}</option>)
            }
          </select>
          <label className={style.textInput}>Nombre</label>
        </div>
        <div className={style.inputContainer2}>
          <select name="atendio" onChange={(e) => { handleForm(e.target.name, e.target.value); setIdAtendio(e.target.options[e.target.selectedIndex].id) }} className={style.input} placeholder=' '>
            <option value={null} selected>Seleccionar</option>
            {usuarios?.map((p) => (p.role !== 4) && <option id={p.id} value={`${p.name} ${p.lastname}`}>{p.name} {p.lastname}</option>)
            }
          </select>
          <label className={style.textInput}>Atendio</label>
        </div>
        <div className={style.inputContainer2}>
          <input min={today} onChange={(e) => handleForm(e.target.name, e.target.value)} type="date" name="date" className={style.input} placeholder=' '></input>
          <label className={style.textInput}>Fecha</label>
          </div>
        {/* <div className={style.inputContainer2}>
          <input type="time" className={style.input} name="hour"/>
          <label className={style.textInput}>Hora</label>
          </div> */}
        <div className={style.inputContainer2} style={{transform:"translateX(0%)", position: 'relative', zIndex: 999, height:"fit-content" }}>
        <Select
          placeholder="Procedimientos"
                name="sede"
                onChange={(e) => calcularPrecio(e)}
                isMulti
                options={procedimientos.sort((a,b) => a.label.localeCompare(b.label))}
                styles={customStyles}
            />
          {/* <select name="reason" className={style.input} onChange={(e) => {handleForm(e.target.name, JSON.parse(e.target.value).label); setPrecio(JSON.parse(e.target.value).value)}}>
            {procedimientos?.map(p => <option value={JSON.stringify(p)}>{p.label}</option>)}
          </select> */}
        </div>
        <div className={style.inputContainer2}>
          <input name="monto" value={precio.toLocaleString()} disabled className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input>
          <label className={style.textInput}>Monto</label>
        </div>
        {formPay?.reason?.includes("Retoque") && <div className={style.inputContainer2}>
          <input type="number" min={0} value={masMonto} className={style.input} onChange={(e) => setMasMonto(e.target.value)} placeholder=' '></input>
          <label className={style.textInput}>Adicional</label>
        </div>}
        <div className={style.inputContainer2} style={{transform:"translateX(0%)", position: 'relative', zIndex: 900, height:"fit-content" }}>
        <Select
          placeholder="Metodo pago"
                name="tipo"
                onChange={(e) => setFormPay({...formPay, tipo:e.map(d => d.value)})}
                isMulti
                options={[{label:"Daviplata", value:"Daviplata"},{label:"Bancolombia", value:"Bancolombia"},{label:"Nequi", value:"Nequi"},{label:"Efectivo", value:"Efectivo"},{label:"Wompi", value:"Wompi"},{label:"Datafono", value:"Datafono"}]}
                styles={customStyles}
            />
        </div>
        {formPay?.tipo?.map(p => <div className={style.inputContainer2}>
          <input type="number" min={0} name={p} className={style.input} onChange={(e) =>  handleForm(e.target.name, e.target.value)} placeholder=' '></input>
          <label className={style.textInput}>{p}</label>
        </div>)}
        {JSON.parse(localStorage.getItem("user")).sede.length > 1 && <div className={style.inputContainer2}>
        <select name="sede" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)}>
            <option selected value={null}>Selecciona una sede</option>
            <option value="Restrepo">Restrepo</option>
            <option value="Villavicencio">Villavicencio</option>
          </select>
          <label className={style.textInput}>Sede</label>
          </div>}
        <div className={style.buttons}>
          <button className={style.button} onClick={newPay}>Guardar</button>
          <button className={style.button} onClick={() => setCreatorPay(false)}>Volver</button>
        </div>
      </div>}
      {(creatorGasto && !detail) && <div className={style.financiero}>
        <h1 onClick={() => setCreatorPay(false)}>Nuevo gasto</h1>
        <div className={style.inputContainer2}>
          <select name="user" onChange={(e) => { handleForm(e.target.name, e.target.value) }} className={style.input} placeholder=' '>
            <option value="null" selected>Seleccionar</option>
            {proveedores?.map((p) => <option value={`${p.name}`}>{p.name}</option>)
            }
          </select>
          <label className={style.textInput}>Proveedor</label>
        </div>
        <div className={style.inputContainer2}>
          <input min={today} onChange={(e) => handleForm(e.target.name, e.target.value)} type="date" name="date" className={style.input} placeholder=' '></input>
          <label className={style.textInput}>Fecha</label>
        </div>
        {/* <div className={style.inputContainer2}>
          <input type="time" className={style.input} name="hour"/>
          <label className={style.textInput}>Hora</label>
          </div> */}
        <div className={style.inputContainer2}>
          <input type="number" min={0} name="monto" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input>
          <label className={style.textInput}>Monto</label>
        </div>
        <div className={style.inputContainer2}>
          <input name="reason" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input>
          <label className={style.textInput}>Descripcion</label>
        </div>
        <div className={style.inputContainer2}>
        <select name="factura" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)}>
            <option value={true}>Si</option>
            <option value={false}>No</option>
          </select>
          <label className={style.textInput}>Factura elect.</label>
          </div>
        <div className={style.inputContainer2}>
          {/* <input name="reason" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input> */}
          <select onChange={(e) => setFormPay({ ...formPay, categoria: e.target.value })} className={style.input}>
            {cate?.map(c => <option value={c.name}>{c.name}</option>)}
            {/* <option value="Personal">Personal</option>
            <option value="Salarios">Salarios</option>
            <option value="Insumos">Insumos</option>
            <option value="Arriendo">Arriendo</option> */}
          </select>
          <label className={style.textInput}>Categoria</label>
        </div>
        <div className={style.inputContainer2}>
          {/* <input name="reason" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)} placeholder=' '></input> */}
          <select onChange={(e) => setFormPay({ ...formPay, tipo: e.target.value })} className={style.input}>
          <option selected value="null">Selecciona un metodo</option>
          <option value="Bancolombia">Bancolombia</option>
            <option value="Daviplata">Daviplata</option>
            <option value="Nequi">Nequi</option>
            <option value="Datafono">Datafono</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Wompi">Wompi</option>
          </select>
          <label className={style.textInput}>Metodo</label>
        </div>
        {JSON.parse(localStorage.getItem("user")).sede.length > 1 && <div className={style.inputContainer2}>
        <select name="sede" className={style.input} onChange={(e) => handleForm(e.target.name, e.target.value)}>
          <option selected value={null}>Selecciona una sede</option><option selected value={null}>Selecciona una sede</option>
            <option value="Restrepo">Restrepo</option>
            <option value="Villavicencio">Villavicencio</option>
          </select>
          <label className={style.textInput}>Sede</label>
          </div>}
        <div className={style.inputContainer2}>
          <input type="file" name="comprobante" style={{marginTop:"10px"}} className={style.input} onChange={uploadImage} placeholder=' '></input>
          <label className={style.textInput}>Comprobante</label>
        </div>
        <div className={style.buttons}>
          <button className={style.button} onClick={newPay}>Guardar</button>
          <button className={style.button} onClick={() => setCreatorGasto(false)}>Volver</button>
        </div>
      </div>}
      {(!creatorPay && detail) && <div className={style.financiero}>
        <h2>Detalle financiero</h2>
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
          <select className={style.input} onChange={(e) => {setAtendio(e.target.value); setIdAtendio(e.target.options[e.target.selectedIndex].id)}}>
            <option selected value="Cualquiera">Cualquiera</option>
          {usuarios?.map(c => (c.role == 1 || c.role == 2 || c.role == 3) && <option id={c.id} value={`${c.name} ${c.lastname}`}>{c.name} {c.lastname}</option>)}
          </select>
          <label className={style.textInput}>Atendio</label>
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
        <PDFDownloadLink document={<FinancieroPDF financiero={pagoFilter} desde={desde} hasta={hasta} tipo={tipo}/>} fileName='registrofinanciero.pdf'>
          <button className={style.button}>Descargar PDF</button>
        </PDFDownloadLink>
        <br></br><br></br>
        {/* <div>
          <p>Ventas: $0</p>
          <p>Gastos: $0</p>
          <p>Total: $0</p>
        </div> */}
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
        {pagoFilter?.map( u =>
          <Tr className={style.tr} onClick={() => setDeleteId(u.id)}>
          <Td className={style.td}>{u.date}</Td>
              <Td className={style.td}>{u.user}</Td>
              <Td className={style.td}>{u.atendio}</Td>
              <Td className={style.td}>{u.categoria}</Td>
              <Td className={style.td}>{u.reason}</Td>
              <Td className={style.td}>${Number(u.monto).toLocaleString()}</Td>
              <Td className={style.td}>{u.tipo}</Td>
              <Td className={style.td}>{u.factura == true ? "Si":"No"}</Td>
              {u.comprobante == null ? <Td className={style.td}>No hay</Td> : <Td className={style.td}><a style={{color:"black"}} href={`${u.comprobante}`} target='_blank'>Comprobante</a></Td>}
          </Tr>)}
      </Tbody>
    </Table>:<table className={style.tabla}>
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
            <tr key={u.id} className={style.tr} onClick={() => setDeleteId(u.id)}>
              <td className={style.td}>{u.date}</td>
              <td className={style.td}>{u.user}</td>
              <td className={style.td}>{u.atendio}</td>
              <td className={style.td}>{u.categoria}</td>
              <td className={style.td}>{u.reason}</td>
              <td className={style.td}>${Number(u.monto).toLocaleString()}</td>
              <td className={style.td}>{u.tipo}</td>
              <td className={style.td}>{u.factura == true ? "Si":"No"}</td>
              {u.comprobante == null ? <td className={style.td}>No hay</td> : <td className={style.td}><a style={{color:"black"}} href={`${u.comprobante}`} target='_blank'>Comprobante</a></td>}
            </tr>)}
        </table>}
          {idAtendio && <p>Comisionado: ${Number(comisionado)?.toLocaleString()}</p>}
        <h3 style={{margin:"50px 0px -50px 0px"}}>Grafica de gastos por categoria</h3>
        <div style={{width:window.innerWidth < 1300 ? "300px": "800px", height:"400px", margin:"0 auto"}}>
        <Example datos={datos}/>
        </div>
        <br></br>
        <button className={style.button} onClick={() => setDetail(false)}>Volver</button>
      </div>}
    </>
  )
};

export default Financiero