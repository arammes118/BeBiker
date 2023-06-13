// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Importación Contexto
import ConexContext from '../context/ConexContext'

// CSS
import '../assets/css/publicaciones.css'
import '../assets/css/post.css'

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
import { Header } from './comun/Header'

export const Publicaciones = () => {
    const { peticion, perfil_id } = useContext(ConexContext) // Contexto

    // Estados
    const [List, setList] = useState([]) //listado de publicaciones

    const handleBase64Image = (base64Image) => {
        const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
        return "data:image/jpeg;base64," + trimmedBase64Image
    }

    // UseEffect
    useEffect(() => {
        async function listar() {
            const pet = await peticion("/publicaciones") // Peticion de publicaciones
            /* Filtramos los post obtenidos para devolver los posts que no son del mismo usuario
            que inicia sesión */
            const filtroPosts = pet.filter(publicacion => {
                return publicacion.cfUsuario !== perfil_id
            })
            const updatedList = filtroPosts.map(publicacion => {
                const imageObject = handleBase64Image(publicacion.foto) // Convertir la imagen en base64 a un objeto de imagen
                const imagenUsuario = handleBase64Image(publicacion.fotoUsuario)
                console.log(imageObject)
                return {
                    ...publicacion,
                    foto: imageObject, // Obtener la URL de la imagen y asignarla a la propiedad 'foto'
                    fotoUsuario: imagenUsuario
                }
            })
            setList(updatedList)
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
                                <Avatar src={elem.fotoUsuario} />
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
                            src={elem.foto}
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
                            <Link to={`/comentarios/${elem.idPublicacion}`}>
                                <button className='btnVerVal'>Ver comentarios</button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}
