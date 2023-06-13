import React, { useContext, useEffect, useRef, useState } from 'react'

//Libreria especifica para fechas
import moment from 'moment';

//CSS
import '../assets/css/styles.css'

//IMG
import logo from '../assets/img/BeBiker.png'

//CONTEXTO
import ConexContext from "../context/ConexContext"
import { Link, useNavigate } from 'react-router-dom'

const Registro = () => {
    // ESTADOS
    const [ErrMail, setErrorMail] = useState('') //Cualquier error en el mail
    const [ErrPsw, setErrorPsw] = useState('') //Cualquier error en la psw
    const [ErrNombre, setErrorNombre] = useState('') //Cualquier error en el nombre
    const [ErrApellido, setErrorApellido] = useState('') //Cualquier error en el apellido
    const [ErrUsuario, setErrorUsuario] = useState('') //Cualquier error en el usuario
    const [ErrFechaNac, setErrorFechaNac] = useState('') //Cualquier error en la fecha
    const [Imagen, setImagen] = useState(null) // Imagen del perfil del usuario

    //REFs
    const rId = useRef()
    const rMail = useRef()
    const rPsw = useRef()
    const rUsuario = useRef()
    const rNombre = useRef()
    const rApellido = useRef()
    const rFechaNac = useRef()
    const rFoto = useRef()

    //Contexto que manejara las peticiones a la BD
    const { peticion } = useContext(ConexContext)

    const navigate = useNavigate()

    // Handle para seleccionar la foto que inserta el usuario
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        console.log(selectedImage)
        setImagen(selectedImage)

        if (selectedImage) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64Image = e.target.result
                setImagen(base64Image)
            }
            reader.readAsDataURL(selectedImage)
        } else {
            setImagen('')
        }
    }

    // Funcion que registra un usuario
    async function registrar(event) {
        event.preventDefault()
        //expresiones regulares
        const expMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const regPsw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const fechaLimite = moment("1900-01-01"); // fecha límite
        const edadMinima = moment().subtract(16, 'years') //Valida que el usuario tenga 16 años o más

        if (rMail.current.value === '' || !expMail.test(rMail.current.value))
            setErrorMail('Introduce un correo electrónico válido')
        else if (rPsw.current.value === '')
            setErrorPsw('Introduce una contraseña')
        else if (!regPsw.test(rPsw.current.value))
            setErrorPsw("La contraseña debe contener al menos 6 caracteres, incluyendo letras y números")
        else if (rUsuario.current.value === '')
            setErrorUsuario('Introduce un nombre de usuario')
        else if (rNombre.current.value === '')
            setErrorNombre('Introduce un nombre')
        else if (rApellido.current.value === '')
            setErrorNombre('Introduce un apellido')
        else if (rFechaNac.current.value === '' || !moment(rFechaNac.current.value).isBefore(moment()) || !moment(rFechaNac.current.value).isAfter(fechaLimite))
            setErrorFechaNac('Introduce una fecha de nacimiento válida')
        else if (!moment(rFechaNac.current.value).isBefore(edadMinima))
            setErrorFechaNac('Debes ser mayor a 16 años')
        else {
            let pet
            // Comprobamos que no haya un usuario con ese mail
            pet = await peticion(`/registro/rep_mail?mail=${rMail.current.value}`)
            if (!pet.res) {
                setErrorMail("Ese correo electrónico ya está registrado") // En caso de haberlo, muestra error
            } else {
                // Comprobamos que no haya un usuario con ese nombre de usuario
                pet = await peticion(`/registro/rep_usuario?usuario=${rUsuario.current.value}`)
                if (!pet.res) {
                    setErrorUsuario("Ese nombre de usuario ya está registrado") // En caso de haberlo, muestra error
                } else {
                    // Si no hay ningún error anterior, registra al usuario
                    pet = await peticion('/registro', {
                        method: 'POST',
                        json: {
                            mail: rMail.current.value,
                            usuario: rUsuario.current.value,
                            nombre: rNombre.current.value.charAt(0).toUpperCase() + rNombre.current.value.slice(1),
                            apellido: rApellido.current.value.charAt(0).toUpperCase() + rApellido.current.value.slice(1),
                            fecha: rFechaNac.current.value,
                            psw: rPsw.current.value,
                            foto: Imagen,
                        }
                    })
                    console.log(pet)
                    navigate("/")
                }
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
                        <input type='text'
                            placeholder='Apellido'
                            ref={rApellido}
                            onChange={() => setErrorApellido('')} />
                        <p className='error'>{ErrApellido}</p>
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
                    <div className='input-group'>
                        <label htmlFor="image">Foto de perfil</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpg"
                            required
                            onChange={handleImageChange}
                            ref={rFoto} />
                    </div>
                    <div className="input-group">
                        <button type="submit" className="btnLogin">Registrarse</button>
                    </div>
                </form>
                <div className="registro">
                    ¿Tienes una cuenta?
                    <Link to={{ pathname: '/login' }} className='link'>
                        Entra
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Registro