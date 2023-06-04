import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

//CSS
import '../assets/css/styles.css'

//IMG
import logo from '../assets/img/BeBiker.png'
import ConexContext from '../context/ConexContext'

export const ResetPass = () => {
    //Contexto que manejara las peticiones a la BD
    const { peticion } = useContext(ConexContext)

    const [Mail, setMail] = useState("")
    const [Error, setError] = useState("")

    //REFs
    const rMail = useRef()

    //Función que maneja el login del usuario
    async function resetPass(event) {
        event.preventDefault()
        //Expresion que comprueba que sea un mail válido
        const regMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (Mail === '' || !regMail.test(Mail)) {
            setError("Introduce un correo electrónico válido")
        } else {
            let res = await peticion('/resetpass', {
                headers: {
                    mail: Mail,
                }
            })
            console.log(res); // Verifica la estructura de la respuesta en la consola
        }
    }

    //UseEffect 
    useEffect(() => {
        setError('')
    }, [Mail])


    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="BeBiker" />
                </div>
                <form onSubmit={resetPass}>
                    <div className="input-group">
                        <input type='email'
                            placeholder='Correo electrónico'
                            ref={rMail}
                            value={Mail}
                            onChange={() => setMail(rMail.current.value)} />
                    </div>
                    <div className="input-group">
                        <button type="submit" className="btnLogin">Reestablecer contraseña</button>
                        <div className='error'>
                            <p className='error1'>{Error}</p>
                        </div>
                    </div>
                </form>
                <div className="registro">
                    Contraseña recordada
                    <Link to={{ pathname: '/login' }} className='link'>
                        Entra
                    </Link>
                </div>
            </div>
        </div>
    )
}
