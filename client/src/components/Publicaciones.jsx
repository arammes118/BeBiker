// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Importación Contexto
import ConexContext from '../context/ConexContext'

// CSS
import '../assets/css/publicaciones.css'
import '../assets/css/post.css'

// Logo
import logo from '../assets/img/BeBiker.png'
import chema from '../assets/img/chema.jpg'
import fer from '../assets/img/fer.jpg'
import r1 from '../assets/img/r1.jpg'

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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box } from '@mui/material'
import { Header } from './comun/Header'

export const Publicaciones = () => {
    const { peticion } = useContext(ConexContext) // Contexto
    const { idReg } = useParams()
    const [active, setActive] = useState(false)

    // Estados
    const [List, setList] = useState([]) //listado de publicaciones


    const handleClick = () => {
        setActive(!active);
    };

    // UseEffects
    useEffect(() => {
        async function listar() {
            const pet = await peticion("/publicaciones")
            setList(pet)
            console.log(pet)
        }

        listar()
    }, [peticion])

    return (
        <>
            <Header />
            <div style={{ width: '100%' }}>
                {List.map((elem) => (
                    <Card key={elem.idPublicacion} style={{ width: '100%', marginBottom: '20px' }}>
                        <CardHeader
                            avatar={
                                <Avatar src={logo} />
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <ShareIcon />
                                </IconButton>
                            }
                            title={<span style={{ fontWeight: 'bold' }}>{elem.usuario}</span>}
                        />
                        <CardMedia
                            component="img"
                            width="100%"
                            height="100%"
                            objectFit= 'contain'
                            image={fer}
                        />
                        <CardActions disableSpacing>
                            <IconButton
                                aria-label="Me gusta"
                                onClick={handleClick}
                                className={active ? 'active' : ''}
                            >
                                <FavoriteIcon className={active ? 'activeIcon' : ''} />
                            </IconButton>
                            <IconButton aria-label="fav">
                                <BookmarkIcon />
                            </IconButton>
                        </CardActions>

                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Typography variant="subtitle1" component="span" fontWeight="bold" marginRight={1}>
                                    {elem.usuario}
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
