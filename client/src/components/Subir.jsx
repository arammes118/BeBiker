import React, { useContext, useRef, useState } from 'react';

//Contexto
import ConexContext from "../context/ConexContext"

//IMG
import logo from '../assets/img/BeBiker.png'
import { Header } from './comun/Header';

const Subir = () => {
    //Contexto
    const { peticion, perfil_id } = useContext(ConexContext)
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('')

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

    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="BeBiker" />
                </div>
                <form onSubmit={guardarPost} encType="multipart/form-data">
                    <div>
                        <input type='text'
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
        </div>
    )
}

export default Subir