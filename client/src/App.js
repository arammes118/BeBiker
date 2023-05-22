import React, { useContext, useEffect, useCallback } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Contexto
import ConexContext from "./context/ConexContext";

// Componentes
import Login from "./components/Login";
import Registro from './components/Registro';
import { ResetPass } from "./components/ResetPass";
import { Publicaciones } from "./components/Publicaciones";
import Subir from "./components/Subir";
import { MenuLateral } from "./components/comun/MenuLateral";

function App() {
  // Utilizamos el contexto para obtener el token del usuario
  const { token, setToken } = useContext(ConexContext)

  const guaLocalToken = useCallback(() => {
    if ('token' in localStorage) // Hay un token guardado
      if (localStorage.token) // No esta vacio
        setToken(localStorage.token) // Asignamos ese token
  }, [setToken])

  //EFFECT
  useEffect(() => {
    if (!token) // No hay token, comprueba el almacenamiento local
      guaLocalToken()
    console.log('token', token);
  }, [token, guaLocalToken])

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/resetpass' element={<ResetPass />} />
        </Routes>
      </BrowserRouter>
    )
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<MenuLateral />}>
            <Route index element={<Publicaciones />} />
            <Route path="/publicaciones" element={<Publicaciones />} />
            <Route path='/subir' element={<Subir />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
