import { useState } from "react";

export const useFaqState = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [faqData, setFaqData] = useState<any>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    return{
        searchTerm, setSearchTerm,
        activeId, setActiveId,
        faqData, setFaqData
    }
}