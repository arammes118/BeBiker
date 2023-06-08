import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'

//IMGs
import salir from '../../assets/img/salir.png'
import ruta from '../../assets/img/ruta.png'
import subir from '../../assets/img/subir.png'
import user from '../../assets/img/chema.jpg'
import home from '../../assets/img/home.svg'
import perfil from '../../assets/img/person.svg'

// CSS
import '../../assets/css/menu.css'

// Contexto
import ConexContext from '../../context/ConexContext'

export const MenuLateral = () => {
    const { setToken, peticion, perfil_id } = useContext(ConexContext) // Contexto para asignar el Token a '' cuando cierre sesión
    const [open, setOpen] = useState(false) // Estado para saber si el menú esta abierto
    const [Usuario, setUsuario] = useState('') // Estado para almacenar el nombre de usuario
    const [Nombre, setNombre] = useState('') // Estado para almacenar el nombre del usuario
    const [Apellido, setApellido] = useState('') // Estado para almacenar el apellido del usuario

    // REFs
    let menuRef = useRef() // Referencia del menú

    // UseEffects
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
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
            setApellido(pet.apellido)
        }
        ver()
    }, [perfil_id, peticion])

    return (
        <>
            <div className='menu-container' ref={menuRef}>
                <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
                    <img src={user} alt={'Perfil de ' + Usuario}></img>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
                    <h3>{Usuario}<br /><span>{Nombre + ' ' + Apellido}</span></h3>
                    <ul>
                        <DropdownItem to="/publicaciones" img={home} text={"Publicaciones"} />
                        <DropdownItem to="/rutas" img={ruta} text={"Rutas"} />
                        <DropdownItem to="/subir" img={subir} text={"Subir"} />
                        <DropdownItem to="/perfil" img={perfil} text={"Mi Perfil"} />
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

// Función que nos devolverá la ruta y la img de cada opción del menú
function DropdownItem(props) {
    return (
        <li className='dropdownItem'>
            <img src={props.img} alt=""></img>
            <Link to={props.to}>{props.text}</Link>
        </li>
    );
}

