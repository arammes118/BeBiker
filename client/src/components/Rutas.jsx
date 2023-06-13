// Importaciones REACT
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Importación Contexto
import ConexContext from '../context/ConexContext'

// CSS
import '../assets/css/publicaciones.css'
import '../assets/css/post.css'

// Logo
import ruta from '../assets/img/ruta.jpg'

// CARD POST MATERIAL UI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'


export default function Rutas() {
  const { peticion, perfil_id } = useContext(ConexContext) // Contexto

  // Estados
  const [List, setList] = useState([]) //listado de publicaciones

  const handleBase64Image = (base64Image) => {
    const trimmedBase64Image = base64Image.substring(base64Image.indexOf(',') + 21)
    return "data:image/jpeg;base64," + trimmedBase64Image
  }

  // UseEffects
  useEffect(() => {
    async function listar() {
      const pet = await peticion("/rutas") // Peticion de publicaciones
      if (Array.isArray(pet)) {
        const listaActualizada = await Promise.all(pet.map(async (rutas) => {
          const imageObject = handleBase64Image(rutas.foto)
          return {
            ...rutas,
            foto: imageObject
          }
        }))
        setList(listaActualizada)
        console.log(pet)
      }
    }

    listar()
  }, [perfil_id, peticion])


  return (
    <div className='contentRuta'>
      {List.map((elem) => (
        <Card key={elem.idRuta} style={{ width: '100%', marginBottom: '20px', background: '#292929' }}>
          <CardHeader
            avatar={
              <Avatar src={elem.foto} />
            }
            title={
              <span style={{ fontWeight: 'bold', color: 'white' }}>{elem.usuario}</span>
            } />
          <CardMedia
            component="img"
            width="100%"
            height="100px"
            image={ruta}
          />
          <h2 className='titulo'>{elem.titulo}</h2>
          <p className='descripcion'>{elem.descripcion}</p>
          <CardContent>
            <Box display="flex" alignItems="center">
              <div className='actionBtn'>
                <Link to={`/ruta/${elem.titulo}/${elem.usuario}`}>
                  <button className='btnRutas'>Más informacion</button>
                </Link>
                <Link to={`/perfil/${elem.usuario}`}>
                  <button className='btnRutas'>Ver perfil</button>
                </Link>
              </div>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
