import React, { useContext, useRef, useState } from 'react';

// Contexto
import ConexContext from "../context/ConexContext"

// IMG
import logo from '../assets/img/BeBiker.png'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// CSS
import '../assets/css/styles.css'

const Subir = () => {
    //Contexto
    const { peticion, perfil_id } = useContext(ConexContext)
    const [image, setImage] = useState(null);
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

        const imgBlob = await convertImgToBlob(image);

        const pet = await peticion('/publicaciones/ins', {
            method: 'POST',
            json: {
                descripcion: rDescripcion.current.value,
                foto: imgBlob,
                idUsuario: perfil_id
            }
        })
        console.log(image)
        console.log(imgBlob)
        console.log(pet)
    }

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
            <div className="contenido">
                {mostrarFormPost ? (
                    <div>
                        <form onSubmit={guardarPost} encType="multipart/form-data">
                            <div>
                                <input
                                    type='text'
                                    placeholder='Descripcion'
                                    ref={rDescripcion}
                                />
                            </div>

                            <div>
                                <label htmlFor="image">Selecciona una imagen:</label>
                                <input
                                    type="file"
                                    name="foto"
                                    onChange={handleImageChange}
                                    ref={rFoto}
                                    accept="image/*"
                                    required
                                />
                            </div>

                            <div>
                                <button type="submit">Subir foto</button>
                            </div>
                        </form>

                        <h2>Previsualización</h2>
                        {previewImage && (
                            <div>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                />
                            </div>
                        )}
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