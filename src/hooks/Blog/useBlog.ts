import { useBlogEffects } from "./useBlogEffects";
import { useBlogHandler } from "./useBlogHandler";
import { useBlogState } from "./useBlogState"


export const useBlog = () => {
    const state = useBlogState();
    const handler = useBlogHandler(state);
    useBlogEffects(handler,state);

    return {
        ...state,
        ...handler
    }
}