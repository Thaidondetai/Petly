const API_BFF_URL = 'http://localhost:8083/pedidos';

export const crearPedido = async (datosPedido) => {
    const response = await fetch(API_BFF_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPedido),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.mensaje || errorBody.error || 'Error al procesar el pedido');
    }

    return await response.json();
};

export const confirmarPagoWebpay = async (token, idPedido) => {
    const response = await fetch(`${API_BFF_URL}/confirmar-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, idPedido }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.mensaje || errorBody.error || 'Error al confirmar el pago');
    }

    return await response.json();
};