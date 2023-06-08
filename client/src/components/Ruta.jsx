import React, { useContext, useEffect, useRef, useState } from 'react'
import ConexContext from '../context/ConexContext'
import { Link, useParams } from 'react-router-dom'

export const Ruta = () => {
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto
    const { tituloRuta, userId } = useParams() // Cogemos el titulo y el perfil del usuario de los parametros

    const [Titulo, setTitulo] = useState('') // Estado para almacenar el Titulo de la ruta
    const [Descripcion, setDescripcion] = useState('') // Estado para almacenar la descripcion de la ruta
    const [PuntoInicio, setPuntoInicio] = useState('') // Estado para almacenar el punto de inicio de la ruta
    const [PuntoFin, setPuntoFin] = useState('') // Estado para almacenar el punto de destino de la ruta
    const [Error, setError] = useState('') //Cualquier error en la subida del post

    //REFs
    const rComentario = useRef()
    const rPuntuacion = useRef()

    //UseEffect que muestra la informacion del perfil del usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion(`/ruta/${tituloRuta}/${userId}`)
            setTitulo(pet.titulo)
            setDescripcion(pet.descripcion)
            setPuntoInicio(pet.puntoInicio)
            setPuntoFin(pet.puntoFin)
            console.log(pet)
        }

        ver()
    }, [userId, peticion, tituloRuta])

    // Funcion Guardar VALORACION
    async function guardarValoracion(event) {
        event.preventDefault()

        const pet = await peticion(`/ruta/insval`, {
            method: "POST",
            json: {
                comentario: rComentario.current.value,
                userId: userId,
                idUsuario: perfil_id,
                ruta: Titulo
            }
        })
        console.log(pet)

        if (pet) {
            setError("ERROR al publicar el comentario")
        } else {
            setError("Comentario añadido con éxito")
        }
    }


    return (
        <>
            <div className='actionBtn'>
                <Link to={`/rutas`}>
                    <button className='btnRutas'>Volver a rutas</button>
                </Link>
            </div>
            <div className="form-group">
                <label htmlFor="titulo">Título de la ruta:</label>
                <input
                    type="text"
                    id="titulo"
                    value={Titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    readOnly
                />
                <label htmlFor="descripcion">Descripción de la ruta:</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    value={Descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    readOnly
                />
                <label htmlFor="puntoInicio">Punto de Inicio de la ruta:</label>
                <input
                    type="text"
                    id="puntoInicio"
                    value={PuntoInicio}
                    onChange={(e) => setPuntoInicio(e.target.value)}
                    readOnly
                />
                <label htmlFor="puntoFin">Destino de la ruta:</label>
                <input
                    type="text"
                    id="puntoFin"
                    value={PuntoFin}
                    onChange={(e) => setPuntoFin(e.target.value)}
                    readOnly
                />
                <form onSubmit={guardarValoracion}>
                    <textarea
                        id="comentario"
                        name="comentario"
                        placeholder='Añadir comentario...'
                        rows="3"
                        ref={rComentario}
                    />

                    <Valoracion ref={rPuntuacion} />
                    <button className='btnSubir' type="submit">Añadir valoración</button>
                    <div className='error'>
                        <p className='error1'>{Error}</p>
                    </div>
                </form>
            </div>
        </>
    )
}

const Valoracion = () => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        console.log(rating)
    }, [rating])

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating)
    }

    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= rating ? "star selected" : "star"}
                    onClick={() => handleStarClick(star)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};