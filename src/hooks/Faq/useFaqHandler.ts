import { consultQuestions } from "@/services/faq.service";
import { useFaqState } from "./useFaqState";

export const useFaqHandler = (
    state: ReturnType<typeof useFaqState>
) => {
    const {
        setActiveId,
        activeId,
        setFaqData
    } = state

    const toggleAccordion = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };
    const handlerConsultQuestions = async () => {
        try {
            const questions = await consultQuestions();
            setFaqData(questions);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudieron cargar las preguntas frecuentes.", 'ERROR');
        }
    };
    return {
        toggleAccordion,
        handlerConsultQuestions
    }
}