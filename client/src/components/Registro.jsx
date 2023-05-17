import React, { useContext, useEffect, useRef, useState } from 'react'

//CSS
import '../assets/css/styles.css'

//IMG
import logo from '../assets/img/BeBiker.png'

//CONTEXTO
import ConexContext from "../context/ConexContext"
import { Link, useNavigate } from 'react-router-dom'

const Registro = (props) => {
    // ESTADOS
    const [ErrMail, setErrorMail] = useState('') //Cualquier error en el mail
    const [ErrPsw, setErrorPsw] = useState('') //Cualquier error en la psw
    const [ErrNombre, setErrorNombre] = useState('') //Cualquier error en el nombre
    const [ErrUsuario, setErrorUsuario] = useState('') //Cualquier error en el usuario
    const [ErrApellidos, setErrorApellidos] = useState('') //Cualquier error en el apellidos
    const [ErrFechaNac, setErrorFechaNac] = useState('') //Cualquier error en la fecha
    const [ErrTelefono, setErrorTelefono] = useState('') //Cualquier error en el telefono

    //REFs
    const rId = useRef()
    const rMail = useRef()
    const rPsw = useRef()
    const rUsuario = useRef()
    const rNombre = useRef()
    const rApellidos = useRef()
    const rFechaNac = useRef()
    const rTelefono = useRef()

    //Contexto que manejara las peticiones a la BD
    const peticion = useContext(ConexContext)

    const navigate = useNavigate()

    // Funcion que registra un usuario
    async function registrar(event) {
        event.preventDefault()
        //expresiones regulares
        const expMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const expTel = /^\d{9}$/

        if (rMail.current.value === '')
            setErrorMail('Introduce un correo electrónico')
        else if (rPsw.current.value === '')
            setErrorPsw('Introduce una contraseña')
        else if (rUsuario.current.value === '')
            setErrorUsuario('Introduce un nombre de usuario')
        else if (rNombre.current.value === '')
            setErrorNombre('Introduce un nombre')
        else if (rApellidos.current.value === '')
            setErrorApellidos('Introduce un apellido')
        else if (rFechaNac.current.value === '')
            setErrorFechaNac('Introduce una fecha de nacimiento')
        else if (rTelefono.current.value === '')
            setErrorTelefono('Introduce un telefono')
        else {
            let pet
            if (props.show < 0) {
                pet = await peticion('/registro', {
                    method: 'POST',
                    json: {
                        mail: rMail.current.value,
                        usuario: rUsuario.current.value,
                        nombre: rNombre.current.value,
                        fechaNacimiento: rFechaNac.current.value,
                        pws: rPsw.current.value
                    }
                })
            }
        }
    }

    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="BeBiker" />
                </div>
                <form onSubmit={registrar}>
                    <div className="input-group">
                        <input type='email'
                            placeholder='Correo electrónico'
                            ref={rMail}
                            onChange={() => setErrorMail('')} />
                        <p className='error'>{ErrMail}</p>
                    </div>
                    <div className="input-group">
                        <input type='text'
                            placeholder='Usuario'
                            ref={rUsuario}
                            onChange={() => setErrorUsuario('')} />
                        <p className='error'>{ErrUsuario}</p>
                    </div>
                    <div className="input-group">
                        <input type='text'
                            placeholder='Nombre'
                            ref={rNombre}
                            onChange={() => setErrorNombre('')} />
                        <p className='error'>{ErrNombre}</p>
                    </div>
                    <div className="input-group">
                        <input type='date'
                            placeholder='Fecha de nacimiento'
                            ref={rFechaNac}
                            onChange={() => setErrorFechaNac('')} />
                        <p className='error'>{ErrFechaNac}</p>
                    </div>
                    <div className="input-group">
                        <input type='password'
                            placeholder='Contraseña'
                            ref={rPsw}
                            onChange={() => setErrorPsw('')} />
                        <p className='error'>{ErrPsw}</p>
                    </div>
                    <div className="input-group">
                        <button type="submit" className="btnLogin">Registrarse</button>
                        <div className='error'>
                            <p className='error1'>{Error}</p>
                        </div>
                    </div>
                </form>
                <div className="registro">
                    ¿Tienes una cuenta? 
                    <Link to={{pathname:'/login'}} className='link'>
                        Entra
					</Link>
                </div>
            </div>
        </div>
    )
}


export default Registro