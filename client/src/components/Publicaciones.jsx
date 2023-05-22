import React, { useContext } from 'react'

import '../assets/css/publicaciones.css'

import logo from '../assets/img/BeBiker.png'
import Post from './comun/Posts'
import ConexContext from '../context/ConexContext'

export const Publicaciones = () => {
    const { token } = useContext(ConexContext);
    console.log(token)
    return (
        <div className="container">

            <Post />
        </div>
    )
}
