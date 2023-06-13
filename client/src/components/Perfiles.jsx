import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// CARD POST MATERIAL UI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box } from '@mui/material'

// Contexto
import ConexContext from '../context/ConexContext'

export const Perfiles = () => {
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto
    const { userId } = useParams() // Cogemos el perfil del usuario de los parametros

    const [Id, setId] = useState('') // Estado para almacernar el id del usuario
    const [Nombre, setNombre] = useState('') // Estado para almacenar el nombre del usuario
    const [Apellido, setApellido] = useState('') // Estado para almacenar el apellido del usuario
    const [NombreComp, setNombreComp] = useState('') // Estado para almacenar el nombre completo del usuario
    const [NPost, setNPost] = useState('') // Estado para almacenar la cantidad de post del usuario
    const [NRutas, setNRutas] = useState('') // Estado para almacenar la cantidad de rutas del usuario
    const [List, setList] = useState([]) // Estado para almacenar un array de publicaciones del usuario
    const [siguiendo, setSiguiendo] = useState(false) // Estado que almacena si ya estas siguiendo a ese usuario
    const [FotoPerfil, setFotoPerfil] = useState(null) // Estado que almacena la foto de perfil del usuario

    const handleBase64Image = (base64Image) => {
        const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
        return "data:image/jpeg;base64," + trimmedBase64Image
    }

    //UseEffect que muestra la informacion del perfil del usuario
    useEffect(() => {
        setNPost('0') // Asignamos el valor predeterminado de posts a 0
        setNRutas('0') // Asignamos el valor predeterminado de rutas a 0
        async function ver() {
            const pet = await peticion(`/perfil/${userId}`)
            console.log(pet)
            setId(pet.idUsuario)
            setNombre(pet.nombre)
            setApellido(pet.apellido)
            setNombreComp(Nombre + ' ' + Apellido)
            setNPost(pet.nPost)
            setNRutas(pet.nRutas)

            // Obtener la foto de perfil y convertirla en objeto de imagen
            const fotoPerfil = handleBase64Image(pet.foto)
            setFotoPerfil(fotoPerfil)
            console.log(pet)
        }

        ver()
    }, [Apellido, Nombre, userId, peticion])

    //UseEffect que muestra las publicaciones de ese usuario
    useEffect(() => {
        async function verPosts() {
            const pet = await peticion('/publicaciones/ver?id=' + Id)
            if (Array.isArray(pet)) {
                const listaActualizada = await Promise.all(pet.map(async (publicacion) => {
                    const imageObject = handleBase64Image(publicacion.foto)
                    return {
                        ...publicacion,
                        foto: imageObject
                    }
                }))
                setList(listaActualizada)
                console.log(pet)
            }
        }

        verPosts()
    }, [Id, peticion])

    // Función que nos permite seguir cuentas
    async function seguir(event) {
        event.preventDefault()

        const pet = await peticion(`/seguir`, {
            method: "POST",
            json: {
                cfCuenta1: perfil_id,
                cfCuenta2: userId
            }
        })
        setSiguiendo(!siguiendo); // Invertir el valor actual de siguiendo

        console.log(pet)
    }

    // En el useEffect, consultar el estado siguiendo del usuario cuando se inicie la sesión
    useEffect(() => {
        async function obtenerSeguidos() {
            const pet = await peticion(`/seguido?cfCuenta1=${perfil_id}&cfCuenta2=${userId}`)
            setSiguiendo(pet.siguiendo)
            console.log(pet.siguiendo)
        }

        obtenerSeguidos()
    }, [perfil_id, peticion, userId])

    return (
        <>
            <div className='card'>
                <div className='lines'></div>
                <div className='imgBx'>
                    <img src={FotoPerfil} alt={'Perfil de ' + userId} />
                </div>
                <div className='content'>
                    <div className='details'>
                        <h2>{userId}<br /><span>{NombreComp}</span></h2>
                        <div className='actionBtn'>
                            <button className="btn" onClick={seguir}>
                                {siguiendo ? 'Dejar de seguir' : 'Seguir'}
                            </button>
                        </div>
                        <div className='data'>
                            <h3>{NPost}<br /><span>Publicaciones</span></h3>
                            <h3>{NRutas}<br /><span>Rutas</span></h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <h2>Publicaciones recientes</h2>
                <div style={{ width: '100%' }}>
                    {List.map((elem) => (
                        <Card key={elem.idPublicacion} style={{ width: '100%', marginBottom: '20px' }}>
                            <CardHeader
                                avatar={
                                    <Avatar src={FotoPerfil} />
                                }
                                title={<span style={{ fontWeight: 'bold' }}>{userId}</span>}
                            />
                            <CardMedia
                                component="img"
                                width="100%"
                                height="100%"
                                image={elem.foto}
                            />
                            <CardActions disableSpacing>
                                <IconButton
                                    aria-label="Me gusta"
                                    className='active'
                                >
                                    <FavoriteIcon />
                                </IconButton>
                            </CardActions>

                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="subtitle1" component="span" fontWeight="bold" marginRight={1}>
                                        {userId}
                                    </Typography>
                                    <Typography variant="body1">
                                        {elem.descripcion}
                                    </Typography>
                                </Box>
                                <Link to={`/comentarios/${elem.idPublicacion}`}>
                                    <button className='btnVerVal'>Ver comentarios</button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}