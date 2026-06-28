
import { useFaqEffects } from "./useFaqEffects";
import { useFaqHandler } from "./useFaqHandler";
import { useFaqState } from "./useFaqState";

export const useFaq = () => {
    const state = useFaqState();
    const handler = useFaqHandler(state);
    const effects = useFaqEffects(handler,state);
    return{
        searchTerm: state.searchTerm,
        setSearchTerm: state.setSearchTerm,
        faqData: state.faqData,
        activeId: state.activeId,
        toggleAccordion: handler.toggleAccordion
    }
}