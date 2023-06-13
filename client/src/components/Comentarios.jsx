import React, { useContext, useEffect, useRef, useState } from 'react'
import ConexContext from '../context/ConexContext'
import { Link, useParams } from 'react-router-dom'

export const Comentarios = () => {
    const { peticion, perfil_id } = useContext(ConexContext)
    const { idPost } = useParams()

    // ESTADOS
    const [Error, setError] = useState('') // Cualquier error en la subida del comentario
    const [List, setList] = useState([]) // Listado de comentarios

    //REFs
    const rComentario = useRef()

    // Funcion Guardar VALORACION
    async function guardarComment(event) {
        event.preventDefault()

        if (rComentario.current.value === '') {
            setError('Debes añadir un comentario')
        } else {
            const pet = await peticion(`/comentarios/ins`, {
                method: "POST",
                json: {
                    comentario: rComentario.current.value,
                    idUsuario: perfil_id,
                    idPost: idPost
                }
            })
            console.log(pet)

            if (!pet) {
                setError("ERROR al publicar el comentario")
            } else {
                setError("Comentario añadido con éxito")
                window.location.reload()
            }
        }
    }

    const handleBase64Image = (base64Image) => {
        const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
        return "data:image/jpeg;base64," + trimmedBase64Image
    }

    // UseEffects
    useEffect(() => {
        async function verComments() {
            const pet = await peticion("/comentarios/ver?id=" + idPost)

            if (Array.isArray(pet)) {
                const listaActualizada = await Promise.all(pet.map(async (comentario) => {
                    const imageObject = handleBase64Image(comentario.foto)
                    return {
                        ...comentario,
                        foto: imageObject
                    }
                }))
                setList(listaActualizada)
                console.log(pet)
            }
        }

        verComments()
    }, [idPost, peticion])

    return (
        <>
            <div className="comment-section">
                {List.map((elem) => (
                    <div key={elem.idComentario} className="comment">
                        <div className="avatar">
                            <img src={elem.foto} alt="Avatar" />
                        </div>
                        <div className="content">
                            <div className="user-info">
                                <Link to={`/perfil/${elem.usuario}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <span className="username">{elem.usuario}</span>
                                </Link>
                            </div>
                            <div className="comment-text">{elem.comentario}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='addComment'>
                <form onSubmit={guardarComment}>
                    <textarea
                        id="comentario"
                        name="comentario"
                        placeholder='Añadir comentario...'
                        rows="3"
                        ref={rComentario}
                    />

                    <button className='btnSubir' type="submit">Añadir comentario</button>
                    <div className='error'>
                        <p className='error1'>{Error}</p>
                    </div>
                </form>
            </div>
        </>
    )
}
