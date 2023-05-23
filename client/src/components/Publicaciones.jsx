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

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const Publicaciones = () => {
    //Contexto
    const { peticion } = useContext(ConexContext)
    const { idReg } = useParams()
    const [expanded, setExpanded] = useState(false)
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    };


    // Estados
    const [List, setList] = useState([]) //listado de publicaciones
    const [Ini, setIni] = useState(0) // Inicio del listado
    const [IgPos, setIgPos] = useState(false)// se debe ignorar la posición del idReg

    useEffect(() => {
        async function listar() {
            const pet = await peticion("/publicaciones")
            setList(pet)
            console.log(pet)
        }

        listar()
    }, [])

    return (
        <div>
            {List.map((elem) => (
                <Card sx={{ maxWidth: 345, minWidth: 345 }}>
                    <CardHeader
                        avatar={
                            <Avatar src={logo} />
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={<span style={{ fontWeight: 'bold' }}>{elem.usuario}</span>}
                    />
                    <CardMedia
                        component="img"
                        height="200"
                        image={logo}
                        alt="Paella dish"
                    />
                    <CardActions disableSpacing>
                        <IconButton
                            aria-label="Me gusta"
                            onClick={handleClick}
                            className={active ? 'active' : ''}
                        >
                            <FavoriteIcon className={active ? 'activeIcon' : ''} />
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon />
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
    )
}
