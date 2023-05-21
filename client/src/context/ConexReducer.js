const ConexReducer = (state, action) => {
    const { payload, type } = action
    let perfil
    switch (type) {
        case 'SET_JWT':
            if (payload !== '') {
                // Decodificamos el payload del token para obtener información del perfil
                perfil = JSON.parse(window.atob(payload.split('.')[1]))
            } else {
                // Borramos el token si el payload está vacío
                delete (localStorage.token)
                return {
                    ...state,
                    token: null 
                }
            }
            // Guardamos el token en el localStorage y actualizamos el estado
            localStorage.token = payload
            return {
                ...state,
                token: payload,
                perfil_id: perfil.id
            }
        default:
            return state
    }
}

export default ConexReducer