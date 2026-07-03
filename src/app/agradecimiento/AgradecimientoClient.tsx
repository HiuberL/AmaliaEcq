'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';
import { useAgradecimiento } from '@/hooks/Agradecimiento/useAgradecimiento';

export default function AgradecimientoPage() {
    const searchParams = useSearchParams();
    
    const id = searchParams.get('id') || '';
    const clientTransactionId = searchParams.get('clientTransactionId') || '';

    const {
      loading,
      error
    }=useAgradecimiento(id,clientTransactionId);


    if (loading) return (<Loading />)
    if (error) return <p style={{ color: 'red' }}>⚠️ Error: {error}</p>;

    return (
        <div>
            <h1>¡Gracias por tu compra! 🎉</h1>
            <p>Tu pedido ha sido confirmado con éxito.</p>
            <small>Transacción: {clientTransactionId}</small>
        </div>
    );
}