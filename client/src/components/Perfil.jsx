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

    const [Descripcion, setDescripcion] = useState('')
    const [List, setList] = useState([])

    //UseEffect
    useEffect(() => {
        async function ver() {
            const pet = await peticion('/perfil/ver?id=' + perfil_id)
            //console.log(pet)
            setUsuario(pet.usuario)
            setNombre(pet.nombre)
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
                        <div className='data'>
                            <h3>342<br /><span>Posts</span></h3>
                            <h3>120k<br /><span>Followers</span></h3>
                            <h3>342<br /><span>Following</span></h3>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
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
                                    sdfsdf
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
            </div>
        </>
    )

}
