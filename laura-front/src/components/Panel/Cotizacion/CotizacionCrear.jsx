import style from './CotizacionCrear.module.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import precios from '../../../precios';

const CotizacionCrear = ({volver}) => {
    const [pacientes, setPacientes] = useState()

    useEffect(() => {
        axios.get("/client/all").then(({ data }) => setPacientes(data))
    }, [])

    
    const [valor, setValor] = useState(0)
    const [proce, setProce] = useState(0)
    const [form, setForm] = useState()

    const calcValor = (array) => {
        var value = 0;
        array.forEach(element => {
            value = value + element.value
        });
        setProce(array)
        setValor(value)
    }
    
    const handleForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    } 

    const newCoti = () => {
        axios.post("/client/cotizacion", {...form, price:valor, proced:proce}).then(() => volver())
    }

    return (
        <>
                <h1 style={{textAlign:"center", marginBottom:"40px"}}>Nueva cotizacion</h1>
            <div className={style.form}>
            <div className={style.inputContainer}>
              <input type="date" name="date" onChange={handleForm} className={style.input} placeholder=' '></input>
              <label className={style.textInput}>Fecha</label>
            </div>
            <div className={style.inputContainer}>
            <select name="clientId" className={style.input} onChange={handleForm}>
                <option className={style.input} value={null}>Seleccionar</option>
                {pacientes?.map(p => <option value={`${p.id}`}>{p.name}</option>)}
            </select>
            <label className={style.textInput}>Cliente</label>
            </div>
            </div>
            <div className={style.selectMulti}>
            <h4>Procedimientos</h4>
            <Select
                onChange={(e) => calcValor(e)}
                isMulti
                options={precios}
            />
        </div>
            <p className={style.valor}><b>Total:</b> ${Number(valor).toLocaleString()}</p>
            <button onClick={newCoti} className={style.button}>Crear</button>
        </>
    )
}

export default CotizacionCrear