// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'

// CARD POST MATERIAL UI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Menu, MenuItem } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'

//CSS
import '../assets/css/perfil.css'

// Contexto
import ConexContext from '../context/ConexContext'
import { Link } from 'react-router-dom'

export const Perfil = () => {
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto
    const [Usuario, setUsuario] = useState('') // Estado para almacenar el usuario del usuario
    const [Nombre, setNombre] = useState('') // Estado para almacenar el nombre del usuario
    const [Apellido, setApellido] = useState('') // Estado para almacenar el apellido del usuario
    const [NombreComp, setNombreComp] = useState('') // Estado para almacenar el nombre completo del usuario
    const [NPost, setNPost] = useState('') // Estado para almacenar la cantidad de post del usuario
    const [NRutas, setNRutas] = useState('') // Estado para almacenar la cantidad de rutas del usuario
    const [NSeguidores, setNSeguidores] = useState('') // Estado para almacenar la cantidad de seguidores del usuario
    const [NSeguidos, setNSeguidos] = useState('') // Estado para almacenar la cantidad de seguidos del usuario
    const [Imagen, setImagen] = useState(null) // Estado que almacena la imagen del usuario
    const [List, setList] = useState([]) // Estado para almacenar un array de publicaciones del usuario

    const [anchorEl, setAnchorEl] = useState(null) //Menú desplegable de opciones de publicacion

    // Controla el menu desplegable de la foto
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    // Función para borrar una publicación
    const borrar = async (id) => {
        const pet = await peticion('/publicaciones/del', {
            method: 'POST',
            json: {
                id: id
            }
        })
        console.log(pet)
        window.location.reload() // Recargamos la página
    }

    //UseEffect que muestra el perfil del usuario
    useEffect(() => {
        setNPost('0') // Asignamos el valor predeterminado de posts a 0
        setNRutas('0') // Asignamos el valor predeterminado de rutas a 0
        setNSeguidores('0') // Asignamos el valor predeterminado de seguidores a 0
        setNSeguidos('0') // Asignamos el valor predeterminado de seguidos a 0
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
            setApellido(pet.apellido)
            setNombreComp(Nombre + ' ' + Apellido)
            setNPost(pet.nPost)
            setNRutas(pet.nRutas)
            setNSeguidos(pet.nSeguidos)
            setNSeguidores(pet.nSeguidores)

            // Obtener la foto de perfil y convertirla en objeto de imagen
            const fotoPerfil = handleBase64Image(pet.foto)
            setImagen(fotoPerfil)
            console.log(pet)
        }

        ver()
    }, [Apellido, Nombre, perfil_id, peticion])

    const handleBase64Image = (base64Image) => {
        const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
        return "data:image/jpeg;base64," + trimmedBase64Image
    }

    //UseEffect que muestra las publicaciones de ese usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/publicaciones/ver?id=' + perfil_id);
            const listaActualizada = await Promise.all(pet.map(async (publicacion) => {
                const imageObject = handleBase64Image(publicacion.foto) // Convertimos la imagen en base64 a un objeto de imagen
                console.log(imageObject)
                return {
                    ...publicacion,
                    foto: imageObject // Obtener la URL de la imagen y asignarla a la propiedad 'foto'
                }
            }))
            setList(listaActualizada)
        }

        ver()
    }, [perfil_id, peticion])

    return (
        <>
            <div className='card'>
                <div className='lines'></div>
                <div className='imgBx'>
                    <img src={Imagen} alt={'Perfil de ' + Usuario} />
                </div>
                <div className='content'>
                    <div className='details'>
                        <h2>{Usuario}<br /><span>{NombreComp}</span></h2>
                        <div className='data'>
                            <h3>{NPost}<br /><span>Publicaciones</span></h3>
                            <Link to={'/perfil/seguidores'}><h3>{NSeguidores}<br /><span>Seguidores</span></h3></Link>
                            <Link to={'/perfil/seguidos'}><h3>{NSeguidos}<br /><span>Siguiendo</span></h3></Link>
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
                                    <Avatar src={Imagen} />
                                }
                                action={
                                    <div>
                                        <IconButton aria-label="settings" onClick={handleClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={() => borrar(elem.idPublicacion)}>Eliminar publicación</MenuItem>
                                        </Menu>
                                    </div>

                                }
                                title={<span style={{ fontWeight: 'bold' }}>{Usuario}</span>}
                            />
                            <CardMedia
                                component="img"
                                width="100%"
                                height="100%"
                                src={elem.foto}
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
                                        {Usuario}
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
