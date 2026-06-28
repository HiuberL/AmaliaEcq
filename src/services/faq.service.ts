'use server'
import { ApiGeneral } from "@/interfaces/api-cliente.interface";
import { ProductoFull } from "@/interfaces/admin/producto-detalle.interface";
import { readItems } from "@directus/sdk";
import { directusPublic } from "./directus.config";

interface FAQItem {
  grupo: string;
  pregunta: string;
  respuesta: string;
}

const consultQuestions = async (): Promise<Record<string, Omit<FAQItem, 'grupo'>[]> | null> => {
  try {
    const preguntas = await directusPublic.request(
      readItems('faq', {
        fields: ["grupo", "pregunta", "respuesta"],
      })
    ) as FAQItem[]; // Parseamos la respuesta de Directus al tipo FAQItem

    if (!preguntas || preguntas.length === 0) return null;

    // 2. Agrupamos usando .reduce
    const agrupado = preguntas.reduce((acumulador, item) => {
      const { grupo, pregunta, respuesta } = item;
      
      // Si el grupo aún no existe en el acumulador, lo inicializamos como un arreglo vacío
      if (!acumulador[grupo]) {
        acumulador[grupo] = [];
      }
      
      // Empujamos la pregunta y respuesta dentro de su grupo correspondiente
      acumulador[grupo].push({ pregunta, respuesta });
      
      return acumulador;
    }, {} as Record<string, { pregunta: string; respuesta: string }[]>);

    return agrupado;

  } catch (error) {
    console.error("Error consultando las FAQ de Directus:", error);
    return null;
  }
};
export {
  consultQuestions
};