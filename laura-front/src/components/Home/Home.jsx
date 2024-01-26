import style from './Home.module.css'
import natalie from "../../assets/natalie3.jpg" 
import natalie4 from "../../assets/natalie4.jpg" 
import natalie6 from "../../assets/natalie6.jpg" 
import {FaArrowDown} from "react-icons/fa"
import logoNata from "../../assets/logonatalie.png"
import logoNata2 from "../../assets/logonatalie2.png"
import logoMini from "../../assets/logonata.png"
import Footer from '../Footer/Footer'
import ortodoncia from "../../assets/ortodoncia.jpg"
import telefono from "../../assets/telefono.png"
import {FiPhoneCall} from "react-icons/fi"
import {HiOutlineMail} from "react-icons/hi"
import {MdOutlineLocationOn} from "react-icons/md"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import fotocelular from "../../assets/celularfoto.jpg"

import a1 from "../../assets/a1.jpeg"
import a2 from "../../assets/a2.jpeg"
import a3 from "../../assets/a3.jpeg"
import a4 from "../../assets/a4.jpeg"
import a5 from "../../assets/a5.jpeg"
import a6 from "../../assets/a6.jpeg"
import a7 from "../../assets/a7.jpeg"

import { Fade } from "react-awesome-reveal";
import { useNavigate } from 'react-router-dom'
import {Element, Link} from "react-scroll" 

