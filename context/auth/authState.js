import React, { useReducer } from "react";
import authContext from "./authContext";
import authReducers from "./authReducers";
import clienteAxios from "../../config/axios";
import tokenAuth from "../../config/tokenAuth";

import { 
    REGISTRO_EXITOSO, 
    REGISTRO_ERROR,
    LIMPIAR_ALERTA,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
} from "../../types";

const AuthState = ({children}) => {
    // Definir un satte inicial
    const initialState = {
        token: typeof windows !== 'undefined' ? localStorage.getItem('token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null
    }

    // Definir el reducer
    const [ state, dispath ] = useReducer(authReducers, initialState)

    // Registrar nuevos usuarios
    const registrarUsuario = async datos => {
        try{
            const respuesta = await clienteAxios.post('usuarios', datos)
            dispath({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            })
            
        } catch (error){
            dispath({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })
        }

        // LIMPIAR LA ALERTA DESPUES DE 3 SEGUNDOS
        setTimeout( () => {
            dispath({
                type: LIMPIAR_ALERTA
            })
        }, 3000)
    }

    // Autenticar ususarios
    const iniciarSesion = async datos => {
        try{
            const respuesta = await clienteAxios.post('auth', datos)
            dispath({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })

        } catch (error){
            dispath({
                type: LOGIN_ERROR,
                payload: error.response.data.msg 
            })
        }

        // LIMPIAR LA ALERTA DESPUES DE 3 SEGUNDOS
        setTimeout( () => {
            dispath({
                type: LIMPIAR_ALERTA
            })
        }, 3000)
    }

    // Retorna el usuario autenticado en base al JWT    
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token')

        if(token){
            tokenAuth(token)
        }

        try{
            const respuesta = await clienteAxios.get('auth')
            if(respuesta.data.usuario){
                dispath({
                    type: USUARIO_AUTENTICADO,
                    payload: respuesta.data.usuario
                })   
            }
        } catch (error){
            dispath({
                type: LOGIN_ERROR,
                payload: error.response.data.msg 
            })
        }
    }

    // Cerrar sesion
    const cerrarSesion = () => {
        dispath({
            type: CERRAR_SESION
        })
    }

    return (
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,
                usuarioAutenticado,
                iniciarSesion,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export default AuthState
