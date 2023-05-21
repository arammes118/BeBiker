import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'

//IMGs
import salir from '../../assets/img/salir.png'
import perfil from '../../assets/img/perfil.png'
import ruta from '../../assets/img/ruta.png'
import subir from '../../assets/img/subir.png'
import user from '../../assets/img/chema.jpg'
import home from '../../assets/img/home.png'

import '../../assets/css/menu.css'

export const MenuLateral = () => {
    const [open, setOpen] = useState(false)

    let menuRef = useRef()

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }

    });

    return (
        <>
            <div className='menu-container' ref={menuRef}>
                <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
                    <img src={user}></img>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
                    <h3>_alfonsormz03_<br /><span>Alfonso Ramirez</span></h3>
                    <ul>
                        <DropdownItem to="/publicaciones" img={home} text={"Publicaciones"} />
                        <DropdownItem to="/subir" img={subir} text={"Subir"} />
                        <DropdownItem to="/rutas" img={ruta} text={"Rutas"} />
                        <DropdownItem to="/perfil" img={perfil} text={"Mi Perfil"} />


                        <DropdownItem to="/login" img={salir} text={"Cerrar sesión"} />
                    </ul>
                </div>
            </div>
            <div>
                <Outlet />
            </div>
        </>
    )
}

function DropdownItem(props) {
    return (
        <li className='dropdownItem'>
            <img src={props.img}></img>
            <Link to={props.to}>{props.text}</Link>
        </li>
    );
}

