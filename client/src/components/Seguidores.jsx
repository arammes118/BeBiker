import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConexContext from '../context/ConexContext'

export const Seguidores = () => {
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto
    
    // Estados
    const [List, setList] = useState([]) // Estado que almacena la lista de seguidos

    const handleBase64Image = (base64Image) => {
        const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
        return "data:image/jpeg;base64," + trimmedBase64Image
    }

    //UseEffect que muestra los seguidos de ese usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/seguidores/ver?id=' + perfil_id)
            if (Array.isArray(pet)) {
                const listaActualizada = await Promise.all(pet.map(async (seguidor) => {
                    const imageObject = handleBase64Image(seguidor.foto)
                    return {
                        ...seguidor,
                        foto: imageObject
                    }
                }))
                setList(listaActualizada)
                console.log(pet)
            }
        }

        ver()
    }, [perfil_id, peticion, setList])

    return (
        <>
            <div className='actionBtn'>
                <Link to={`/perfil`}>
                    <button className='btnRutas'>Volver al perfil</button>
                </Link>
            </div>
            <div className="comment-section">
                {List.map((elem) => (
                    <div key={elem.idUsuario} className="comment">
                        <div className="avatar">
                            <img src={elem.foto} alt="Avatar" />
                        </div>
                        <div className="content">
                            <div className="user-info">
                                <Link to={`/perfil/${elem.usuario}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <span className="username">{elem.usuario}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
