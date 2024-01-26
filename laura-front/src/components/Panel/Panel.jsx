import style from './Panel.module.css'
import Perfil from "./Perfil/Perfil"
import Financiero from './Financiero/Financiero';
import { useEffect, useState } from 'react';
import Agenda from './Agenda/Agenda';
import Control from './Control/Control';
import Pacientes from './Pacientes/Pacientes';
import { Navigate, useNavigate } from 'react-router-dom';
import logo from "../../assets/logolaura.png"
import axios from "axios"
import { HiMenu } from "react-icons/hi"
import { GrClose } from "react-icons/gr"
import toast, { Toaster } from 'react-hot-toast';
import Cotizacion from './Cotizacion/Cotizacion';
import Usuarios from './Usuarios/Usuarios';
import precios from '../../precios';
import Ajustes from './Ajustes/Ajustes';
import Proveedores from './Proveedores/Proveedores';
import Select from 'react-select';
import Inventario from './Inventario/Inventario';
import Reportes from './Reportes/Reportes';
import Recordatorios from './Recordatorios/Recordatorios';
import Caja from './Caja/Caja';
import SelectReport from './Reportes/SelectReport';
import SelectSede from './Inventario/SelectSede';

const Panel = () => {
  let myFn;
  const [page, setPage] = useState(0)
  const [changePass, setChangePass] = useState(false)
  const [changeDate, setChangeDate] = useState(null)
  const [dateId, setDateId] = useState(null)
  const [editDate, setEditDate] = useState(null)
  const [newDate, setNewDate] = useState(false)
  const [find, setFind] = useState(null)
  const [createUser, setCreateUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [usuarios, setUsuarios] = useState()


  const navigate = useNavigate()

  const editarEvento = (id) => {
    setChangeDate(id)
    setDateId(id)
  }

  const auth = async () => {
    axios.get("/user/id/"+JSON.parse(localStorage.getItem("user")).id)
    .then(({data}) => {if(data == null){navigate("/login"); logout()}})
    if (!localStorage.getItem("token")) return navigate("/")
    const { data } = await axios.post("/user/auth", { token: localStorage.getItem("token") })
    if (data.status) {
      localStorage.setItem("image", data.user?.image)
      localStorage.setItem("user", JSON.stringify(data.user))
      return
    }
    return navigate("/")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("image")
    navigate("/login")
  }

  const [procedimiento, setProcedimiento] = useState()

  useEffect(() => {
    axios.get("/user/procedimientos")
    .then(({data}) => setProcedimiento(data))
    auth()

  }, [])

  const [date, setDate] = useState([{ id: "a" }, { id: 1 }])

  const getDates = async () => {
    const { data } = await axios.get("/calendar/all")
    const fechas = data?.map(d => {
      return {
        id: d.id,
        title: d.title,
        start: new Date(d.start),
        end: new Date(d.end),
        resourceId: 1,
        procedimiento: d.procedimiento,
        confirmada: d.confirmada
      }
    })
    setDate(fechas)
  }

  const [especialist, setEspecialist] = useState(null)
  const [categorias, setCategorias] = useState()

  useEffect(() => {
    getDates()
    axios.get("/user/categoria").then(({data}) => setCategorias(data))
  }, [])

  const [form, setForm] = useState({
    title: "",
    start: "",
    resourceId: 1,
    hour: "01",
    min: "00",
    endhour: "01",
    endmin: "00",
    especialista: 1,
  })

  const [formPass, setFormPass] = useState({
    id: JSON.parse(localStorage.getItem("user"))?.id,
    newpass: "",
    newpass2: "",
    oldpass: ""
  })

  const handleForm = (name, value) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  const deleteDate = async () => {
    await axios.delete("/calendar/" + changeDate)
    setChangeDate(false)
    toast.success("Cita eliminada con exito")
    getDates()
  }

  const handleFormPass = (e) => {
    setFormPass({
      ...formPass,
      [e.target.name]: e.target.value
    })
  }

  const [formCreateUser, setFormCreateUser] = useState()


  const handleFormSede = (e) => {
    return setFormCreateUser({
      ...formCreateUser,
      sede: e.map(e => e.value)
    })
  }

  const handleFormSedePut = (e) => {
    return setFormUser({
      ...formUser,
      sede: e.map(e => e.value)
    })
  }

  const handleFormCreateUser = (e) => {
    setFormCreateUser({
      ...formCreateUser,
      [e.target.name]: e.target.value
    })
  }

  const saveChangePass = async () => {
    if (formPass.newpass !== formPass.newpass2) return toast.error("Las contraseñas no coinciden")
    const { data } = await axios.put("/user", formPass)
    setChangePass(false)
    toast(data.users)
  }

  const [pacientes, setPacientes] = useState()

  useEffect(() => {
    axios.get("/client/all").then(({ data }) => { setPacientes(data); })
    axios.get("/user").then(({ data }) => setEspecialista(data))
  }, [])

  const [dateSelected, setDateSelected] = useState()

  const [especialista, setEspecialista] = useState()

  useEffect(() => {
    const dateSelect = date.find(d => d.id == dateId)
    setDateSelected(dateSelect)
    console.log(dateSelect)
    getDates()
  }, [changeDate])

  useEffect(() => {
    const dateSelect = date.find(d => d.id == editDate)
    setDateSelected(dateSelect)
    getDates()
  }, [editDate])

  const [visible, setVisible] = useState(false)

  const [newCate, setNewCate] = useState(false)
  const [newCatego, setNewCatego] = useState(false)
  const [newProce, setNewProce] = useState(false)

  const createNewUser = async () => {
    if (formCreateUser.newpass !== formCreateUser.newpass2) return alert("Las contraseñas no coinciden")
    setCreateUser(false)
    await axios.post("/user", { ...formCreateUser, password: formCreateUser.newpass, date: new Date() })
    const { data } = await axios.get("/user")
    setUsuarios(data)
    setFormCreateUser({})
    alert("Creado con exito")
  }

  const [cateName, setCateName] = useState()

  const crearCate = async () => {
    setNewCate(false)
    await axios.post("/user/categoria", { name: cateName })
    toast.success("Categoria creada con exito")
    axios.get("/user/categoria").then(({data}) => setCategorias(data))
    setNewCatego(false)
  }

  const [proceForm, setProceForm] = useState()

  const crearProce = async () => {
    setNewProce(false)
    await axios.post("/user/procedimientos", proceForm)
    alert("Procedimiento creado con exito")
  }

  const customStyles = {
    control: base => ({
      ...base,
      height: 35,
      minHeight: 35,
      overflow: "hidden"
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

  const [myFun, setMyFun] = useState(() => {})
  
  const hijoFunc = (fn) => {
    setMyFun(() => {
      return fn;
    });
  }

  const nuevaFecha = async () => {
    setTimeout(async () => await myFun(),2500)
    await axios.post("/calendar", {
      title: form.title,
      start: new Date(form.start + "T" + form.hour + ":" + form.min),
      end: new Date(form.start + "T" + form.endhour + ":" + form.endmin),
      procedimiento: form.procedimiento,
      especialista: especialist
    })
    axios.put("/client", {id:idCliente, proxci: new Date(form.start + "T" + form.hour + ":" + form.min)})
    toast.success("Cita creada con exito")
    getDates()
  }

  const [formUser, setFormUser] = useState()

  const editarUsuario = (user) => {
    setFormUser(user)
    setEditUser(true)
  }

  const putUser = () => {
    setEditUser(false)
    axios.put("/user", formUser)
    .then(() => alert("Usuario actualizado"))
  }

  const handleFormPutUser = (e) => {
    const {value,name} = e.target
    setFormUser({...formUser, [name]:value})
  }

  const confirmarDate = (id) => {
    axios.put("/calendar", {id:id, confirmada:true})
    .then(() => {setDateSelected({...dateSelected, confirmada:true})})
  }

  const deleteCate = (id) => {
    axios.delete("/user/cate/id/"+id)
    .then(() => {toast.success("Eliminado con exito"); axios.get("/user/categoria").then(({data}) => setCategorias(data))})
  }

  const deleteProce = (id) => {
    axios.delete("/user/proce/id/"+id)
    .then(() => {toast.success("Eliminado con exito"); axios.get("/user/procedimientos").then(({data}) => setProcedimiento(data))})
  }
  
  const [newProcedi, setNewProcedi] = useState(false)

  const [idCliente, setIdCliente] = useState(null)

  const [recordar, setRecordar] = useState([])

  const [newReco, setNewReco] = useState(false)

  const getRecordar = async () => {
    const {data} = await axios.get("/recordatorio/all")
    setRecordar(data)
    const hoy = new Date().getDate() 
    for(let i = 0; i < data.length; i++){
      if(data[i].dia === hoy || data[i].dia === hoy+1 || data[i].dia === hoy+2){
        toast("Recordatorio:\n Faltan "+ (data[i].dia-hoy) +" dias para: "+data[i].recuerda)
      }
    }
  }
  
  useEffect(() => {
    getRecordar()
  },[])

  const [recoForm, setRecoForm] = useState()
  const [update, setUpdate] = useState(false)

  const crearReco = () => {
    setNewReco(false)
    axios.post("/recordatorio", recoForm)
    .then(() => {toast.success("Recordatorio creado con exito"); setUpdate(!update)})
  }

  const [formPut, setFormPut] = useState({
    start: "",
    hour: "01",
    min: "00",
    endhour: "01",
    endmin: "00",
  })

  const saveDate = async () => {
    await axios.put("/calendar", {
      id:dateSelected?.id,
      start: new Date(formPut.start + "T" + formPut.hour + ":" + formPut.min),
      end: new Date(formPut.start + "T" + formPut.endhour + ":" + formPut.endmin),
    })
    setEditDate(null)
    setChangeDate(null)
  }

  return (
    <>
      <Toaster position='top-center' />
      {newCate && <div className={style.modal}>
        {newCatego ? <div className={style.windows}>
          <h2 className={style.title}>Crear categoria</h2>
          <div className={style.inputContainer}>
            <input type="text" onChange={(e) => setCateName(e.target.value)} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Nombre</label>
          </div>
          <button className={style.button} onClick={crearCate}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setNewCatego(false)}>Atras</button>
        </div>:<div className={style.windows}>
          <h2 className={style.title}>Categorias</h2>
          {categorias?.map(c => <div onClick={() => deleteCate(c.id)} className={style.categoria}>{c.name}
            </div>)}
          <button className={style.button} onClick={() => setNewCatego(true)}>Crear</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setNewCate(false)}>Atras</button>
        </div>}
      </div>}
      {newProce && <div className={style.modal}>
        {newProcedi ? <div className={style.windows}>
          <h2 className={style.title}>Crear procedimiento</h2>
          <div className={style.inputContainer}>
            <input type="text" onChange={(e) => setProceForm({ ...proceForm, label: e.target.value })} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Nombre</label>
          </div>
          <div className={style.inputContainer}>
            <input type="number" onChange={(e) => setProceForm({ ...proceForm, value: e.target.value })} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Precio</label>
          </div>
          <button className={style.button} onClick={crearProce}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setNewProcedi(false)}>Atras</button>
        </div>:<div className={style.windows}>
          <h2 className={style.title}>Procedimientos</h2>
          {procedimiento?.map(p => <div onClick={() => deleteProce(p.id)} className={style.categoria}>{p.label} (${Number(p.value).toLocaleString()})</div>)}
          <button className={style.button} onClick={() => setNewProcedi(true)}>Crear</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setNewProce(false)}>Atras</button>
        </div>}
      </div>}
      {newReco && <div className={style.modal}>
        <div className={style.windows}>
          <h2 className={style.title}>Crear recordatorio</h2>
          <div className={style.inputContainer}>
            <input type="text" onChange={(e) => setRecoForm({ ...recoForm, recuerda: e.target.value })} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Recordatorio</label>
          </div>
          <div className={style.inputContainer}>
            <input type="number" onChange={(e) => setRecoForm({ ...recoForm, dia: e.target.value })} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Dia</label>
          </div>
          <button className={style.button} onClick={crearReco}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setNewReco(false)}>Atras</button>
        </div>
      </div>}
      {changePass && <div className={style.modal}>
        <div className={style.windows}>
          <h2 className={style.title}>Cambiar contraseña</h2>
          <div className={style.inputContainer}>
            <input type="password" onChange={handleFormPass} name="oldpass" value={formPass.oldpass} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Contraseña anterior</label>
          </div>
          <div className={style.inputContainer}>
            <input type="password" onChange={handleFormPass} name="newpass" value={formPass.newpass} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Nueva contraseña</label>
          </div>
          <div className={style.inputContainer}>
            <input type="password" onChange={handleFormPass} name="newpass2" value={formPass.newpass2} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Repite la contraseña</label>
          </div>
          <button className={style.button} onClick={saveChangePass}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setChangePass(false)}>Atras</button>
        </div>
      </div>}
      {createUser && <div className={style.modal}>
        <div className={style.windows}>
          <h2 className={style.title}>Crear usuario</h2>
          <div style={{display:"flex", gap:"20px"}}>
            <div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormCreateUser} name="name" value={formCreateUser?.name} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Nombre</label>
              </div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormCreateUser} name="lastname" value={formCreateUser?.lastname} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Apellido</label>
              </div>
              <div className={style.inputContainer}>
                <select name="role" onChange={handleFormCreateUser} className={style.input}>
                  <option selected>Selecciona un rol</option>
                  <option value="1">Especialista</option>
                  <option value="2">Administrador</option>
                  <option value="3">Super admin</option>
                  <option value="4">Contador</option>
                </select>
                <label className={style.textInput}>Rol</label>
              </div>
              <div className={style.inputContainer}>
                <select name="especialidad" onChange={handleFormCreateUser} className={style.input}>
                  <option selected>Selecciona una especialidad</option>
                  <option value="Cejas">Cejas</option>
                  <option value="Lifting">Lifting</option>
                  <option value="Pestañas">Pestañas</option>
                  <option value="Micropigmentación">Micropigmentación</option>
                  <option value="Otra">Otra</option>
                </select>
                <label className={style.textInput}>Especialidad</label>
              </div>
              <div className={style.inputContainer}>
                <input type="number" onChange={handleFormCreateUser} name="comision" value={formCreateUser?.comision} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>% Comision</label>
              </div>
            </div>
            <div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormCreateUser} name="email" value={formCreateUser?.email} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Email</label>
              </div>
              <div className={style.inputContainer}>
                <input type="password" onChange={handleFormCreateUser} name="newpass" value={formCreateUser?.newpass} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Contraseña</label>
              </div>
              <div className={style.inputContainer}>
                <input type="password" onChange={handleFormCreateUser} name="newpass2" value={formCreateUser?.newpass2} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Repite la contraseña</label>
              </div>
              <div className={style.inputContainer} style={{ zIndex: "900" }}>
                <Select
                  placeholder="Seleccionar sede"
                  name="sede"
                  onChange={handleFormSede}
                  isMulti
                  options={[{ label: "Restrepo", value: "Restrepo" }, { label: "Villavicencio", value: "Villavicencio" }]}
                  styles={customStyles}
                />
                {/* <label className={style.textInput}>Sede</label> */}

              </div>

            </div>
          </div>
          <button className={style.button} onClick={createNewUser}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setCreateUser(false)}>Atras</button>
        </div>
      </div>}
      {editUser && <div className={style.modalFixed}>
        <div className={style.windowsFixed}>
        {window.innerWidth > 700 && <h2 className={style.title}>Editar usuario</h2>}
          <div style={window.innerWidth > 700 ? {display:"flex", gap:"20px"} : {display:"flex", gap:"0px", flexDirection:"column"}}>
            <div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormPutUser} name="name" value={formUser?.name} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Nombre</label>
              </div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormPutUser} name="lastname" value={formUser?.lastname} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Apellido</label>
              </div>
              <div className={style.inputContainer}>
                <select name="role" onChange={handleFormPutUser} className={style.input}>
                  <option selected>Selecciona un rol</option>
                  <option value="1">Especialista</option>
                  <option value="2">Administrador</option>
                  <option value="3">Super admin</option>
                  <option value="4">Contador</option>
                </select>
                <label className={style.textInput}>Rol</label>
              </div>
              <div className={style.inputContainer}>
                <select name="especialidad" onChange={handleFormPutUser} className={style.input}>
                  <option selected>Selecciona una especialidad</option>
                  <option value="Cejas">Cejas</option>
                  <option value="Lifting">Lifting</option>
                  <option value="Pestañas">Pestañas</option>
                  <option value="Micropigmentación">Micropigmentación</option>
                  <option value="Otra">Otra</option>
                </select>
                <label className={style.textInput}>Especialidad</label>
              </div>
              <div className={style.inputContainer}>
                <input type="number" onChange={handleFormPutUser} name="comision" value={formUser?.comision} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>% Comision</label>
              </div>
            </div>
            <div>
              <div className={style.inputContainer}>
                <input type="text" onChange={handleFormPutUser} name="email" value={formUser?.email} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Email</label>
              </div>
              <div className={style.inputContainer}>
                <input type="password" onChange={handleFormPutUser} name="password" value={formUser?.password} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Contraseña</label>
              </div>
              {/* <div className={style.inputContainer}>
                <input type="password" onChange={handleFormPutUser} name="password" value={formUser?.password} className={style.input} placeholder=' '></input>
                <label className={style.textInput}>Repite la contraseña</label>
              </div> */}
              <div className={style.inputContainer} style={{ zIndex: "900" }}>
                <Select
                  placeholder="Seleccionar sede"
                  name="sede"
                  onChange={handleFormSedePut}
                  isMulti
                  options={[{ label: "Restrepo", value: "Restrepo" }, { label: "Villavicencio", value: "Villavicencio" }]}
                  styles={customStyles}
                />
                {/* <label className={style.textInput}>Sede</label> */}

              </div>

            </div>
          </div>
          <button className={style.button} onClick={putUser}>Confirmar</button>
          <br></br>
          <br></br>
          <button className={style.button} onClick={() => setEditUser(false)}>Atras</button>
        </div>
      </div>}

      {(changeDate && !editDate) && <div className={style.modal}>
        <div className={style.windows}>
          <h2 className={style.title}>{dateSelected?.title}</h2>
          <p className={style.title}><b>Procedimiento:</b> {dateSelected?.procedimiento}</p>
          <p className={style.title}><b>Hora:</b> {new Date(dateSelected?.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(dateSelected?.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
          <div className={style.buttons}>
            {dateSelected?.confirmada ?<h4 style={{margin:"0 auto", textAlign:"center"}}>Cita confirmada!</h4> : <button className={style.button} onClick={() => confirmarDate(dateSelected?.id)}>Confirmar</button>}
            {JSON.parse(localStorage.getItem("user"))?.role == 3 && <button className={style.buttonDelete} onClick={() => {console.log(dateSelected);setEditDate(dateSelected?.id)}}>Editar</button>}
            <button className={style.button} onClick={() => setChangeDate(false)}>Cerrar</button>
          </div>
        </div>
      </div>}
      {(changeDate && editDate) && <div className={style.modal}>
        <div className={style.windows}>
          <div className={style.inputContainer}>
            <input type="date" name="start" onChange={(e) => setFormPut({...formPut, [e.target.name]:e.target.value})} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Fecha</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" className={style.input} name="hour" onChange={(e) => setFormPut({...formPut, [e.target.name]:e.target.value})} />
            <label className={style.textInput}>Hora inicio</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" className={style.input} name="endhour" onChange={(e) => setFormPut({...formPut, [e.target.name]:e.target.value})} />
            <label className={style.textInput}>Hora fin</label>
          </div>
          <button className={style.button} onClick={saveDate}>Guardar</button>
            <button className={style.buttonDelete} onClick={deleteDate}>Eliminar</button>
            <button className={style.button} onClick={() => {setChangeDate(false); setEditDate(false)}}>Cerrar</button>
          </div>
        </div>
      }
      {newDate && <div className={style.modal}>
        <div className={style.windows}>
          <h2 className={style.title}>Nuevo evento</h2>
          <div className={style.inputContainer}>
            <select name="title" onChange={(e) => {handleForm(e.target.name, e.target.value); setIdCliente(e.target.options[e.target.selectedIndex].id)}} className={style.input} placeholder=' '>
              <option selected value={null}>Seleccionar</option>
              {pacientes.sort((a,b) => a.name.localeCompare(b.name)).map(p => <option id={p.id} value={`${p.name}`}>{p.name}</option>)}
            </select>
            <label className={style.textInput}>Cliente</label>
          </div>
          <div className={style.inputContainer}>
            <select name="procedimiento" onChange={(e) => handleForm(e.target.name, e.target.value)} className={style.input}>
              {procedimiento?.map(p => <option value={p.label}>{p.label}</option>)}
            </select>
            <label className={style.textInput}>Procedimiento</label>
          </div>
          <div className={style.inputContainer}>
            <input type="date" name="start" onChange={(e) => handleForm(e.target.name, e.target.value)} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Fecha</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" className={style.input} name="hour" onChange={(e) => handleForm(e.target.name, e.target.value)} />
            <label className={style.textInput}>Hora inicio</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" className={style.input} name="endhour" onChange={(e) => handleForm(e.target.name, e.target.value)} />
            <label className={style.textInput}>Hora fin</label>
          </div>
          {/* <div className={style.inputContainer}>
            <select name="especialista" onChange={(e) => handleForm(e.target.name, e.target.value)} className={style.input} placeholder=' '>
              <option selected value={null}>Seleccionar</option>
              {especialista.filter(e => e.role == 1 || e.role == 3).map(p => <option value={p.id}>{p.name} {p.lastname}</option>)}
            </select>
            <label className={style.textInput}>Especialista</label>
          </div> */}
          <button className={style.button} onClick={() => { nuevaFecha(); setNewDate(false) }}>Guardar</button>
          <button className={style.buttonDelete} onClick={() => setNewDate(false)}>Cerrar</button>
        </div>
      </div>}

      {window.innerWidth > 1300 ? <nav className={style.nav}>
        <h3 className={style.title}>Mi perfil</h3>
        <ul className={style.ul}>
          {/* <li onClick={() => setPage(0)} className={style.li}><AiOutlineUser className={style.icon}/> Información</li>
        <li onClick={() => setPage(1)} className={style.li}><MdPayment className={style.icon}/> Mis compras</li>
        { user?.role == 3 && <li onClick={() => {setPage(2); dispatch(setPagina(1))}} className={style.li}><FiUsers className={style.icon}/> Usuarios</li>}        
        { user?.role == 3 &&<li onClick={() => {setPage(3) ; dispatch(setPagina(1))}} className={style.li}><BsBoxSeam className={style.icon}/> Paquetes</li>}
        { user?.role == 3 &&<li onClick={() => setPage(4)} className={style.li}><MdOutlineLocalOffer className={style.icon}/> Promocion</li>}
        { user?.role == (2 || 3) &&<li onClick={() => {setPage(5) ; dispatch(setPagina(1))}} className={style.li}><FaChalkboardTeacher className={style.icon}/> Capacitaciones</li>}
        <li onClick={() => navigate("/")} className={style.li}><FaChalkboardTeacher className={style.icon}/> Volver</li>
        <li onClick={() => {navigate("/"); localStorage.removeItem("token"); dispatch(setUser(false))}} className={style.li}><MdExitToApp className={style.icon}/> Cerrar sesion</li> */}
        </ul>
      </nav> : (visible ? <nav className={style.navMobile}>
        <h3 className={style.titleMobile} onClick={() => setVisible(false)}><GrClose /></h3>
        <ul className={style.ul}>
          <li className={page == 0 ? style.liSelected : style.li} onClick={() => { setPage(0); setVisible(false) }}>Perfil</li>
          {(JSON.parse(localStorage.getItem("user"))?.role >= 1) && <li className={page == 10 ? style.liSelected : style.li} onClick={() => {setPage(10); setVisible(false)}}>Caja</li>}
          {JSON.parse(localStorage.getItem("user"))?.role >= 3 && <li className={page == 1 ? style.liSelected : style.li} onClick={() => { setPage(1); setVisible(false) }}>Reportes</li>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <li className={page == 2 ? style.liSelected : style.li} onClick={() => { setPage(2); setVisible(false) }}>Control financiero</li>}
          {(JSON.parse(localStorage.getItem("user"))?.role == 1 || JSON.parse(localStorage.getItem("user"))?.role == 2 || JSON.parse(localStorage.getItem("user"))?.role == 3) && <li className={page == 3 ? style.liSelected : style.li} onClick={() => { setPage(3); setVisible(false) }}>Agenda</li>}
          {/* {JSON.parse(localStorage.getItem("user"))?.role == (2 || 3) && <li className={page == 4 ? style.liSelected : style.li} onClick={() => {setPage(4); setVisible(false)}}>Control ambiental y limpieza</li>} */}
          <li className={page == 5 ? style.liSelected : style.li} onClick={() => { setPage(5); setVisible(false) }}>Clientes</li>
          {(JSON.parse(localStorage.getItem("user"))?.role == 3) && <li className={page == 6 ? style.liSelected : style.li} onClick={() => { setPage(6); setVisible(false) }}>Usuarios</li>}
          {JSON.parse(localStorage.getItem("user"))?.role == 3 && <li className={page == 7 ? style.liSelected : style.li} onClick={() => { setPage(7); setVisible(false) }}>Proveedores</li>}
          {(JSON.parse(localStorage.getItem("user"))?.role >= 2) && <li className={page == 8 ? style.liSelected : style.li} onClick={() => { setPage(8); setVisible(false) }}>Inventario</li>}
          {(JSON.parse(localStorage.getItem("user"))?.role >= 2) && <li className={page == 9 ? style.liSelected : style.li} onClick={() => { setPage(9); setVisible(false) }}>Recordatorios</li>}
          {/* {JSON.parse(localStorage.getItem("user"))?.role == (2 || 3) && <li className={page == 7 ? style.liSelected : style.li} onClick={() => {setPage(7); setVisible(false)}}>Cotizaciones</li>} */}
          <li className={style.li} onClick={logout}>Cerrar sesion</li>
        </ul>
      </nav> : <h1 className={style.close} onClick={() => setVisible(true)}><HiMenu /></h1>)}

      {window.innerWidth > 1300 && <nav className={style.nav}>
        <img className={style.logo} src={logo} />
        <h1 className={style.saludo}>Hola {JSON.parse(localStorage.getItem("user"))?.name}! 👋</h1>
        <input placeholder="Buscar cliente" onChange={(e) => { setFind(e.target.value); setPage(5) }} className={style.findInput} />
        {/* <button onClick={() => setPage(5)}>Buscar</button> */}
      </nav>}
      <div className={style.flexContainer}>
        {window.innerWidth > 1300 && <div className={style.navigator}>
          <ul className={style.ul}>
            <li className={page == 0 ? style.liSelected : style.li} onClick={() => setPage(0)}>Perfil</li>
            {(JSON.parse(localStorage.getItem("user"))?.role >= 1) && <li className={page == 10 ? style.liSelected : style.li} onClick={() => setPage(10)}>Caja</li>}
            {JSON.parse(localStorage.getItem("user"))?.role >= 3 && <li className={page == 1 ? style.liSelected : style.li} onClick={() => { setPage(1)}}>Reportes</li>}
            {(JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 4) && <li className={page == 2 ? style.liSelected : style.li} onClick={() => setPage(2)}>Control financiero</li>}
            {(JSON.parse(localStorage.getItem("user"))?.role == 2 || JSON.parse(localStorage.getItem("user"))?.role == 3 || JSON.parse(localStorage.getItem("user"))?.role == 1) && <li className={page == 3 ? style.liSelected : style.li} onClick={() => setPage(3)}>Agenda</li>}
            {/* {JSON.parse(localStorage.getItem("user"))?.role == (2 || 3) && <li className={page == 4 ? style.liSelected : style.li} onClick={() => setPage(4)}>Control ambiental y limpieza</li>} */}
            <li className={page == 5 ? style.liSelected : style.li} onClick={() => setPage(5)}>Clientes</li>
            {(JSON.parse(localStorage.getItem("user"))?.role == 3) && <li className={page == 6 ? style.liSelected : style.li} onClick={() => setPage(6)}>Usuarios</li>}
            {JSON.parse(localStorage.getItem("user"))?.role == 3 && <li className={page == 7 ? style.liSelected : style.li} onClick={() => setPage(7)}>Proveedores</li>}
            {(JSON.parse(localStorage.getItem("user"))?.role >= 2) && <li className={page == 8 ? style.liSelected : style.li} onClick={() => setPage(8)}>Inventario</li>}
            {(JSON.parse(localStorage.getItem("user"))?.role >= 2) && <li className={page == 9 ? style.liSelected : style.li} onClick={() => setPage(9)}>Recordatorios</li>}
            {/* {JSON.parse(localStorage.getItem("user"))?.role == (2 || 3) && <li className={page == 7 ? style.liSelected : style.li} onClick={() => setPage(7)}>Cotizaciones</li>} */}
            {/* {(JSON.parse(localStorage.getItem("user"))?.role == 2 || JSON.parse(localStorage.getItem("user"))?.role == 3) && <li className={page == 8 ? style.liSelected : style.li} onClick={() => setPage(8)}>Ajustes</li>} */}
            <li className={style.li} onClick={logout}>Cerrar sesion</li>
          </ul>
        </div>}
        <div className={style.panelContainer}>
          {page == 0 && <Perfil fn={() => setChangePass(true)} />}
          {page == 1 && <SelectReport />}
          {page == 2 && <Financiero fn={() => setNewCate(true)} fnProce={() => setNewProce(true)} />}
          {page == 3 && <Agenda dateSelected={dateSelected} fn={editarEvento} esp={setEspecialist} date={date} hijoFunc={hijoFunc} newDate={() => { setNewDate(true); axios.get("/client/all").then(({ data }) => { setPacientes(data); }) }} />}
          {page == 4 && <Control />}
          {page == 5 && <Pacientes find={find} />}
          {page == 6 && <Usuarios editUser={editarUsuario} users={usuarios} createUser={() => setCreateUser(true)} />}
          {page == 7 && <Proveedores users={usuarios} createUser={() => setCreateUser(true)} />}
          {page == 8 && <SelectSede/>}
          {page == 9 && <Recordatorios update={update} newReco={() => setNewReco(true)}/>}
          {page == 10 && <Caja/>}
          {/* {page == 7 && <Cotizacion />} */}
          {/* {page == 8 && <Ajustes />} */}
        </div>
      </div>
    </>
  )
};

export default Panel