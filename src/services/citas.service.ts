'use server'
import { createItem, readItems } from "@directus/sdk";
import { directusPrivate, directusPublic } from "./directus.config";
import { getSessionCookie } from "@/utils/cookies.utils";
import { consultaConfiguracionByTabla } from "./configuraciones";

const guardarCitaCliente = async (request: any, idGuardado: any) => {
    try {
        // 1. 🔍 BUSCAR: Comprobamos si ya existe un cliente registrado con ese correo

        let clienteId: string | number;
        let clientesExistentes;


        // 1. 🔍 BUSCAR: Comprobamos si ya existe un cliente registrado con ese correo
        if (!idGuardado) {
            clientesExistentes = await directusPrivate.request(
                readItems('cliente', {
                    filter: {
                        _or: [
                            {
                                correo: { _eq: request.correo.trim().toLowerCase() }
                            },
                            {
                                // Filtramos por teléfono eliminando espacios en blanco por si acaso
                                telefono: { _eq: request.telefono.trim() }
                            }
                        ]
                    },
                    fields: ['id'] // Solo recuperamos el ID para hacer la relación
                })
            );
            if (clientesExistentes && clientesExistentes.length > 0) {
                clienteId = clientesExistentes[0].id;
            } else {
                const nuevoCliente = await directusPrivate.request(
                    createItem('cliente', {
                        nombres: request.nombres,
                        apellidos: request.apellidos,
                        telefono: request.telefono,
                        correo: request.correo.trim().toLowerCase(),
                        billetera_id: null
                    })
                );
                clienteId = nuevoCliente.id;
            }
        } else {
            clienteId = idGuardado;
        }


        // 3. 📝 GUARDAR SOLICITUD: Creamos la solicitud vinculándola limpiamente mediante el ID
        const resultado = await directusPrivate.request(
            createItem('citas', {
                dia: request.dia,
                hora: request.hora,
                tipo: request.tipo,
                mensaje: request.solicitud, // Aquí entra el HTML de Quill con las imágenes base64
                cliente_id: clienteId        // Pasamos el ID directamente (Relación Many-to-One limpia)
            })
        );

        return true;

    } catch (error) {
        console.error("Error al procesar la solicitud con relación de cliente:", error);
        throw error;
    }

};


const consultarCitas = async () => {
    const citas = await directusPublic.request(
        readItems('citas', {
            filter: {
                estado: {
                    _eq: "Confirmado"
                }
            },
            fields: [
                "dia",
                "hora"
            ]
        })
    );

    const horasLaboral = await consultaConfiguracionByTabla('LN_HORAS_TRABAJO_LABORAL');
    const horasFinSemana = await consultaConfiguracionByTabla('LN_HORAS_TRABAJO_FIN_SEMANA_FERIADO');
    const feriados = await consultaConfiguracionByTabla('LN_FERIADOS');
    const noLaboral = await consultaConfiguracionByTabla('LN_NO_LABORALES');

    const listaHorasLaboral = (horasLaboral || []).map((h: any) => h.valor?.substring(0, 5) || h.valor);
    const listaHorasFinSemana = (horasFinSemana || []).map((h: any) => h.valor?.substring(0, 5) || h.valor);
    const listaFeriados = new Set((feriados || []).map((f: any) => f.valor));
    const listaNoLaborales = new Set((noLaboral || []).map((f: any) => f.valor));

    const citasOcupadasSet = new Set(
        (citas || []).map((c: any) => {
            const horaLimpia = c.hora?.substring(0, 5) || c.hora;
            return `${c.dia}|${horaLimpia}`;
        })
    );

    // Generar la disponibilidad para los próximos N días
    const datosDisponibilidadApi = [];
    const hoy = new Date();
    const DIAS_A_GENERAR = 30;

    for (let i = 0; i < DIAS_A_GENERAR; i++) {
        const fechaTemp = new Date(hoy);
        fechaTemp.setDate(hoy.getDate() + i);

        // Formatear a YYYY-MM-DD
        const ano = fechaTemp.getFullYear();
        const mes = String(fechaTemp.getMonth() + 1).padStart(2, '0');
        const diaNum = String(fechaTemp.getDate()).padStart(2, '0');
        const fechaString = `${ano}-${mes}-${diaNum}`;

        const diaSemana = fechaTemp.getDay(); // 0 = Domingo, 6 = Sábado
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
        const esFeriado = listaFeriados.has(fechaString);
        const esNoLaboral = listaNoLaborales.has(fechaString);

        let turnos: { hora: string; disponible: boolean }[] = [];

        // 🚨 SI ES DÍA NO LABORAL: No hay turnos disponibles para este día
        if (esNoLaboral) {
            turnos = []; 
        } else {
            // Seleccionar el catálogo de horas correspondiente
            const horasBase = (esFinDeSemana || esFeriado) ? listaHorasFinSemana : listaHorasLaboral;

            // Construir los turnos para este día
            turnos = horasBase.map((hora: string) => {
                const keyOcupado = `${fechaString}|${hora}`;
                const estaOcupado = citasOcupadasSet.has(keyOcupado);

                return {
                    hora: hora, // ej: "10:00"
                    disponible: !estaOcupado
                };
            });
        }

        datosDisponibilidadApi.push({
            fecha: fechaString,
            turnos: turnos
        });
    }

    return datosDisponibilidadApi;
};
export {
    guardarCitaCliente,
    consultarCitas
}