import axios from "axios";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const BFF_URL =
    import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";

const CLAVE_PEDIDO_PENDIENTE = "petly_pedido_pendiente_sag";

export const getIdUsuario = () => {
    try {
        const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");
        if (!token) return "GUEST";
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64)).sub || "GUEST";
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

export const guardarPedidoPendienteLocal = (pedidoData) => {
    try {
        const idUsuario = pedidoData?.idUsuario || getIdUsuario();
        const payload = {
            ...pedidoData,
            idUsuario,
            actualizadoEn: new Date().toISOString(),
        };
        localStorage.setItem(CLAVE_PEDIDO_PENDIENTE, JSON.stringify(payload));
        if (pedidoData?.idPedido != null && pedidoData?.idPedido !== "") {
            sessionStorage.setItem("idPedidoPendiente", String(pedidoData.idPedido));
            localStorage.setItem("idPedidoPendiente", String(pedidoData.idPedido));
        }
    } catch (e) {
        console.error("Error guardando pedido pendiente local:", e);
    }
};

export const obtenerPedidoPendienteLocal = (idUsuarioActual = getIdUsuario()) => {
    try {
        const raw = localStorage.getItem(CLAVE_PEDIDO_PENDIENTE);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || (idUsuarioActual && parsed.idUsuario && parsed.idUsuario !== idUsuarioActual)) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
};

export const limpiarPedidoPendienteLocal = () => {
    try {
        localStorage.removeItem(CLAVE_PEDIDO_PENDIENTE);
        sessionStorage.removeItem("idPedidoPendiente");
        localStorage.removeItem("idPedidoPendiente");
    } catch (e) {
        console.error("Error limpiando pedido pendiente local:", e);
    }
};

export const consultarEstadoPedidoPendiente = async (pedidoActual) => {
    const idUsuario = getIdUsuario();
    const basePedido = pedidoActual || obtenerPedidoPendienteLocal(idUsuario);
    if (!basePedido) return null;

    try {
        const queryId = basePedido.idPedido ? `?idPedido=${encodeURIComponent(basePedido.idPedido)}` : "";
        const res = await axios.get(
            `${BFF_URL}/api/bff/pedidos/usuario/${encodeURIComponent(idUsuario)}/pendiente${queryId}`,
            getAuthHeaders()
        );
        const data = res.data;
        if (data && (data.idPedido || data.id_pedido || data.estado)) {
            const normalizado = {
                ...basePedido,
                idPedido: data.idPedido ?? data.id_pedido ?? basePedido.idPedido,
                estado: data.estado || data.estadoValidacion || basePedido.estado || "PENDIENTE",
                monto: data.monto ?? data.monto_total ?? basePedido.monto,
                envio: data.envio || basePedido.envio,
            };
            guardarPedidoPendienteLocal(normalizado);
            return normalizado;
        }
    } catch {
        // Si el endpoint aún no está expuesto en el BFF, conserva el estado local guardado
    }

    return basePedido;
};

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

export const pagarPedidoValidado = async (pedido) => {
    const idPedido = pedido?.idPedido ?? pedido?.id_pedido;
    if (!idPedido) {
        throw new Error("No se encontró el identificador del pedido validado.");
    }

    const response = await axios.post(
        `${BFF_URL}/api/bff/pedidos/${idPedido}/iniciar-pago`,
        {
            idPedido,
            idUsuario: pedido.idUsuario || getIdUsuario(),
            monto: pedido.monto ? Math.round(pedido.monto) : undefined,
            metodoPago: "WEBPAY",
        },
        getAuthHeaders()
    );

    const data = response.data;
    const urlPasarela = data?.url || data?.urlWebpay || data?.url_pago;
    const tokenPasarela = data?.token || data?.tokenWebpay || data?.token_ws;

    if (!urlPasarela || !tokenPasarela) {
        throw new Error("No se recibió respuesta válida de la pasarela de pago.");
    }

    sessionStorage.setItem("idPedidoPendiente", String(idPedido));
    localStorage.setItem("idPedidoPendiente", String(idPedido));
    redirigirAWebpay(urlPasarela, tokenPasarela);
};

export const procesarPagoWebpay = async (carrito, totalCalculado, datosEnvio) => {
    const { permisoSag, direccionCompleta, indicacionesAdicionales, ...resto } = datosEnvio;
    const idUsuario = getIdUsuario();
    const montoRedondeado = Math.round(totalCalculado);
    const envioNormalizado = {
        ...resto,
        direccion: direccionCompleta,
        indicaciones: indicacionesAdicionales || null,
    };

    const payload = {
        idUsuario,
        monto: montoRedondeado,
        metodoPago: "WEBPAY",
        envio: envioNormalizado,
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
    const urlPasarela = data?.url || data?.urlWebpay || data?.url_pago;
    const tokenPasarela = data?.token || data?.tokenWebpay || data?.token_ws;
    const idPedidoCreado = data?.idPedido ?? data?.id_pedido ?? data?.id ?? null;

    if (idPedidoCreado != null && idPedidoCreado !== "") {
        guardarPedidoPendienteLocal({
            idPedido: idPedidoCreado,
            idUsuario,
            monto: montoRedondeado,
            estado: data?.estado || "PENDIENTE",
            envio: envioNormalizado,
            requiereSag: Boolean(permisoSag),
        });
    }

    if (urlPasarela && tokenPasarela) {
        redirigirAWebpay(urlPasarela, tokenPasarela);
        return;
    }

    if (data?.estado === "PENDIENTE_VALIDACION_SAG" || data?.estado === "PENDIENTE") {
        guardarPedidoPendienteLocal({
            idPedido: idPedidoCreado ?? `TMP-${Date.now()}`,
            idUsuario,
            monto: montoRedondeado,
            estado: "PENDIENTE",
            envio: envioNormalizado,
            requiereSag: true,
        });
        window.location.href = "/Carro";
        return;
    }

    throw new Error("No se recibió respuesta válida de la pasarela de pago.");
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