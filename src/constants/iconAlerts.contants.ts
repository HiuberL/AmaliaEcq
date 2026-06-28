import { AlertType } from '@/hooks/shared/messageAlert/useMessageAlertState';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

// Definimos el tipo para asegurar que solo usemos los 3 que quieres

// Mapeo seguro con JSX.Element
export const IconMap: Record<string, React.ElementType> = {
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: AlertCircle
};