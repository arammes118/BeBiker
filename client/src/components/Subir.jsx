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
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ShareIcon from '@mui/icons-material/Share'
import { Box } from '@mui/material'

//CSS
import '../assets/css/perfil.css'

//IMGs
import chema from '../assets/img/chema.jpg'


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


// CSS
import '../assets/css/styles.css'

const Subir = () => {
    //Contexto
    const { peticion, perfil_id } = useContext(ConexContext)
    const [image, setImage] = useState(null);

    const [ErrSubida, setErrorSubida] = useState('') //Cualquier error en la subida del post
    const [OkSubida, setOkSubida] = useState('') // Subida del post OK
    const [Usuario, setUsuario] = useState('') // Usuario
    const [previewImage, setPreviewImage] = useState('')
    const [mostrarFormPost, setMostrarFormPost] = useState(true);

    const handleBoton1Click = () => {
        setMostrarFormPost(true);
    };

    const handleBoton2Click = () => {
        setMostrarFormPost(false);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setImage(selectedImage)

        if (selectedImage) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target.result)
            };
            reader.readAsDataURL(selectedImage)
        } else {
            setPreviewImage('')
        }
    };

    //REFs
    const rId = useRef()
    const rDescripcion = useRef()
    const rFoto = useRef()

    const rTitulo = useRef()

    async function convertImgToBlob(img) {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return blob;
    }

    // Funcion Guardar publicacion
    async function guardarPost(event) {
        event.preventDefault()

        //const imgBlob = await convertImgToBlob(image);

        const pet = await peticion('/publicaciones/ins', {
            method: 'POST',
            json: {
                descripcion: rDescripcion.current.value,
                //foto: imgBlob,
                idUsuario: perfil_id
            }

        })
        if (pet.res) {
            setErrorSubida("ERROR al subir la publicación")
        } else {
            setOkSubida("Publicación añadida con éxito")
        }
        //console.log(image)
        //console.log(imgBlob)
        console.log(pet)
    }

    useEffect(() => {
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            setUsuario(pet.usuario)
        }
        ver()
    })


    // Funcion Guardar Ruta
    async function guardarRuta(event) {
        event.preventDefault()

        const pet = await peticion('/rutas/ins', {
            method: 'POST',
            json: {
                titulo: rTitulo.current.value,
                descripcion: rDescripcion.current.value,
                idUsuario: perfil_id
            }
        })
        console.log(pet)
    }

    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // Manejar el evento de obtener coordenadas
    async function handleGetCoordinates() {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                setLatitude(lat);
                setLongitude(lon);
            } else {
                // No se encontraron resultados para el lugar ingresado
                console.log('No se encontraron coordenadas para el lugar ingresado.');
            }
        } catch (error) {
            console.error('Error al obtener coordenadas:', error);
        }
    }


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
                                    accept="image/*"
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
                            <button className='btnSubir' type="submit">Subir</button>
                            <div className={ErrSubida ? 'error' : OkSubida ? 'success' : ''}>
                                {ErrSubida && <p className='error1'>{ErrSubida}</p>}
                                {OkSubida && <p className='success1'>{OkSubida}</p>}
                            </div>

                            {previewImage && rDescripcion.current.value && (
                                <>
                                    <h2>Previsualización</h2>
                                    <Card style={{ width: '400px' }}>
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
                        </form>
                    </div>
                ) : (
                    <form onSubmit={guardarRuta}>
                        <div>
                            <input
                                type='text'
                                placeholder='Titulo'
                                ref={rTitulo}
                            />
                            <input
                                type='text'
                                placeholder='Descripcion'
                                ref={rDescripcion}
                            />
                        </div>

                        <div>
                            <h2>Geocodificación Inversa</h2>

                            <div className='map-container'>
                                <input
                                    type="text"
                                    placeholder="Lugar"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                                <button onClick={handleGetCoordinates}>Obtener Coordenadas</button>
                            </div>

                            {latitude && longitude && (
                                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '400px' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[latitude, longitude]}>
                                        <Popup>{location}</Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div >

    )
}

export default Subir