'use client';
import { IconMap } from '@/constants/iconAlerts.contants';
import { useMessageAlert } from '@/hooks/shared/messageAlert/useMessageAlert';

export default function MessageAlert() {
    const {
        type,
        message
    } = useMessageAlert();
    const typeStyles = {
        INFO: 'alert-info',
        WARNING: 'alert-warning',
        ERROR: 'alert-error'
    };    
    const IconComponent = IconMap[type];
    if (!message) return null;
    return (
        <div className={`alertMessage ${typeStyles[type]}`}>
            <div className="iconAlert">
                <IconComponent size={24} />
            </div>
            <div className="messageName">
                <p>{message}</p>
            </div>
        </div>
    );
}

