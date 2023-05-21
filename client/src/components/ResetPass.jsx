import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

//CSS
import '../assets/css/styles.css'

//IMG
import logo from '../assets/img/BeBiker.png'

export const ResetPass = () => {
    const [Mail, setMail] = useState("")
    const [Error, setError] = useState("")

    //REFs
    const rMail = useRef()

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
                <form>
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
