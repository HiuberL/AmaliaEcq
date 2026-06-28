import { useEffect, useState } from "react";
import { useFaqHandler } from "./useFaqHandler";
import { useFaqState } from "./useFaqState";

export const useFaqEffects = (
    handler: ReturnType<typeof useFaqHandler>,
    state: ReturnType<typeof useFaqState>
) => {
    const{
        handlerConsultQuestions
    }=handler;

    const{
        searchTerm
    }=state;

    // 3. El useEffect escucha activamente cada vez que el "pathname" cambia
    useEffect(() => {
        handlerConsultQuestions();
    }, [searchTerm]);


}