'use server';

import { createDirectus, rest, authentication, createUser, login, readItems, updateItem, createItem, deleteItem, deleteUser, refresh } from '@directus/sdk';
import { cookies } from 'next/headers';
import { directusAuth, directusAuthUser, directusPrivate } from './directus.config';
import { getSessionCookie, logoutSoloCookies, removeSessionCookie, setSessionCookie } from '@/utils/cookies.utils';

const ID_ROL_CLIENTE = process.env.ID_ROL_CLIENTE;
/**
 * 📝 REGISTRO DE NUEVO CLIENTE/USUARIO
 */
export async function registrarUsuario(formData: any) {
    // Variables para llevar el rastro de lo que creamos en caso de necesitar un rollback
    let usuarioCreadoId: string | null = null;
    let billeteraCreadaId: string | null = null;
    
    try {
        const { email, password, nombres, apellidos, telefono, identificacion } = formData;

        if (!email || !password || !nombres || !apellidos || !identificacion || !telefono) {
            return { exito: false, error: 'Campos mandatorios incompletos.' };
        }

        // 1. Crear el usuario en la tabla interna de Directus (directus_users)
        try {
            const nuevoUsuario = await directusPrivate.request(
                createUser({
                    email: email.trim().toLowerCase(),
                    password: password,
                    first_name: nombres,
                    last_name: apellidos,
                    role: ID_ROL_CLIENTE,
                })
            );
            usuarioCreadoId = nuevoUsuario.id; // 📌 Guardamos el ID para rastreo
        } catch (error: any) {
            console.error('Error al crear directus_user:', error);
            return { exito: false, error: 'El correo electrónico ya se encuentra registrado.' };
        }

        // 2. Buscar si ya existía un registro previo en la tabla 'cliente'
        const clientesExistentes = await directusPrivate.request(
            readItems('cliente', {
                filter: {
                    _or: [
                        { correo: { _eq: email.trim().toLowerCase() } },
                        { telefono: { _eq: telefono.trim() } },
                        { identificacion: { _eq: identificacion.trim() } }

                    ]
                },
                fields: ['id', 'billetera_id']
            })
        );

        if (clientesExistentes && clientesExistentes.length > 0) {
            // 🔄 ESCENARIO A: El cliente ya existía como lead.
            const clientePrevio = clientesExistentes[0];
            const clientePrevioId = clientePrevio.id;
            
            // 🐛 CORRECCIÓN: Leemos directamente del objeto encontrado
            let billeteraExistente = clientePrevio.billetera_id; 

            if (!billeteraExistente) {
                // Creamos la billetera faltante
                const nuevaBilletera = await directusPrivate.request(
                    createItem('billetera', {
                        saldo_disponible: 0.00,
                        saldo_bloqueado: 0.00,
                    })
                );
                billeteraCreadaId = nuevaBilletera.id; // 📌 Guardamos el ID para rastreo

                // Actualizamos el cliente vinculando todo
                await directusPrivate.request(
                    updateItem('cliente', clientePrevioId, {
                        usuario_id: usuarioCreadoId, 
                        nombres: nombres,            
                        apellidos: apellidos || '',
                        billetera_id: billeteraCreadaId,
                        identificacion: identificacion,
                        telefono: telefono ? telefono.trim() : undefined
                    })
                );
            } else {
                // El cliente ya tenía billetera, solo lo enlazamos con el nuevo usuario
                await directusPrivate.request(
                    updateItem('cliente', clientePrevioId, {
                        usuario_id: usuarioCreadoId, 
                        nombres: nombres,            
                        apellidos: apellidos || '',
                        identificacion: identificacion,
                        billetera_id: billeteraExistente,
                        telefono: telefono ? telefono.trim() : undefined
                    })
                );
            }
        } else {
            // 🆕 ESCENARIO B: Es un cliente totalmente nuevo.
            const nuevaBilleteraN = await directusPrivate.request(
                createItem('billetera', {
                    saldo_disponible: 0.00,
                    saldo_bloqueado: 0.00,
                })
            );
            billeteraCreadaId = nuevaBilleteraN.id; // 📌 Guardamos el ID para rastreo

            // Creamos la fila en tu tabla 'cliente'
            await directusPrivate.request(
                createItem('cliente', {
                    nombres: nombres,
                    apellidos: apellidos || '',
                    telefono: telefono ? telefono.trim() : '',
                    identificacion: identificacion,
                    correo: email.trim().toLowerCase(),
                    billetera_id: billeteraCreadaId, 
                    usuario_id: usuarioCreadoId     
                })
            );
        }

        // Si el flujo llegó hasta aquí sin caer al catch, todo fue un éxito rotundo.
        return await loginUsuario(email,password);

    } catch (error: any) {
        console.error('🚨 Ocurrió un fallo en el flujo. Iniciando Rollback Manual...', error);

        // 🛡️ SISTEMA DE TRANSACCIONALIDAD (ROLLBACK)
        // Si alcanzamos a crear la billetera pero falló el registro del cliente, la borramos
        if (billeteraCreadaId) {
            try {
                await directusPrivate.request(deleteItem('billetera', billeteraCreadaId));
                console.log(`✅ Rollback: Billetera ${billeteraCreadaId} eliminada.`);
            } catch (err) {
                console.error('No se pudo revertir la creación de la billetera:', err);
            }
        }

        // Si alcanzamos a crear el usuario en directus_users, lo eliminamos del sistema
        if (usuarioCreadoId) {
            try {
                await directusPrivate.request(deleteUser(usuarioCreadoId));
                console.log(`✅ Rollback: Usuario de Directus ${usuarioCreadoId} eliminado.`);
            } catch (err) {
                console.error('No se pudo revertir la creación del usuario:', err);
            }
        }

        return { 
            exito: false, 
            error: 'Hubo un inconveniente al procesar tu cuenta. Se revirtieron los cambios de forma segura.' 
        };
    }
}

