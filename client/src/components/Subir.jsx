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


import { MapContainer, TileLayer, Marker, Popup, Polyline, LatLngBounds } from 'react-leaflet'


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

        const formData = new FormData();
        formData.append("descripcion", rDescripcion.current.value);
        formData.append("foto", rFoto.current.files[0]);
        formData.append("idUsuario", perfil_id);

        const pet = await peticion("/publicaciones/ins", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        if (pet) {
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

    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [startLatitude, setStartLatitude] = useState('');
    const [startLongitude, setStartLongitude] = useState('');
    const [endLatitude, setEndLatitude] = useState('');
    const [endLongitude, setEndLongitude] = useState('');

    // Manejar el evento de obtener coordenadas
    async function handleGetCoordinates() {
        try {
            const responseStart = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${startLocation}&format=json&limit=1`
            );
            const responseEnd = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${endLocation}&format=json&limit=1`
            );
            const dataStart = await responseStart.json();
            const dataEnd = await responseEnd.json();

            if (dataStart.length > 0 && dataEnd.length > 0) {
                const startLat = dataStart[0].lat;
                const startLon = dataStart[0].lon;
                const endLat = dataEnd[0].lat;
                const endLon = dataEnd[0].lon;

                setStartLatitude(startLat);
                setStartLongitude(startLon);
                setEndLatitude(endLat);
                setEndLongitude(endLon);
            } else {
                // No se encontraron resultados para uno o ambos lugares ingresados
                console.log('No se encontraron coordenadas para uno o ambos lugares ingresados.');
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
                                <input type="text" value={startLocation} onChange={event => setStartLocation(event.target.value)} />
                                <input type="text" value={endLocation} onChange={event => setEndLocation(event.target.value)} />
                                <button onClick={handleGetCoordinates}>Obtener Coordenadas</button>
                            </div>

                      
                                {startLatitude && startLongitude && endLatitude && endLongitude && (
                                    <MapContainer>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Polyline positions={[[startLatitude, startLongitude], [endLatitude, endLongitude]]} />
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