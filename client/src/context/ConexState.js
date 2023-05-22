import React, { useReducer } from "react";

import ConexContext from "./ConexContext";
import ConexReducer from "./ConexReducer";

const ConexState = (props) => {
    // Estado inicial del contexto
    const initialState = {
        token: null,
        locale: null,
        jwtSecu: null,
        perfil_id: null,
    }
    // Estado del contexto y reducer
    const [state, dispatch] = useReducer(ConexReducer, { initialState })

    // Configuracion del backend
    const config = require('../config/config.json');

    /**
    * lanza una peticion al microservicio
    * @param {string} url 
    */
    const peticion = async (url, {
        method = 'GET',
        headers = {},
        json = null } = {}) => {
        if (json & method === 'GET')
            return ({
                mensaje: "Imposible mandar JSON con el método GET",
                estado: 3
            })

        let data
        try {
            // Configuracion de la conexión al microservicio
            let conexBack = config.conexBack
            let host = conexBack.host;
            let param = {
                method: method,
                headers: headers
            }
            // Incluimos el token en el encabezado
            param.headers.authorization = state.token

            if (json) {
                param.headers['Content-Type'] = 'application/json'
                param['body'] = JSON.stringify(json)
            }
            if (conexBack?.port ?? null) //si el puerto es 0 no se usa
                host += ':' + conexBack.port
            
            // Realizamos la petición al microservicio
            data = await fetch(`${host}/${conexBack.app}/${conexBack.version}${url}`, param);
        }
        catch {
            return ({
                mensaje: "El microservicio no responde",
                estado: 1
            })
        }

        if (data.status !== 200)
            return ({
                mensaje: `Problema de conexión. ${data.status}. ${data.statusText}. ${data.type}`,
                estado: 2
            })
        data = await data.json();
        data.peticion = url

        // Si el token hay que renovarlo o ha expirado nos devuelve otro y lo guardamos
        if ('token' in data)
            dispatch({ 
                type: 'SET_JWT', 
                payload: data.token 
            })
        return (data)
    }

    
    // Actualiza el token en el estado
    const setToken = async (token) => {
        dispatch({ 
            type: 'SET_JWT', 
            payload: token 
        });
    };

    return (
        <ConexContext.Provider
            value={{
                token: state.token,
                perfil_id: state.perfil_id,
                setToken,
                peticion
            }}
        >
            {props.children}
        </ConexContext.Provider>
    )
}

export default ConexState