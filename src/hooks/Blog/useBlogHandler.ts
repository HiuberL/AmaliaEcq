import { consultBlogs, consultCategoriasBlog } from "@/services/blog.service";
import { useBlogState } from "./useBlogState";
import { useRouter } from "next/navigation";



export const useBlogHandler = (
    state: ReturnType<typeof useBlogState>
) => {
    const {
        setLoading,
        setCategoriaT,
        setBlogPost,
        page,busqueda,categoria,
        maxPage,
        setPage,
        setMaxPage
    } = state;

    const router = useRouter();
    const onInit = async () => {
        try{
            const responseCategories = await consultCategoriasBlog();
            setCategoriaT(responseCategories);
            console.log(responseCategories);
            const responseBlogPost = await consultBlogs(page,categoria,busqueda);
            setBlogPost(responseBlogPost.informacion);
            setMaxPage(responseBlogPost.total);
        }catch (e){
            window.showAlert('No se pudo cargar información de blogs disponibles', 'ERROR');
        }finally{
        }
    }   

    const onChangePage = async (page:number) =>{
        if (page < maxPage || page > 1){
            setPage(page);
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });        
    }

    const onClickGotoBlogSection = async (slug: string) => {
        router.push(`/blog/${slug}`);
    };    

    return {
        onInit,
        onChangePage,
        onClickGotoBlogSection
    }
}