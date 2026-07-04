export const uuidToNumber = (uuid: string): number => {
    let hash = 0;

    for (let i = 0; i < uuid.length; i++) {
        hash = ((hash << 5) - hash) + uuid.charCodeAt(i);
        hash |= 0; // Convierte a entero de 32 bits
    }

    return Math.abs(hash);
};
export const convertToBase64 = (file:any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    
    fileReader.onload = () => {
      resolve(fileReader.result); // Aquí regresa el string en Base64
    };
    
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const uuidToNumberFecha = (uuid: string): string => {
    let hash = 0;

    for (let i = 0; i < uuid.length; i++) {
        hash = ((hash << 5) - hash) + uuid.charCodeAt(i);
        hash |= 0; // Convierte a entero de 32 bits
    }

    const numeroBase = Math.abs(hash);

    // Obtener la fecha y hora actual
    const ahora = new Date();

    // Formatear cada componente asegurando siempre 2 dígitos
    const MM = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const DD = String(ahora.getDate()).padStart(2, '0');
    const YY = String(ahora.getFullYear()).slice(-2); // Toma los últimos 2 dígitos del año
    const HH = String(ahora.getHours()).padStart(2, '0');
    const mm = String(ahora.getMinutes()).padStart(2, '0');
    const SS = String(ahora.getSeconds()).padStart(2, '0');

    // Retornar el número del hash concatenado con el formato deseado
    return `${numeroBase}-${MM}${DD}${YY}${HH}${mm}${SS}`;
};