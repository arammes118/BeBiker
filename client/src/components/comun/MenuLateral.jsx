import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'

//IMGs
import salir from '../../assets/img/salir.png'
import perfil from '../../assets/img/perfil.png'
import ruta from '../../assets/img/ruta.png'
import subir from '../../assets/img/subir.png'
import user from '../../assets/img/chema.jpg'

import home from '../../assets/img/home.svg'
import perfil2 from '../../assets/img/person.svg'

import '../../assets/css/menu.css'
import ConexContext from '../../context/ConexContext'

export const MenuLateral = () => {
    //Contexto para asignar el Token a '' cuando cierre sesión
    const { setToken, peticion, perfil_id } = useContext(ConexContext)
    const [open, setOpen] = useState(false)
    const [Usuario, setUsuario] = useState('')
    const [Nombre, setNombre] = useState('')

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

    useEffect(() => {
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            console.log(pet)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
        }
        ver()
    }, [])

    return (
        <>
            <div className='menu-container' ref={menuRef}>
                <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
                    <img src={user}></img>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
                    <h3>{Usuario}<br /><span>{Nombre}</span></h3>
                    <ul>
                        <DropdownItem to="/publicaciones" img={home} text={"Publicaciones"} />
                        <DropdownItem to="/subir" img={subir} text={"Subir"} />
                        <DropdownItem to="/rutas" img={ruta} text={"Rutas"} />
                        <DropdownItem to="/perfil" img={perfil2} text={"Mi Perfil"} />

                        <li className='dropdownItem' onClick={() => setToken('')}>
                            <img src={salir} alt="Salir" />
                            <Link to="/login">Cerrar sesión</Link>
                        </li>
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

