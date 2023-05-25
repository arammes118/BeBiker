import React from 'react'
import chema from '../assets/img/chema.jpg'

import '../assets/css/rutas.css'

export default function Rutas() {
  return (
    <div class="tarjeta">
      <div class="contenido">
        <div class="ladoIzq">
          <h2 class="titulo">Ruta por el tranco</h2>
          <div class="cuerpo">
            <p>Ruta de curvas perfecta</p>
            <a class="btn" href="#">Más info</a>
            <a class="btn" href="#">Ver perfil</a>
          </div>
        </div>
        <div class="ladoDer">
          <img src={chema} /></div>
      </div>
    </div>
  )
}
