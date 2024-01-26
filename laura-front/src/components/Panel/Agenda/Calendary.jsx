import style from './Agenda.module.css'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es";
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import axios from 'axios';

dayjs.locale("es");
dayjs.extend(localizedFormat);
const localizer = dayjsLocalizer(dayjs)

const Calendary = ({id, fn, newDate,dateSelected, hijoFunc, esp, volver}) => {

    const [date, setDate] = useState([{ id: "a" }, { id: 1 }])
    const [user, setUser] = useState()
  const getDates = async () => {
    var data;
    if (id === "Todos") {
      data = await axios.get("/calendar/all")
    } else {
      data = await axios.get("/calendar/" + id)
    }
    const fechas = data?.data?.map(d => {
      return {
        id: d.id,
        title: d.title,
        start: new Date(d.start),
        end: new Date(d.end),
        resourceId: 1,
        procedimiento: d.procedimiento,
        confirmada:d.confirmada
      }
    })

    setDate(fechas)
  }

  useEffect(() => {
    getDates()
  },[dateSelected])

  const getUser = async () => {
    const {data} = await axios.get("/user/id/"+id)
    setUser(data)
  }

  useEffect(() => {
    getDates()
    getUser()
    esp(id)
  },[])

  const clearComision = async () => {
    await axios.put("/user", {id:id, comisionado:1})
    getUser()
  }


    const formats = {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, "h:mm A", culture), // Formato de 12 horas AM-PM
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
          `${localizer.format(start, "h:mm A", culture)} - ${localizer.format(
            end,
            "h:mm A",
            culture
          )}`, // Formato de 12 horas AM-PM para eventos
      };

      const eventStyleGetter = (event, start, end, isSelected) => {
        if(event.confirmada){
          return {
            style: {
              backgroundColor: '#5FA540', // Cambia el color de fondo del evento,
              border:"0px solid white"
            },
          };
        }else{
          return
        }
      };

    return (
        <>
        <div className={style.agenda}>
            <h1>Agenda</h1>
            <div style={{display:"flex",flexDirection:window.innerWidth > 1300 ? "row":"column", margin:"auto", width:"fit-content", gap:"50px"}}>
        <Calendar
        className={style.calendario}
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 20, 0)}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          noEventsInRange: "No hay eventos en el rango de fecha seleccionado",
          showMore: function showMore(total) {
            return "+".concat(total, " mas");
          }
        }}
      localizer={localizer}
      events={date?.map(d => {
        return{
        id:d.id,
        title:d.title,
        start:d.start,
        end:d.end,
        resourceId:d.resourceId,
        confirmada:d.confirmada,
        }
    })}
      eventPropGetter={eventStyleGetter}
      startAccessor="start"
      endAccessor="end"
      formats={formats}
      onSelectEvent={(e) => fn(e.id)}
      style={{ height: 400, width:window.innerWidth > 1000 ? 600 : null }}
    />
    <div style={{display:"flex", flexDirection:"column"}}>
    {(JSON.parse(localStorage.getItem("user"))?.role >= 2 || JSON.parse(localStorage.getItem("user"))?.id == id) && <button className={style.button} onClick={() => {newDate(); hijoFunc(getDates);getDates()}}>Nuevo evento</button>}
    <button className={style.button} onClick={volver}>Volver</button>
    {/* <p>Comisionado: ${user?.comisionado.toLocaleString()}</p> */}
    {/* <button className={style.button} onClick={clearComision}>Reiniciar</button> */}
    </div>
    </div>
    </div>

        </>
    )
}

export default Calendary