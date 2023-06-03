import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
import fer from '../assets/img/fer.jpg'
import logo from '../assets/img/BeBiker.png'

// Contexto
import ConexContext from '../context/ConexContext'

export const Perfiles = () => {
    const { peticion } = useContext(ConexContext) // Contexto
    const { userId } = useParams() // Cogemos el perfil del usuario de los parametros
    const [Usuario, setUsuario] = useState('') // Estado para almacenar el usuario del usuario
    const [Id, setId] = useState('') // Estado para almacernar el id del usuario
    const [Nombre, setNombre] = useState('') // Estado para almacenar el nombre del usuario
    const [Apellido, setApellido] = useState('') // Estado para almacenar el apellido del usuario
    const [NombreComp, setNombreComp] = useState('') // Estado para almacenar el nombre completo del usuario
    const [NPost, setNPost] = useState('') // Estado para almacenar la cantidad de post del usuario
    const [NRutas, setNRutas] = useState('') // Estado para almacenar la cantidad de rutas del usuario
    const [NSeguidores, setNSeguidores] = useState('') // Estado para almacenar la cantidad de seguidores del usuario
    const [NSeguidos, setNSeguidos] = useState('') // Estado para almacenar la cantidad de seguidos del usuario
    const [List, setList] = useState([]) // Estado para almacenar un array de publicaciones del usuario

    //UseEffect que muestra la informacion del perfil del usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion(`/perfil/${userId}`)
            setId(pet.idUsuario)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
            setApellido(pet.apellido)
            setNombreComp(Nombre + ' ' + Apellido)
            if ((pet.nPost) > 0)
                setNPost(pet.nPost)
        }
        ver()
    }, [Apellido, Nombre, userId, peticion])

    //UseEffect que muestra las publicaciones de ese usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/publicaciones/ver?id=' + Id)
            setList(pet)
            console.log(pet)
        }
        ver()
    }, [Id, peticion])

    return (
        <>
            <div className='card'>
                <div className='lines'></div>
                <div className='imgBx'>
                    <img src={fer} alt={'Perfil de ' + userId} />
                </div>
                <div className='content'>
                    <div className='details'>
                        <h2>{userId}<br /><span>{NombreComp}</span></h2>
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
                                title={<span style={{ fontWeight: 'bold' }}>{userId}</span>}
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