/**
 * 🔑 INICIO DE SESIÓN (LOGIN)
 * 
 */
export async function loginUsuario(email: string, password: string) {
  try {
    const emailLimpio = email.trim().toLowerCase();

    // 1. Intentamos autenticar contra Directus
    const authData = await directusAuth.login({
        email: emailLimpio, 
        password: password,
    },{
        mode:'json'
    });

    if (!authData || !authData.access_token) {
      return { exito: false, error: 'Credenciales inválidas.' };
    }
    // 2. Guardamos los tokens de sesión en cookies httpOnly seguras
    await setSessionCookie('amalia_token', authData.access_token);
    
    if (authData.refresh_token) {
        // 🐛 CORRECCIÓN: Guardamos en su propia cookie de refresco, no sobre 'amalia_token'
        await setSessionCookie('amalia_refresh_token', authData.refresh_token);
    }

    // 3. 🎯 EXTRAER Y GUARDAR EL ID DE LA TABLA 'CLIENTE'
    // Usamos la instancia privada porque el usuario apenas se está logueando y no tiene permisos globales de lectura
    try {
        const clientesEncontrados = await directusPrivate.request(
            readItems('cliente', {
                filter: {
                    correo: { _eq: emailLimpio }
                },
                fields: ['id'] // Solo nos interesa el ID de la tabla cliente
            })
        );

        if (clientesEncontrados && clientesEncontrados.length > 0) {
            const clienteId = clientesEncontrados[0].id.toString();
            
            // Guardamos el ID del cliente en una cookie segura de larga duración (24 horas)
            await setSessionCookie('amalia_cliente_id', clienteId);
        }
    } catch (dbError) {
        // Si falla la búsqueda del cliente, logueamos el error pero no bloqueamos el login del usuario
        console.error('Error al mapear el ID del cliente tras el login:', dbError);
    }

    return { exito: true };

  } catch (error) {
    console.error('Error en login de Directus:', error);
    return { exito: false, error: 'Correo o contraseña incorrectos.' };
  }
}


export async function renovarSesionServidor(): Promise<string | null> {
  const refresh_token = await getSessionCookie('amalia_refresh_token');

  if (!refresh_token) {
    console.warn("Amalia Auth: No hay refresh token disponible.");
    return null;
  }

  try {
    const result = await directusAuth.request(refresh({ mode: 'json', refresh_token }));
    if (result.access_token) {
        await setSessionCookie('amalia_token', result.access_token ||'');
    }
    if (result.refresh_token) {
      await setSessionCookie('amalia_refresh_token', result.refresh_token);
    }
    return result.access_token;
  } catch (error) {
    console.error("Amalia Auth: El refresh token falló o venció. Limpiando sesión.", error);
    await logoutSoloCookies();
    return null;
  }
}