import React, { useContext, useEffect, useRef, useState } from 'react';

// Contexto
import ConexContext from "../context/ConexContext"

// IMG
import logo from '../assets/img/BeBiker.png'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

//CSS
import '../assets/css/perfil.css'



// CSS
import '../assets/css/styles.css'

const Subir = () => {
    //Contexto
    const { peticion, perfil_id } = useContext(ConexContext)
    const [Imagen, setImagen] = useState(null) // Imagen del post

    const [ErrSubida, setErrorSubida] = useState('') //Cualquier error en la subida del post
    const [OkSubida, setOkSubida] = useState('') // Subida del post OK
    const [Usuario, setUsuario] = useState('') // Usuario
    const [previewImage, setPreviewImage] = useState('')
    const [mostrarFormPost, setMostrarFormPost] = useState(true);

    // Handlers para mostrar distintos formularios
    const handleBoton1Click = () => {
        setMostrarFormPost(true)
    }

    const handleBoton2Click = () => {
        setMostrarFormPost(false)
    }

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
                setPreviewImage(e.target.result)
            }
            reader.readAsDataURL(selectedImage)
        } else {
            setPreviewImage('')
            setImagen('')
        }
    }

    //REFs
    const rDescripcion = useRef()
    const rFoto = useRef()

    // REFs Rutas
    const rTitulo = useRef()
    const rDescripcionR = useRef()
    const rPuntoInicio = useRef()
    const rPuntoFin = useRef()

    // Funcion Guardar publicacion
    async function guardarPost(event) {
        event.preventDefault()

        const pet = await peticion("/publicaciones/ins", {
            method: "POST",
            json: {
                descripcion: rDescripcion.current.value,
                foto: Imagen,
                idUsuario: perfil_id
            }
        })

        if (pet) {
            setErrorSubida("ERROR al subir la publicación")
        } else {
            setOkSubida("Publicación añadida con éxito")
        }
        console.log(pet)
    }

    // Función guardar ruta
    async function guardarRuta(event) {
        event.preventDefault()

        if (rTitulo.current.value === '')
            setErrorSubida('Introduce un título para la ruta')
        else if (rDescripcionR.current.value === '')
            setErrorSubida('Introduce una descripción de la ruta')
        else if (rPuntoInicio.current.value === '')
            setErrorSubida('Introduce el punto de inicio de la ruta')
        else if (rPuntoFin.current.value === '')
            setErrorSubida('Introduce el punto final de la ruta')
        else {
            let pet
            pet = await peticion('/rutas/ins', {
                method: 'POST',
                json: {
                    titulo: rTitulo.current.value.charAt(0).toUpperCase() + rTitulo.current.value.slice(1),
                    descripcion: rDescripcionR.current.value.charAt(0).toUpperCase() + rDescripcionR.current.value.slice(1),
                    puntoInicio: rPuntoInicio.current.value,
                    puntoFin: rPuntoFin.current.value,
                    idUsuario: perfil_id
                }

            })
            if (pet) {
                setErrorSubida("ERROR al subir la publicación")
            } else {
                setOkSubida("Publicación añadida con éxito")
            }
            console.log(pet)
        }
    }

    useEffect(() => {
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            setUsuario(pet.usuario)
        }
        ver()
    })

    return (
        <div className='principal'>
            <div className="logo">
                <img src={logo} alt="BeBiker" />
            </div>
            <div className='actionBtn'>
                <button className='btnSubir' onClick={() => handleBoton1Click()}>Subir Publicación</button>
                <button className='btnSubir' onClick={() => handleBoton2Click()}>Subir Ruta</button>
            </div>
            <div className="contenido2">
                {mostrarFormPost ? (
                    <div className='contenido2'>
                        <form onSubmit={guardarPost} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="image">Seleccionar foto:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/jpg"
                                    required
                                    onChange={handleImageChange}
                                    ref={rFoto} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="caption">Descripción:</label>
                                <textarea
                                    id="caption"
                                    name="caption"
                                    rows="3"
                                    required
                                    ref={rDescripcion}
                                >
                                </textarea>
                            </div>
                            {previewImage && rDescripcion.current.value && (
                                <>
                                    <h2>Previsualización</h2>
                                    <Card style={{ width: '400px', marginBottom: '20px' }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar src={logo} />
                                            }
                                            title={<span style={{ fontWeight: 'bold' }}>{Usuario}</span>}
                                        />
                                        <CardMedia
                                            component="img"
                                            width="100%"
                                            height="100%"
                                            image={previewImage}
                                        />

                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="subtitle1" component="span" fontWeight="bold" marginRight={1}>
                                                    {Usuario}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {rDescripcion.current.value}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                            <div className={ErrSubida ? 'error' : OkSubida ? 'success' : ''}>
                                {ErrSubida && <p className='error1'>{ErrSubida}</p>}
                                {OkSubida && <p className='success1'>{OkSubida}</p>}
                            </div>
                            <button className='btnSubir' type="submit">Subir</button>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={guardarRuta}>
                        <div className="form-group">
                            <label htmlFor="caption">Título de la ruta:</label>
                            <input
                                type='text'
                                ref={rTitulo}
                            />
                            <label htmlFor="caption">Descripción de la ruta:</label>
                            <textarea
                                id="caption"
                                name="caption"
                                rows="3"
                                required
                                ref={rDescripcionR}
                            />
                            <label htmlFor="caption">Punto de Inicio de la ruta:</label>
                            <input
                                type='text'
                                ref={rPuntoInicio}
                            />
                            <label htmlFor="caption">Destino de la ruta:</label>
                            <input
                                type='text'
                                ref={rPuntoFin}
                            />
                        </div>
                        <div className={ErrSubida ? 'error' : OkSubida ? 'success' : ''}>
                            {ErrSubida && <p className='error1'>{ErrSubida}</p>}
                            {OkSubida && <p className='success1'>{OkSubida}</p>}
                        </div>
                        <button className='btnSubir' type="submit">Subir</button>
                    </form>
                )}
            </div>
        </div >

    )
}

export default Subir