const Home = () => {

  const navigate = useNavigate()

  return(
    <div className={style.home}>
      <nav className={style.nav}>
        <img className={style.logoMini} src={logoMini}/>
    <ul className={style.ul}>
        {/* <li className={style.li}>Inicio</li> */}
        {/* <li onClick={() => navigate("/login")} className={style.li}>Ingresar</li> */}
    </ul>
    </nav>
      <div className={style.container}>
        <div className={style.inicio}>
        <div className={style.inicioTitle}>
        <h1 className={style.titleName}>Natalie Ariza</h1>
        <h2 className={style.titleProfesion}>ODONTOLOGA</h2>
        <button className={style.buttonReserva}><a className={style.noLink} target="_blank" href="https://wa.link/sdh5gu">Reserva tu valoracion</a></button>
        </div>
        <img className={style.logoNata} src={logoNata2}/>
        </div>
        <div className={style.pantallaNegra} style={{zIndex:"1"}}></div>
        <Carousel infiniteLoop={true} renderIndicator={() => {}} renderThumbs={() => {}} renderArrowNext={() => {}} renderArrowPrev={() => {}} interval="6000" autoPlay={true} showStatus={false}>
                <div style={{minWidth:"1000px"}}>
                <img className={style.img} alt="Natalie" src={natalie}/>
                </div>
                <div style={{minWidth:"1000px"}}>
                <img className={style.img} alt="Natalie" src={natalie4}/>
                </div>

            </Carousel>
      </div>      
    <div className={style.navDiv}></div>
      <div className={style.resumeContainer}>
        <div className={style.especialidades}>
           <Fade damping="0.2" direction='right' triggerOnce={true} cascade={true}>
            <div className={style.especialidad}>
              <img className={style.espeImg} src="https://drjoselora.com/wp-content/uploads/2021/02/rehabilitacion-copia.jpg"/>
              <h1 className={style.espeTitle}>Rehabilitacion Oral</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://estudidentalbarcelona.com/wp-content/uploads/2018/04/soluciones-estetica-dental.jpg"/>
              <h1 className={style.espeTitle}>Estetica Dental</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://dentalcarralero.com/wp-content/uploads/2021/04/ortodoncia-tradicional.jpg"/>
              <h1 className={style.espeTitle}>Ortodoncia</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://www.claudiamadrid.co/fotossubsecciones/macro_subseccion2017_07_19_15_38_11_20.JPG"/>
              <h1 className={style.espeTitle}>Ortopedia Maxilar</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://staticnew-prod.topdoctors.cl/files/Image/large/ad2f2fffea02ddb26d351e0a884989b7.jpg"/>
              <h1 className={style.espeTitle}>Periodoncia</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://images.squarespace-cdn.com/content/v1/5b91733c9772ae9bb38e47c0/1600647328055-54A27ABC4DEA07QNAWB7/Cirug%C3%ADa+Dental.jpg"/>
              <h1 className={style.espeTitle}>Cirugia Oral</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://www.smysecret.com/blog/wp-content/uploads/2020/08/que-es-una-endodoncia-scaled.jpg"/>
              <h1 className={style.espeTitle}>Endodoncia</h1>
            </div>
            <div className={style.especialidad}>
            <img className={style.espeImg} src="https://vitaluna.es/wp-content/uploads/2019/03/implantologia.jpg"/>
              <h1 className={style.espeTitle}>Implantologia</h1>
            </div>
            </Fade>

        </div>
      </div>
      <div className={style.resumeContainer}>
        <div className={style.disenoSonrisa}>
          <Fade triggerOnce direction='left' fraction={0.5}>
        <Carousel width="400px" infiniteLoop={true} interval="3000" autoPlay={true} showStatus={false}>
                <div>
                    <img src="https://img.freepik.com/foto-gratis/sonrisa-perfecta-dientes-blancos-primer-plano_144627-29225.jpg?size=626&ext=jpg&ga=GA1.1.1016474677.1696550400&semt=ais" />
                </div>
                <div>
                    <img src="https://www.cronica.com.mx/uploads/2021/09/27/6153c40d3ec9e.jpeg" />
                </div>
                <div>
                    <img src="https://savannaodontologia.com/wp-content/uploads/2020/02/891.jpg" />
                </div>
            </Carousel>
          </Fade>
          <Fade triggerOnce direction='right' fraction={0.5}>
        <div className={style.texto}>
          <h1 className={style.titleTexto}>Diseño de sonrisa</h1>
          <p className={style.subtitleTexto}>Ultima tecnologia</p>
          <p className={style.subtitleTexto}>Maxima naturalidad</p>
          <p className={style.subtitleTexto}>Una sonrisa para cada rostro</p>

          <p className={style.descTexto}>Deseas diseño de sonrisa pero te da temor que no se vea natural ? Que son los laminados cerámicos? Que son las carillas indirectas en resina? En la actualidad el éxito de la estética es lograr resultados lo más parecidos a la naturaleza posible.</p>
          <button className={style.buttonValoracion}><a className={style.noLink} target="_blank" href="https://wa.link/sdh5gu">Pide tu valoracion</a></button>
        </div>
          </Fade>
        </div>
      </div>
      <div className={style.resumeContainer}>
        <div className={style.disenoSonrisa2}>
        <Fade triggerOnce direction='left' fraction={0.5}>
          <div className={style.containerTlf}>
        {/* <img className={style.imgTlf} src={fotocelular}/> */}
          <Carousel className={style.carrusel2} style={{backgroundColor:"transparent"}} renderThumbs={() => null} width="200px" infiniteLoop={true} interval="2500" autoPlay={true} showStatus={false}>
                <div>
                    <img src={fotocelular} />
                </div>
                <div>
                    <img src={a1} />
                </div>
                <div>
                    <img src={a3} />
                </div>
                <div>
                    <img src={a4} />
                </div>
                <div>
                    <img src={a5} />
                </div>
                <div>
                    <img src={a6} />
                </div>
                <div>
                    <img src={a7} />
                </div>
            </Carousel>
        <img className={style.carrusel} style={{backgroundColor:"transparent"}} src={telefono}/>
          </div>
        </Fade>
        <Fade triggerOnce direction='right' fraction={0.5}>
        <div className={style.texto}>
          <p className={style.descTexto} style={{ textAlign:"center"}}>
Bienvenidos al consultorio dental de la Dra. Natalie Ariza y su equipo de especialistas, donde no solo diseñamos sonrisas, te devolvemos la seguridad y la tranquilidad al reír y masticar.</p>
          <button className={style.buttonValoracion}><a className={style.noLink} target="_blank" href="https://wa.link/sdh5gu">Pide tu valoracion</a></button>
        </div>
        </Fade>
        </div>
      </div>
        <div className={style.final}>
        <div className={style.izquierda}>
        <img className={style.logoNatalie} src={logoNata}/>
        <div className={style.mapa}>
          <div style={{width: "100%"}}><iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=200&amp;hl=es&amp;q=4.2586822,-73.5606767+(Natalie%20Ariza%20Odontolog%C3%ADa%20Est%C3%A9tica)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">Car Navigation Systems</a></iframe></div>
        </div>
        </div>
        <div className={style.derecha}>
          <h1 className={style.textoGrande}>Agendar cita</h1>
          <div className={style.numero}>
            <FiPhoneCall className={style.iconitos}/>
            <p className={style.textoYina}>+57 3204519919</p>
          </div>
          <div className={style.numero}>
          <HiOutlineMail className={style.iconitos}/>
          <p className={style.textoYina}>nataliearizaeo@gmail.com</p>
          </div>
          <div className={style.numero}>
          <MdOutlineLocationOn className={style.iconitos}/>
          <p className={style.textoYina}>Centro Comercial Sunrise Ofc. 205</p>
          </div>
        </div>
        </div>
        <Footer/>
      </div>
  )
};

export default Home