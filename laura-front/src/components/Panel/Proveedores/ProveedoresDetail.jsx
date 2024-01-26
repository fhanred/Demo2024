import { useRef } from 'react'
import style from './Proveedores.module.css'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
// import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
// import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import ProveedorEdit from './ProveedorEdit'

const ProveedoresDetail = ({pacienteId, back}) => {


    const [paciente, setPaciente] = useState()
    const refCanvaFirm = useRef(null)
    const refCanva = useRef(null)
    const [edit, setEdit] = useState(false)

    const [category, setCategory] = useState(1)
    // const [color, setColor] = useState("#aabbcc");

    const uploadUserImage = async (e) => {
      const files = e.target.files;
      const dato = new FormData();
      dato.append("file", files[0]);
      dato.append("upload_preset","natalie")
      dato.append("api_key","612393625364863")
      dato.append("timestamp", 0)
      const res = await axios.post("https://api.cloudinary.com/v1_1/dftvenl2z/auto/upload", dato)
      // await axios.put("/user", {id:JSON.parse(localStorage.getItem("user")).id, image:res.data.secure_url})
      // localStorage.setItem("image", res.data.secure_url)
      setFormEvo({...formEvo, url:res.data.secure_url})
    }

    const reloadUser = () => {
      axios.get("/proveedor/"+pacienteId)
      .then(({data}) => setPaciente(data))
      // .then(({data}) => {setPaciente(data);setTimeout(() => {refCanva.current.loadSaveData(data.diagrama,true)},1000)})
    }

    useEffect(() => {
      reloadUser()
      },[])
  
      const [tipo, setTipo] = useState(1)

      const [formEvo, setFormEvo] = useState()

      const handleFormEvo = (e) => {
        const {name,value} = e.target
        setFormEvo({...formEvo, [name]:value})
      }

      const newEvolution = () => {
        if(tipo == 2){
          axios.post("/client/evolucion", {...formEvo,evolucion:"Procedimiento", abono:null,precio:formEvo.abono, clientId:pacienteId})
          .then(() => reloadUser())
          axios.put("/client", {ulpro:formEvo.date, id:pacienteId, saldo:paciente.saldo-formEvo.abono})
          .then(() => reloadUser())
          setFormEvo({})
          toast.success("Evolucion creada con exito")
        }else{
          axios.post("/client/evolucion", {...formEvo, clientId:pacienteId})
          .then(() => reloadUser())
          axios.put("/client", {ulpro:formEvo.date, id:pacienteId, saldo:Number(paciente.saldo)+Number(formEvo.abono)})
          .then(() => reloadUser())
          axios.post("/financiero", {user:paciente.name, date:formEvo.date, monto:formEvo.abono, reason:formEvo.evolucion, tipo:"Bancolombia"})
          .then(() => reloadUser())
          setFormEvo({})
          toast.success("Evolucion creada con exito")
        }
      }

      const [consen, setConsen] = useState(false)

      const handleSave = () => {
        axios.put("/client", {id:pacienteId, diagrama: refCanva.current.getSaveData()})
      }
      const [evolucion, setEvolucion] = useState(false)
      const [nuevaEvolucion, setNuevaEvolucion] = useState(false)
    
      const options = {
        title: '¿Estás seguro?',
        message: 'Este proceso no se puede revertir',
        buttons: [
          {
            label: 'Si',
            onClick: () => deleteProveedor()
          },
          {
            label: 'No',
            onClick: () => console.log("Cancelado")
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

      const deleteProveedor = async () => {
        const {data} = await axios.delete("/proveedor/"+paciente.id)
        back()
      }

      // const [consenId, setConsenId] = useState()

      if(edit) return <ProveedorEdit proveedor={paciente} back={() => setEdit(false)} updateUsers={() => reloadUser()}/>
    return (
        <>
        <Toaster/>
        { !evolucion ? 
        <div className={style.detailPaciente}>
          <br></br>
          <br></br>
        <br></br><br></br><br></br>
            <img className={style.imageClient} src={paciente?.image}/>
            <br></br>
            <div className={style.clinicHistory}>
          <div className={style.row} style={window.innerWidth > 1300 ? {flexDirection:"row"} : {flexDirection:"column"}}>
          <div className={style.column}>
          { JSON.parse(localStorage.getItem("user"))?.role >= 2 && <>
            <p><b>Nombre:</b> {paciente ? paciente.name : <span style={{color:"grey"}}>Cargando..</span>}</p>
            <p><b>Celular:</b> {paciente ? paciente.celular : <span style={{color:"grey"}}>Cargando..</span>}</p>
            <p><b>Rut:</b> {paciente ? paciente.rut : <span style={{color:"grey"}}>Cargando..</span>}</p>
            {/* <div className={style.inputContainer}>
              <input type="date" className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Proxima cita</label>
            </div>
            <div className={style.inputContainer}>
              <input readOnly value={paciente?.especialista} onChange={null} type="text" className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Especialista</label>
            </div> */}
            </>}
          </div>
          <div className={style.column}>
          { JSON.parse(localStorage.getItem("user"))?.role >= 2 && <><p><b>Direccion:</b> {paciente ? paciente.direccion : <span style={{color:"grey"}}>Cargando..</span>}</p>
            <p><b>Departamento:</b> {paciente ? paciente.departamento : <span style={{color:"grey"}}>Cargando..</span>}</p>
            <p><b>Ciudad:</b> {paciente ? paciente.ciudad : <span style={{color:"grey"}}>Cargando..</span>}</p>
            {/* <button className={style.button} onClick={() => {setConsen(true)}}>Ver consentimientos</button> */}
            <br></br> <br></br>
            {/* <button className={style.button} onClick={() => setEvolucion(true)}>Ver Evolucion</button> */}
            </>}
            <br></br>
          </div>
        </div>
        {/* <h3>Odontodiagrama</h3>
        <div className={style.buttons}>
        <button className={style.button} onClick={handleSave}>Guardar</button>
        { JSON.parse(localStorage.getItem("user"))?.role >= 2 && <button className={style.button} onClick={() => refCanva.current.clear()}>Limpiar</button>}
        </div>
        <HexColorPicker color={color} onChange={setColor} style={{margin:"50px auto"}}/>
        <CanvasDraw
        // onChange={handleSave}
        lazyRadius={0}
        imgSrc={foto}
        brushRadius={4}
        hideInteenablePanAndZoom={true}
        ref={refCanva}
        brushColor={color}
        loadTimeOffset={0}
        style={{width:"700px", margin:"0 auto"}}
        /> */}



        </div>
        <br></br>
        <button className={style.button} onClick={() => setEdit(true)}>Editar proveedor</button><br></br><br></br>
        <button className={style.button} onClick={() => confirmAlert(options)}>Eliminar proveedor</button><br></br><br></br>
        <button className={style.button} onClick={back}>Volver</button>
        </div>
        :
        <div>
        {!nuevaEvolucion ? 
        <div>
        <h1 onClick={() => setEvolucion(false)}>Evolucion</h1>
        
        
        
        <table className={style.evolucion}>
          <tr>
          <td className={style.topTd}>Fecha</td>
          <td className={style.topTd}>Hora</td>
          <td className={style.topTd}>Evolucion</td>
          <td className={style.topTd}>Abono</td>
          <td className={style.topTd}>Precio</td>
          <td className={style.topTd}>Url</td>
          </tr>
          {paciente?.evolucions?.map(e => <tr>
          <td className={style.td}>{e.date}</td>
          <td className={style.td}>{e.time}</td>
          <td className={style.td}>{e.evolucion}</td>
          <td className={style.td}>${Number(e.abono).toLocaleString()}</td>
          <td className={style.td}>${Number(e.precio).toLocaleString()}</td>
          <td className={style.td}><a className={style.button} href={e.url} target='blank'>Ver</a></td>
          </tr>)}
        </table>
        <br></br>
        <p><b>Saldo:</b> ${Number(paciente?.saldo).toLocaleString()}</p>
        <div className={style.buttons}>
        <button className={style.button} onClick={() => setNuevaEvolucion(true)}>Agregar</button>
        <button className={style.button} onClick={() => setEvolucion(false)}>Volver</button>
        </div>
        </div>
        :   
            <div className={style.form}>
                <h1 onClick={() => setNuevaEvolucion(false)}>Nueva evolucion</h1>
                <label>
                <input type='radio' onClick={(e) => setTipo(1)} name="tipo"/>
                Abono
                </label>
                <br></br>
                <label>
                <input type='radio' onClick={(e) => setTipo(2)} name="tipo"/>
                Procedimiento
                </label>
                {tipo == 1 && <div>
                <div className={style.inputContainer}>
            <input type="date" name="date" onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Fecha</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" name="time" step="60" onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Hora</label>
          </div>
          <div className={style.inputContainer}>
            <input name="evolucion" onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Evolucion</label>
          </div>
          <div className={style.inputContainer}>
            <input type="number" name="abono" value={formEvo?.abono} onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Abono</label>
          </div>
          <input type="file" onChange={uploadUserImage} style={{width:"200px"}}></input>
                </div>}
                {tipo == 2 && <div>
                <div className={style.inputContainer}>
            <input type="date" name="date" onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Fecha</label>
          </div>
          <div className={style.inputContainer}>
            <input type="time" name="time" step="60" onChange={handleFormEvo} className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Hora</label>
          </div>
          <div className={style.inputContainer}>
          <select onChange={(e) => setCategory(e.target.value)} className={style.input}>
            <option value={1}>Prevencion</option>
            <option value={2}>Operatoria en posteriores</option>
            <option value={3}>Operatoria en interiores</option>
            <option value={4}>Protesis Flexis</option>
            <option value={5}>Nucleos </option>
            <option value={6}>Corona Metal Porcelana</option>
            <option value={7}>Corona libre Metal </option>
            <option value={8}>Cirugía oral</option>
          </select>
          <label className={style.textInput}>Categoria</label>
          </div>
          <div className={style.inputContainer}>
          {category == 1 && <select onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})} className={style.input}>
          <option value="30000">Valoración</option>
          <option value="90000">Destartraje</option>
          <option value="50000">profilaxis</option>
          <option value="20000">Flour</option>
          <option value="70000">Resina preventiva </option>
          <option value="110000">Sesion de Fluor 3M</option>
          </select>}
          {category == 2 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="30000">Cemento temporal</option>
          <option  value="80000">Urgencia</option>
          <option  value="95000">Resina 1  superficie</option>
          <option  value="120000">Resina 2 superficie</option>
          <option  value="150000">Resina 3  superficie</option>
          <option  value="180000">Reconstrucción</option>
          <option  value="250000">Reconstrucción + poste fibra</option>
          <option  value="280000">Incrustación técnica indirecta</option>
          <option  value="40000">Lonomero vidrio </option>
          </select>}
          {category == 3 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="80000">Resina ángulo incisal</option>
          <option  value="120000">Resina 2 superficies</option>
          <option  value="150000">Resina 3 superficies</option>
          <option  value="120000">Bordes incisales</option>
          <option  value="680000">Bordent total </option>
          <option  value="640000">Brodent Parcial</option>
          </select>}
          {category == 4 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="1040000">Brodent </option>
          <option  value="1120000">Super C</option>
          <option  value="1200000">Duratone</option>
          <option  value="680000">Acker Brodent</option>
          <option  value="720000">Acker Super C</option>
          <option  value="800000">Acker Duratone</option>
          <option  value="1760000">Isoiid Total</option>
          </select>}
          {category == 5 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="280000">Metal base </option>
          <option  value="320000">Metal base con apacador </option>
          <option  value="0000">En oro</option>
          </select>}
          {category == 6 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="600000">Corona IPS Style </option>
          <option  value="780000">Coronas IPS Style + Hombro ceramico</option>
          </select>}
          {category == 7 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="1400000">Zirconio </option>
          <option  value="1200000">E-max</option>
          <option  value="640000">Ceromero</option>
          </select>}
          {category == 8 && <select className={style.input} onChange={(e) => setFormEvo({...formEvo, abono:e.target.value})}>
          <option  value="180000">Gingivectomía convencional</option>
          <option  value="350000">Gingivectomía con fresado</option>
          <option  value="90000">Exodoncia simple</option>
          <option  value="170000">Exodoncia + regeneración ósea</option>
          <option  value="0000">Diseños de sonrisa</option>
          <option  value="250000">Blanqueamiento 3 sesiones</option>
          <option  value="500000">Cantos en cerámica</option>
          <option  value="1000000">Cementacion Corona Unidad con Fosfato</option>
          <option  value="1120000">Empress alto estética</option>
          <option  value="180000">Carillas Renna convencional </option>
          <option  value="80000">Cuellos</option>
          <option  value="30000">Cementacion Corona Unidad con Fosfato</option>
          <option  value="50000">Con lanomero</option>
          <option  value="450000">Diseño de sonrisa Blanqueamento 3 sesiones</option>
          <option  value="520000">Diseño de sonrisa Carillas en Ceromero</option>
          <option  value="1000000">Diseño de sonrisa Carillas en E-max monoliticas </option>
          <option  value="1120000">Diseño de sonrisa Carillas en E-max estratificadas</option>
          <option  value="280000">Diseño de sonrisa Carillas en E-max Alta estetica</option>
          </select>}
          <label className={style.textInput}>Procedimiento</label>
          </div>
          <div className={style.inputContainer}>
            <input type="number" name="abono" value={formEvo?.abono} onChange={handleFormEvo} disabled className={style.input} placeholder=' '></input>
            <label className={style.textInput}>Precio</label>
          </div>
          <input type="file" onChange={uploadUserImage} style={{width:"200px"}}></input>
                </div>}
          <br></br><br></br>
          
          <div className={style.buttons}>
          <button className={style.button} onClick={() => {setNuevaEvolucion(false); newEvolution()}}>Guardar</button>
          <button className={style.button} onClick={() => setNuevaEvolucion(false)}>Volver</button>
          </div>
            </div>
            }
        </div>
        }
        </>
    )
}

export default ProveedoresDetail