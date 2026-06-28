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
        const questions = await consultQuestions();
        setFaqData(questions);
    };
    return {
        toggleAccordion,
        handlerConsultQuestions
    }
}