import { logoutSoloCookies } from "@/utils/cookies.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLayoutState } from "./useLayoutState";

export const useLayoutHandler = () => {
    const router = useRouter();
    const onLogout = async () => {
        await logoutSoloCookies();
        router.push('/');
        router.refresh();
    };

    return{
        onLogout
    }

}