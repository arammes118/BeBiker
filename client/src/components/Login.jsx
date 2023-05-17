import React, { useContext, useEffect, useRef, useState } from 'react'

//CSS
import '../assets/css/styles.css'

//IMG
import logo from '../assets/img/BeBiker.png'

//CONTEXTO
import ConexContext from "../context/ConexContext"
import { Link } from 'react-router-dom'

const Login = () => {
    const [Mail, setMail] = useState("")
    const [Psw, setPsw] = useState("")
    const [Error, setError] = useState("")

    //REFs
    const rMail = useRef()
    const rPsw = useRef()

    //Contexto que manejara las peticiones a la BD
    const peticion = useContext(ConexContext)

    //Función que maneja el login del usuario
    async function login(event) {
        event.preventDefault()
        //Expresion que comprueba que sea un mail válido
        const regMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (Mail === '' || !regMail.test(Mail)) {
            setError("Introduce un correo electrónico válido")
        } else {
            let res = await peticion('/login', {
                headers: {
                    mail: Mail,
                    psw: Psw
                }
            })
            if (!res.res.auth)
                setError("Las claves de acceso son incorrectas")
        }
    }

    //UseEffect 
    useEffect(() => {
        setError('')
    }, [Mail, Psw])


    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="BeBiker" />
                </div>
                <form onSubmit={login}>
                    <div className="input-group">
                        <input type='email'
                            placeholder='Correo electrónico'
                            ref={rMail}
                            value={Mail}
                            onChange={() => setMail(rMail.current.value)} />
                    </div>
                    <div className="input-group">
                        <input type='password'
                            placeholder='Contraseña'
                            ref={rPsw}
                            value={Psw}
                            onChange={() => setPsw(rPsw.current.value)} />
                    </div>
                    <div className="input-group">
                        <button type="submit" className="btnLogin">Iniciar sesión</button>
                        <div className='error'>
                            <p className='error1'>{Error}</p>
                        </div>
                    </div>
                </form>
                <div className="forgot-password">
                    <a href="#">¿Has olvidado la contraseña?</a>
                </div>
                <div className="registro">
                    ¿No tienes una cuenta?
                    <Link to={{ pathname: '/registro' }} className='link'>
                        Registrate
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Login