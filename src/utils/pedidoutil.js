import axios from "axios";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// URL base del BFF (Asegúrate de que apunte a HTTPS)
const BFF_URL =
    import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";

const getIdUsuario = () => {
    try {
        const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64)).sub;
    } catch {
        return "GUEST";
    }
};

const itemRequiereSag = (item) =>
    Boolean(
        item.requiereSag ||
        item.requiere_sag ||
        parseInt(item.idEspecie ?? item.id_especie ?? item.especieId, 10) === 3
    );

// Función auxiliar para redirigir a Webpay vía POST (requerido por Transbank)
const redirigirAWebpay = (url, token) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "token_ws";
    input.value = token;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
};

export const procesarPagoWebpay = async (carrito, totalCalculado, datosEnvio) => {
    const { permisoSag, direccionCompleta, indicacionesAdicionales, ...resto } = datosEnvio;

    const payload = {
        idUsuario: getIdUsuario(),
        monto: Math.round(totalCalculado),
        metodoPago: "WEBPAY",
        envio: {
            ...resto, // nombreReceptor, rutReceptor, telefono, region, comuna
            direccion: direccionCompleta,
            indicaciones: indicacionesAdicionales || null,
        },
        detalles: carrito.map((item) => ({
            idProducto: item.idProducto || item.id,
            nombreProducto: item.nombreProducto || item.nom_prod,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            requiereSag: itemRequiereSag(item),
        })),
        certificadoSag: permisoSag
            ? { numeroRegistroSag: String(permisoSag), urlDocumento: null }
            : null,
    };

    const response = await axios.post(
        `${BFF_URL}/api/bff/pedidos/iniciar-pago`,
        payload,
        getAuthHeaders()
    );

    const data = response.data;
    
    // AQUÍ ESTÁ LA CORRECCIÓN: Agregamos url_pago y token_ws para hacer match con el BFF
    const urlPasarela = data?.url || data?.urlWebpay || data?.url_pago;
    const tokenPasarela = data?.token || data?.tokenWebpay || data?.token_ws;

    if (urlPasarela && tokenPasarela) {
        sessionStorage.setItem("idPedidoPendiente", data.idPedido ?? "");
        // Redirección mediante POST con el formulario dinámico
        redirigirAWebpay(urlPasarela, tokenPasarela);
    } else if (data?.estado === "PENDIENTE_VALIDACION_SAG") {
        alert("Tu pedido ha sido ingresado y quedó en estado: PENDIENTE DE VALIDACIÓN SAG.");
        window.location.href = "/";
    } else {
        throw new Error("No se recibió respuesta válida de la pasarela de pago.");
    }
};

export const confirmarPagoWebpay = async (tokenWs, idPedido = null) => {
    const response = await axios.post(
        `${BFF_URL}/api/bff/pedidos/confirmar-pago`,
        { token: tokenWs, idPedido },
        getAuthHeaders()
    );

    const res = response.data;
    return {
        ...res,
        response_code: res.response_code ?? res.responseCode ?? -1,
        buy_order: res.buy_order || res.buyOrder || "N/A",
        authorization_code: res.authorization_code || res.authorizationCode || "N/A",
        amount: res.amount || res.monto || 0,
        card_detail: res.card_detail || res.cardDetail || { card_number: "****" },
    };
};