// app/page.tsx

// 1. Importas el componente de inicio y sus metadatos desde la carpeta donde los creaste
import InicioPage, { metadata as inicioMetadata } from "./inicio/page";

// 2. Exportas los metadatos obligatoriamente aquí en la raíz para que Google los lea
export const metadata = inicioMetadata;

// 3. Tu componente Home simplemente devuelve la página de inicio
export default function Home() {
  return <InicioPage />;
}