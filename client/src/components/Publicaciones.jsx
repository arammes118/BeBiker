// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

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
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto
    const [active, setActive] = useState(false)
    const [activePostId, setActivePostId] = useState(null);


    // Estados
    const [List, setList] = useState([]) //listado de publicaciones


    const handleClick = () => {
        setActive(!active)
    }

    const handleClickMG = (postId) => {
        setActivePostId(postId);
    };

    // UseEffects
    useEffect(() => {
        async function listar() {
            const pet = await peticion("/publicaciones") // Peticion de publicaciones
            /* Filtramos los post obtenidos para devolver los posts que no son del mismo usuario
            que inicia sesión */
            const filtroPosts = pet.filter(publicacion => {
                return publicacion.cfUsuario !== perfil_id;
            });
            const updatedList = filtroPosts.map(publicacion => ({
                ...publicacion,
                active: false
            }));
            setList(updatedList);
        }

        listar()
    }, [perfil_id, peticion])

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
                            title={
                                <Link to={`/perfil/${elem.usuario}`} style={{ textDecoration: 'none' }}>
                                    <span style={{ fontWeight: 'bold' }}>{elem.usuario}</span>
                                </Link>}
                        />
                        <CardMedia
                            component="img"
                            width="100%"
                            height="100%"
                            image={fer}
                        />
                        <CardActions disableSpacing>
                            <IconButton
                                key={elem.idPublicacion}
                                aria-label="Me gusta"
                                onClick={() => {
                                    setList(prevList =>
                                        prevList.map(item =>
                                            item.idPublicacion === elem.idPublicacion
                                                ? { ...item, active: !item.active }
                                                : item
                                        )
                                    );
                                }}
                                className={elem.active ? 'active' : ''}
                            >
                                <FavoriteIcon />
                            </IconButton>
                        </CardActions>

                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Link to={`/perfil/${elem.usuario}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <Typography variant="subtitle1" component="span" fontWeight="bold" marginRight={1}>
                                        {elem.usuario}
                                    </Typography>
                                </Link>
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
