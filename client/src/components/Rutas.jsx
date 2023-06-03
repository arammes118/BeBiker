import React from 'react'
import chema from '../assets/img/chema.jpg'

import '../assets/css/rutas.css'

export default function Rutas() {
  return (
    <div className="tarjeta">
      <div className="contenido">
        <div className="ladoIzq">
          <h2 className="titulo">Ruta por el tranco</h2>
          <div className="cuerpo">
            <p>Ruta de curvas perfecta</p>
            <a className="btn" href="#">Más info</a>
            <a className="btn" href="#">Ver perfil</a>
          </div>
        </div>
        <div className="ladoDer">
          <img src={chema} /></div>
      </div>
    </div>
  )
}
