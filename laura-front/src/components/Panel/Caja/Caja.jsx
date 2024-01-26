import axios from 'axios'
import style from './Caja.module.css'
import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
// import Example from '../Financiero/ChartGasto';

const Caja = () => {
    
    const [comisionado, setComisionado] = useState(0)
    const [pagos, setPagos] = useState()
    const [usuarios, setUsuarios] = useState()
    const [cate, setCate] = useState()
    const today = new Date().toISOString().split('T')[0];
    const [montos, setMontos] = useState()

    const getPagos = async () => {
        const cate = await axios.get("/user/categoria")
        const { data } = await axios.get("/financiero")
        setPagos(data)
        setCate(cate.data)
        if(JSON.parse(localStorage.getItem("user")).role !== 3){
            const fecha = formatDate()
            const filtrado = data?.filter((pago) => (pago.date == fecha && pago.atendio?.includes(`${JSON.parse(localStorage.getItem("user")).name}`)))
            const comisionDelUser = filtrado?.reduce((acc,pago) => pago.monto > 0 && Number(acc)+Number(pago.monto) , 0)
            setPagoFilter(filtrado)
            const montos = filtrado?.reduce((accumulator, pago) => {
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
              axios.get("/user/id/" + JSON.parse(localStorage.getItem("user")).id)
                .then(({ data }) => {
                    const totalMonto = montos.reduce((acc, pago) => Number(acc) + Number(pago.total), 0)
                    setComisionado((comisionDelUser * data.comision) / 100)
                })
              setMontos(montos)
        }else{
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
    }


    const formatDate = () => {
        var fecha = new Date();
        // Obtener el año, mes y día
        var año = fecha.getFullYear();
        var mes = fecha.getMonth() + 1; // Los meses son indexados desde 0, por lo que sumamos 1
        var dia = fecha.getDate();

        // Formatear el mes y día para que siempre tengan dos dígitos
        mes = mes < 10 ? '0' + mes : mes;
        dia = dia < 10 ? '0' + dia : dia;

        // Formatear la fecha como "YY-MM-DD"
        var fechaFormateada = año.toString() + '-' + mes + '-' + dia;
        return fechaFormateada
    }

    const [desde, setDesde] = useState(formatDate())
    const [hasta, setHasta] = useState(formatDate())


    const [tipo, setTipo] = useState("Todos")
    const [pagoFilter, setPagoFilter] = useState(pagos)
    const [categoria, setCategoria] = useState("Todos")
    const [atendio, setAtendio] = useState("Cualquiera")
    const [idAtendio, setIdAtendio] = useState(null)
    const [sede, setSede] = useState("Todas")

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user")).role != 3) {
            const fecha = formatDate()
            setDesde(fecha)
            setHasta(fecha)
            setAtendio(JSON.parse(localStorage.getItem("user")).id)
            filtradoPago()
        }
        getPagos()
        getData()
        axios.get("/user/categoria")
            .then(({ data }) => setCate(data))
        axios.get("/user")
            .then(({ data }) => setUsuarios(data))
    }, [])


    const filtradoPago = () => {
        var fechasEnRango = pagos?.filter((pago) => pago.date == hasta)
        // var fechasEnRango = pagos
        // if (tipo !== "Todos" && categoria !== "Todos") {
        //     fechasEnRango = fechasEnRango.filter(pago => pago.categoria == categoria && pago.tipo == tipo)
        // }
        if (atendio !== "Cualquiera") {
            fechasEnRango = fechasEnRango.filter(pago => pago.atendio.includes(atendio))
        }
        if (sede !== "Todas"){
            fechasEnRango = fechasEnRango.filter(pago => pago.sede == sede)
        }
        if (idAtendio >= 1) {
            axios.get("/user/id/" + idAtendio)
                .then(({ data }) => {
                    const totalMonto = fechasEnRango.reduce((acc, pago) => pago.monto > 0 ? Number(acc) + Number(pago.monto) : Number(acc)+0, 0)
                    setComisionado((totalMonto * data.comision) / 100)
                })
        }
        const montos = fechasEnRango?.reduce((accumulator, pago) => {
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

    const [creatorPay, setCreatorPay] = useState()
    const [creatorGasto, setCreatorGasto] = useState()
    const [formPay, setFormPay] = useState({
        atendio:`${JSON.parse(localStorage.getItem("user")).name} ${JSON.parse(localStorage.getItem("user")).lastname}`
    })
    const [pacientes, setPacientes] = useState()
    const [proveedores, setProveedores] = useState()

    const handleForm = (name,value) => {
        setFormPay({...formPay, [name]:value})
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

      const [procedimientos, setProcedimientos] = useState([{value:"123",label:"hola"}, {value:"321",label:"chao"}])
      const [precio, setPrecio] = useState(0)

  useEffect(() => {
    axios.get("/user/procedimientos")
    .then(({data}) => setProcedimientos(data))
    axios.get("/proveedor/all")
    .then(({data}) => setProveedores(data))
    axios.get("/client/all")
    .then(({data}) => setPacientes(data))
},[])

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

const [masMonto, setMasMonto] = useState(0)

const newPay = async () => {
    if (creatorGasto) {
      setCreatorGasto(false)
      const { data } = await axios.post("/financiero", { ...formPay, monto: "-" + formPay.monto, atendio:`${JSON.parse(localStorage.getItem("user")).name} ${JSON.parse(localStorage.getItem("user")).lastname}` })
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
    const user = await axios.get("/user/id/"+JSON.parse(localStorage.getItem("user")).id)
    await axios.put("/user", {id:JSON.parse(localStorage.getItem("user")).id, comisionado: user.data.comisionado + (user.data.comision*precioTotal)/100})
    if(JSON.parse(localStorage.getItem("user")).sede.length == 1){
    for(let i = 0; i < formPay.tipo.length; i++){
      await axios.post("/financiero", {...formPay,sede:JSON.parse(localStorage.getItem("user")).sede[0], tipo:formPay.tipo[i], monto:Number(formPay[formPay.tipo[i]])})
    }
  }else{
    for(let i = 0; i < formPay.tipo.length; i++){
      await axios.post("/financiero", {...formPay, tipo:formPay.tipo[i], monto:Number(formPay[formPay.tipo[i]])})
    }
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

    return (
        <>
        <Toaster position='top-center'/>
            {(!creatorPay && !creatorGasto) && <><div className={style.financiero}>
                <h2>Caja</h2>
                <button className={style.button} onClick={() => { setCreatorPay(true); setFormPay({ ...formPay, user: "" }) }}>Nuevo pago</button>
                    <br></br><br></br><button className={style.button} onClick={() => setCreatorGasto(true)}>Nuevo gasto</button>
                    {/* <div> */}
                    <div className={window.innerWidth > 700 && style.filtros}>
                {JSON.parse(localStorage.getItem("user")).role == 3 && <>
                    <div className={style.inputContainer}>
                        <input value={hasta} type="date" name="user" onChange={(e) => setHasta(e.target.value)} className={style.input} placeholder=' '></input>
                        <label className={style.textInput}>Fecha</label>
                    </div>
                </>}
                {JSON.parse(localStorage.getItem("user")).role == 3 && <>
                    <div className={style.inputContainer}>
                        <select className={style.input} onChange={(e) => setSede(e.target.value)}>
                            <option selected value="Todas">Todas</option>
                            <option value="Villavicencio">Villavicencio</option>
                            <option value="Restrepo">Restrepo</option>
                            </select>
                        <label className={style.textInput}>Sede</label>
                    </div>
                </>}
                {JSON.parse(localStorage.getItem("user")).role == 3 && <div className={style.inputContainer}>
                    <select className={style.input} onChange={(e) => { setAtendio(e.target.value); setIdAtendio(e.target.options[e.target.selectedIndex].id) }}>
                        <option selected value="Cualquiera">Cualquiera</option>
                        {usuarios?.map(c => (c.role == 1 || c.role == 2 || c.role == 3) && <option id={c.id} value={`${c.name} ${c.lastname}`}>{c.name} {c.lastname}</option>)}
                    </select>
                    <label className={style.textInput}>Especialista</label>
                </div>}
                </div>
                {JSON.parse(localStorage.getItem("user")).role == 3 &&<button className={style.button} onClick={filtradoPago}>Filtrar</button>}<br></br><br></br>
                <br></br><br></br>
                <div>
                {montos?.map(m => <div>
                    <p>{m.name}: ${m.total.toLocaleString()}</p>
                </div>)}
                <p>Total: ${montos?.reduce((acc, monto) => acc + monto.total, 0).toLocaleString()}</p>
                </div>
                {(idAtendio || JSON.parse(localStorage.getItem("user")).role != 3) && <p>Comisionado: ${Number(comisionado)?.toLocaleString()}</p>}</div>
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
                            <Tr className={style.tr} onClick={() => JSON.parse(localStorage.getItem("user")).role == 3 && setDeleteId(u.id)}>
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
                </Table> : <table className={style.tabla}>
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
                        <tr key={u.id} className={style.tr} onClick={() => JSON.parse(localStorage.getItem("user")).role == 3 && setDeleteId(u.id)}>
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
                </table>}</>}
                {creatorPay && <div className={style.financiero}>
        <h1 onClick={() => setCreatorPay(false)}>Nuevo pago</h1>
        <div className={style.inputContainer2}>
          <select name="user" onChange={(e) => { handleForm(e.target.name, e.target.value) }} className={style.input} placeholder=' '>
            <option value={null} selected>Seleccionar</option>
            {pacientes?.sort((a,b) => a.name.localeCompare(b.name)).map((p) => <option value={`${p.name}`}>{p.name}</option>)
            }
          </select>
          <label className={style.textInput}>Nombre</label>
        </div>
        {JSON.parse(localStorage.getItem("user")).role >= 2 && <div className={style.inputContainer2}>
          <select name="atendio" onChange={(e) => { handleForm(e.target.name, e.target.value); setIdAtendio(e.target.options[e.target.selectedIndex].id) }} className={style.input} placeholder=' '>
            <option value={null} selected>Seleccionar</option>
            {usuarios?.map((p) => (p.role !== 4) && <option id={p.id} value={`${p.name} ${p.lastname}`}>{p.name} {p.lastname}</option>)
            }
          </select>
          <label className={style.textInput}>Atendio</label>
        </div>}
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
          <button className={style.button} onClick={() => {setCreatorPay(false); setFormPay({})}}>Volver</button>
        </div>
      </div>}
      {creatorGasto && <div className={style.financiero}>
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
          <option selected value={null}>Selecciona una sede</option>
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
          <button className={style.button} onClick={() => {setCreatorGasto(false); setFormPay({})}}>Volver</button>
        </div>
      </div>}
                <br></br>
                {/* <button className={style.button} onClick={() => setDetail(false)}>Volver</button> */}
        </>
    )
}

export default Caja