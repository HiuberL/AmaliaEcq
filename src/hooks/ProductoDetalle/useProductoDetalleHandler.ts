import { consultProductoEspecifico, crearResenaProducto } from "@/services/producto.service";
import { useProductoDetalleState } from "./useProductoDetalleState";


export const useProductoDetalleHandler = (
    state: ReturnType<typeof useProductoDetalleState>
) => {
    const {
        setPestanaAbierta,
        pestanaAbierta,
        formResena,
        setFormResena
    } = state;
    const togglePestana = (id: string) => {
        setPestanaAbierta(pestanaAbierta === id ? null : id);
    };
    const crearResena = async () => {
        try {
            await crearResenaProducto(formResena.productoId, formResena.puntuacion, formResena.usuario, formResena.comentario);
            window.showAlert('La resena se ha creado exitosamente, próximamente estará disponible', 'INFO');
        } catch (e) {
            window.showAlert((e as Error).message, 'ERROR')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormResena((prev) => ({
            ...prev,
            // Convertimos la puntuación a número si es el select
            [name]: name === 'puntuacion' ? Number(value) : value
        }));
    };

    const handleChangeTextArea = (e:string) => {
        const name = 'comentario';
        const value= e;

        setFormResena((prev) => ({
            ...prev,
            // Convertimos la puntuación a número si es el select
            [name]: value
        }));
    };

    return {
        togglePestana,
        crearResena,
        handleChange,
        handleChangeTextArea
    }
};