import React from 'react'
import '../assets/css/perfil.css'
import logo from '../assets/img/BeBiker.png'

export const Perfil = () => {
    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-picture"></div>
                <div className="profile-info">
                    <h1>_alfonsormz03_</h1>
                    <h3>Alfonso Ramirez</h3>
                    <p>Yamaha YZF R-125</p>
                </div>
            </div>

            <div className="profile-content">
                <h2>Publicaciones recientes</h2>
                <div className="post">
                    <img src={logo} alt="Publicación 1" />
                    <p>Descripción de la publicación</p>
                </div>
                <div className="post">
                    <img src={logo} alt="Publicación 2" />
                    <p>Descripción de la publicación</p>
                </div>
                {/* Agrega más publicaciones aquí */}
            </div>
        </div>
    )

}
