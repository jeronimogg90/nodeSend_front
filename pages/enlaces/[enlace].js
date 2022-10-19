import Layout from "../../components/Layout";
import clienteAxios from "../../config/axios";
import React, {useState, useContext} from "react";
import appContext from "../../context/app/appContext";
import Alerta from "../../components/Alerta";

// Respuestas del servidor
export async function getServerSideProps({params}) {
    const { enlace } = params
    const resultado = await clienteAxios.get(`enlaces/${enlace}`)

    return {
        props: {
            enlace: resultado.data
        }
    }
}


// Rutas estaticas
export async function getServerSidePaths(){
    const enlaces = await clienteAxios.get('enlaces')
    return {
        paths: enlaces.data.enlaces.map(enlace => ({
            params: { enlace : enlace.url}
        })),
        fallback: false
    }
}

export default ({enlace}) => {
    // States locales
    const [ tienePassword, setTienePassword] = useState(enlace.password)
    const [ password, setPassword] = useState('')

    // State de la app
    const AppContext = useContext(appContext)
    const { mostrarAlerta, mensaje_archivo } = AppContext

    const verificarPassword = async e => {
        e.preventDefault()

        const data = { password }

        try{
            const resultado = await clienteAxios.post(`enlaces/${enlace.enlace}`, data)
            console.log(resultado)
            setTienePassword(resultado.data.password)

        } catch (error){
            mostrarAlerta(error.response.data.msg) 
        }
        
    }

    return (
        <Layout>
            {
                tienePassword ? (
                    <>
                        <p>Este enlace esta protegico por un password, colocalo a continuación</p>

                        { mensaje_archivo && <Alerta />}

                        <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <form 
                                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={ e => verificarPassword(e) }
                            >

                                <div className='mb-4'>
                                    <label 
                                        className='block text-black text-sm font-bold mb-2'
                                        htmlFor="password"
                                    >Password</label>
                                    <input
                                        id="password" 
                                        type="password"
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                            leading-tight focus:outline-none focus:shadow-outline
                                        '
                                        placeholder="Password del enlace"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <input 
                                    type="submit"
                                    className='bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold'
                                    value="validar password"
                                />
                            </form>
                        </div>
                        </div>
                    </>   
                ) : (
                    <>
                        <h1 className="text-4xl text-center text-gray-700">Descarga tu archivo: </h1>
                        <div className="flex items-center justify-center mt-10">
                            <a className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold 
                                text-white cursor-pointer hover:bg-red-900"
                                href={`${process.env.backendURL}archivos/${enlace.archivo}`}
                                download
                            >Aquí
                            </a>
                        </div>
                    </>
                )
            }
            
        </Layout>
    )
}