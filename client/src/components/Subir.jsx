import React, { useContext, useRef, useState } from 'react';

//Contexto
import ConexContext from "../context/ConexContext"
import { Link } from 'react-router-dom';

//IMG
import logo from '../assets/img/BeBiker.png'

const Subir = (props) => {
    //Contexto
    const { peticion } = useContext(ConexContext)

    //ESTADOS
    const [ErrDescripcion] = useState('')

    //REFs
    const rId = useRef()
    const rDescripcion = useRef()
    const rUsuario = useRef()

    //Guardar registro
    async function guardarPost(event) {
        event.preventDefault()
        let pet = await peticion('/publicaciones/ins', {
            method: 'POST',
            json: {
                descripcion: rDescripcion.current.value,
                idUsuario: props.rUsuario.id
            }
        })
        console.log(pet)
    }

    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="BeBiker" />
                </div>
                <form onSubmit={guardarPost}>
                    <div className="input-group">
                        <input type='text'
                            placeholder='Descripcion'
                            ref={rDescripcion}
                            />
                    </div>
                    <div className="input-group">
                        <button type="submit" className="btnLogin">Guardar</button>
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
/*const [caption, setCaption] = useState('');
const [image, setImage] = useState(null);
const [previewImage, setPreviewImage] = useState('');
const handleCaptionChange = (event) => {
    setCaption(event.target.value);
};

const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

    if (selectedImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(selectedImage);
    } else {
        setPreviewImage('');
    }
};

const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí puedes realizar la lógica para enviar la foto al servidor
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    /*try {
        const response = await fetch('http://tu-servidor-python.com/subir-foto', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            // La foto se envió exitosamente al servidor
            alert('La foto se ha subido correctamente.');
        } else {
            // Ocurrió un error al enviar la foto al servidor
            alert('Error al subir la foto.');
        }
    } catch (error) {
        // Ocurrió un error en la solicitud HTTP
        alert('Error en la solicitud.');
    }
};
    // Puedes acceder al título de la foto y al archivo seleccionado con `caption` y `image` respectivamente

    // Ejemplo de cómo mostrar una alerta con los datos
    alert('Título de la foto: ' + caption);
};

return (
    <div>
        <h1>Formulario de Instagram</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="caption">Título de la foto:</label>
                <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={handleCaptionChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="image">Selecciona una imagen:</label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
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
);
}*/

export default Subir