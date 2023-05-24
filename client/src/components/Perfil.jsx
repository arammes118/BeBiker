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
import { Box } from '@mui/material'
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
    const [NPost, setNPost] = useState('') // Estado para almacenar la cantidad de post del usuario
    //const [NSeguidores, setNSeguidores] = useState('') // Estado para almacenar la cantidad de seguidores del usuario
    //const [NSeguidos, setNSeguidos] = useState('') // Estado para almacenar la cantidad de seguidos del usuario
    const [List, setList] = useState([]) // Estado para almacenar un array de publicaciones del usuario

    //UseEffect que muestra el perfil del usuario
    useEffect(() => {
        setNPost('0') // Asignamos el valor de posts a 0 en caso de no haber posts
        // setNSeguidores('0') // Asignamos el valor de seguidores a 0 en caso de no tener seguidores
        // setNSeguidos('0') // Asignamos el valor de seguidos a 0 en caso de no tener seguidos
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
            if ((pet.nPost) > 0)
                setNPost(pet.nPost)
        }
        ver()
    }, [])

    //UseEffect que muestra las publicaciones de ese usuario
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/publicaciones/ver?id=' + perfil_id)
            setList(pet)
            console.log(pet)
        }
        ver()
    }, [])

    return (
        <>
            <div className='card'>
                <div className='lines'></div>
                <div className='imgBx'>
                    <img src={chema} alt={'Perfil de ' + Usuario} />
                </div>
                <div className='content'>
                    <div className='details'>
                        <h2>{Usuario}<br /><span>{Nombre}</span></h2>
                        <div className='actionBtn'>
                            <button className='btn'>Seguir</button>
                        </div>
                        <div className='data'>
                            <h3>{NPost}<br /><span>Publicaciones</span></h3>
                            <h3>120k<br /><span>Seguidores</span></h3>
                            <h3>342<br /><span>Siguiendo</span></h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <h2>Publicaciones recientes</h2>
                {List.map((elem) => (
                    <Card className='cardPost'>
                        <CardHeader
                            avatar={
                                <Avatar src={logo} />
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={<span style={{ fontWeight: 'bold' }}>{Usuario}</span>}
                        />
                        <CardMedia
                            component="img"
                            height="200"
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
        </>
    )

}
