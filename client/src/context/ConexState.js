import React from 'react'

import ConexContext from './ConexContext';

const ConexState = (props) => {
    const config = require('../config/config.json')

    /**
    * lanza una peticion al microservicio
    * @param {string} url 
    */
    const peticion = async (url, {method= 'GET', headers={}, json=null}={}) => {
        if (json && method==='GET')
            return ({
                mensaje: "Imposible mandar JSON con el método GET",
                estado: 3
            })

        let data
        try {
            let conexBack = config.conexBack
            let host = conexBack.host
            let param = {
                method: method,
                headers: headers
            }

            if (json) {
                param.headers['Content-Type'] = 'application/json'
                param['body'] = JSON.stringify(json)
            }
            if (conexBack?.port??null) //si el puerto es 0 no se usa
                host+=':'+conexBack.port

            data = await fetch(`${host}/${conexBack.app}/${conexBack.version}${url}`,param)

        } catch (error) {
            console.error(error)
            return {
                mensaje: "El microservicio no responde",
                estado: 1
            };
        }

        if (data.status!==200) {
            return {
                mensaje: `Problema de conexión. ${data.status}. ${data.statusText}. ${data.type}`,
                estado: 2
            };
        }
        data = await data.json()
        data.peticion = url
        
        return (data)
    }

    return (
        <ConexContext.Provider
            value={{
                peticion
            }}
        >
            {props.children}
        </ConexContext.Provider>
    );
};

export default ConexState