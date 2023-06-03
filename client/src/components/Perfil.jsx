// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'

// CARD POST MATERIAL UI
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Menu, MenuItem } from '@mui/material'
import { Header } from './comun/Header'

//CSS
import '../assets/css/perfil.css'

//IMGs
import logo from '../assets/img/BeBiker.png'
import chema from '../assets/img/chema.jpg'

// Contexto
import ConexContext from '../context/ConexContext'

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
    const [List, setList] = useState([]) // Estado para almacenar un array de publicaciones del usuario
    const [PostSelect, setPostSelect] = useState(null) // Estado que almacena el post que se ha seleccionado

    const [anchorEl, setAnchorEl] = useState(null) //Menú desplegable de opciones de publicacion

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
        if (pet.mensaje === 'OK') {
            // La publicación se eliminó correctamente
            // Realiza las acciones necesarias, como actualizar la lista de publicaciones
            console.log('Publicación elim inada');
            // Actualiza la lista de publicaciones
            setList(prevList => prevList.filter(elem => elem.idPublicacion !== id));
        } else {
            // Hubo un error al eliminar la publicación
            console.log('Error al eliminar la publicación');
        }
        setPostSelect(id)
        console.log(id)
        console.log(pet)
    }

    //UseEffect que muestra el perfil del usuario
    useEffect(() => {
        setNPost('0') // Asignamos el valor predeterminado de posts a 0
        setNRutas('0') // Asignamos el valor predeterminado de rutas a 0
        setNSeguidores('0') // Asignamos el valor predeterminado de seguidores a 0
        setNSeguidos('0') // Asignamos el valor predeterminado de seguidos a 0
        // setNSeguidores('0') // Asignamos el valor de seguidores a 0 en caso de no tener seguidores
        // setNSeguidos('0') // Asignamos el valor de seguidos a 0 en caso de no tener seguidos
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
            setApellido(pet.apellido)
            setNombreComp(Nombre + ' ' + Apellido)
            if ((pet.nPost) > 0)
                setNPost(pet.nPost)
        }
        ver()
    }, [Apellido, Nombre, perfil_id, peticion])

    //UseEffect que muestra las publicaciones de ese usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/publicaciones/ver?id=' + perfil_id)
            setList(pet)
            console.log(pet)
        }
        ver()
    }, [PostSelect, perfil_id, peticion])

    return (
        <>
            <div className='card'>
                <div className='lines'></div>
                <div className='imgBx'>
                    <img src={chema} alt={'Perfil de ' + Usuario} />
                </div>
                <div className='content'>
                    <div className='details'>
                        <h2>{Usuario}<br /><span>{NombreComp}</span></h2>
                        <div className='actionBtn'>
                            <button className='btn'>Seguir</button>
                        </div>
                        <div className='data'>
                            <h3>{NPost}<br /><span>Publicaciones</span></h3>
                            <h3>{NSeguidores}<br /><span>Seguidores</span></h3>
                            <h3>{NSeguidos}<br /><span>Siguiendo</span></h3>
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
                                    <Avatar src={logo} />
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
                                objectFit='contain'
                                image={logo}
                            />
                            <CardActions disableSpacing>
                                <IconButton
                                    aria-label="Me gusta"
                                    className='active'
                                >
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )

}
