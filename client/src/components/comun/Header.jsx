import * as React from 'react';
import logo from '../../assets/img/BeBiker.png'
import '../../assets/css/header.css'

export const Header = () => {

    return (
        <div className='header'>
            <div className="logo">
                <img src={logo} alt="BeBiker" />
            </div>
            {/*<div className="search-bar">
                <input type="text" placeholder="Busca un usuario" />
            </div>*/}
        </div>
    )

}