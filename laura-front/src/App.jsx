import './App.css'
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Panel from './components/Panel/Panel'
import Landing from './components/Landing/Landing'
import Procedimientos from './components/Procedimientos/Procedimientos'
import Cursos from './components/Cursos/Cursos'

function App() {
  const navigate = useNavigate()
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/procedimiento" element={<Procedimientos />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </>
  )
}

export default App



