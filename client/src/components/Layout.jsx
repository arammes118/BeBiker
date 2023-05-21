import * as React from 'react';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Inicio from '@mui/icons-material/Home'
import Añadir from '@mui/icons-material/Add'
import Rutas from '@mui/icons-material/DirectionsBike'
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { Publicaciones } from './Publicaciones';

const Layout = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<Inicio />} label="Inicio">
                    <Link to={{pathname: `/publicaciones` }} />
                </Tab>

                <Tab icon={<Añadir />} label="Subir" />

            <Tab icon={<Añadir />} label="Publicar foto" />
            <Tab icon={<Rutas />} label="Rutas" />
            <Tab icon={<PersonIcon />} label="Perfil" />
        </Tabs>
    );
}

export default Layout