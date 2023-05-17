import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/img/BeBiker.png'


const Home = () => {

  return (
    <div className="home">
      <header>
        <h1>BeBiker</h1>
      </header>
      <div className="contentHome">
        <img
          className="logo"
          src={logo}
          alt="BeBiker logo"
        />
        <p className="texto">
          Bienvenido a BeBiker!
        </p>
        <Link to={{ pathname: '/login' }}>
          <button className="button">
            Inicia sesión
          </button>
        </Link>
        <Link to={{ pathname: '/registro' }}>
          <button className="button">
            Regístrate
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;