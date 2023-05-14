import React, { useContext, useEffect, useRef, useState } from 'react'

//CONTEXTO
import ConexContext from "../context/ConexContext"

const Login = () => {
    const [mail, setMail] = useState("")
    const [psw, setPsw] = useState("")
    const [error, setError] = useState("")

    //REFs
    const rMail = useRef()
    const rPsw = useRef()

    //Contexto que manejara las peticiones a la BD
    const peticion = useContext(ConexContext)

    //UseEffect 
    useEffect(() => {
        setError('')
    }, [mail, psw])

    //Función que maneja el login del usuario
    async function login(event) {
        event.preventDefault()
        //Expresion que comprueba que sea un mail válido
        const regMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (mail === '' || !regMail.test(mail)) {
            setError("Introduce un correo electrónico válido")
        } else {
            let res = await peticion('/login', {
                headers: {
                    mail: mail,
                    psw: psw
                }
            })
            if (!res.res.auth)
                setError("Las claves de acceso son incorrectas")
        }
    }


    return (
        <div>
            <form onSubmit={login}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    ref={rMail}
                    value={mail}
                    onChange={() => setMail(rMail.current.value)} />
            </form>
        </div>

    )
}


export default Login