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
import { Publicaciones } from "./components/Publicaciones";
import Subir from "./components/Subir";
import { MenuLateral } from "./components/comun/MenuLateral";
import { Perfil } from './components/Perfil';
import Rutas from './components/Rutas';
import { Perfiles } from './components/Perfiles';
import { Ruta } from './components/Ruta';
import { Comentarios } from './components/Comentarios';
import { Seguidores } from './components/Seguidores';
import { Seguidos } from './components/Seguidos';

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
        </Routes>
      </BrowserRouter>
    )
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MenuLateral />} >
            <Route index element={<Publicaciones />} />
            <Route path='/publicaciones' element={<Publicaciones />} />
            <Route path='/comentarios/:idPost' element={<Comentarios />} />
            <Route path='/subir' element={<Subir />} />
            <Route path='/rutas' element={<Rutas />} />
            <Route path='/ruta/:tituloRuta/:userId' element={<Ruta />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/perfil/seguidores' element={<Seguidores />} />
            <Route path='/perfil/seguidos' element={<Seguidos />} />
            <Route path="/perfil/:userId" element={<Perfiles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
