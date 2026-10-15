import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";
import { crearPedido } from "../utils/pedidoutil";

export const Checkout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    //const [carrito] = useState(() => {
        //try {
            //const data = localStorage.getItem("carro");
            //const parsed = JSON.parse(data) || [];
            //return Array.isArray(parsed) ? parsed : [];
        //} catch {
            //return [];
        //}
    //});

    // 🛠️ DATOS DE PRUEBA HARCODEADOS PARA CHECKOUT LOCAL
    //const [carrito] = useState([
        //{
            //idProducto: 5,
            //nombreProducto: "Loro Guanay Exótico",
            //precio: 45000,
            //cantidad: 1,
            //requiereSag: true // para probar productos con sag
        //}
    //]);

    const [carrito] = useState([
    {
        idProducto: 12,
        nombreProducto: "Juguete para Perro Bouncing Ball",
        precio: 5990,
        cantidad: 1,
        requiereSag: false //productos que no requieren sag
    }
    ]);

    const [cargando, setCargando] = useState(false);
    const [errorMsj, setErrorMsj] = useState("");

    const [envio, setEnvio] = useState({
        rutReceptor: "",
        nombreReceptor: "",
        telefono: "",
        region: "Valparaíso",
        comuna: "La Ligua",
        direccion: "",
        indicaciones: "",
    });

    const [certificadoSag, setCertificadoSag] = useState({
        numeroRegistroSag: "",
        urlDocumento: "",
    });

    const [metodoPago, setMetodoPago] = useState("WEBPAY");

    //useEffect(() => {
        //if (carrito.length === 0) {
           // navigate("/");
        //}
    //}, [carrito, navigate]);

    const requiereSagGlobal = carrito.some((item) => item.requiereSag);

    const montoTotal = carrito.reduce(
        (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
        0
    );

    const handleEnvioChange = (e) => {
        setEnvio({ ...envio, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsj("");

        if (requiereSagGlobal && !certificadoSag.numeroRegistroSag.trim()) {
            setErrorMsj(t("error_sag_required", "Debes ingresar un Número de Registro SAG válido para especies exóticas."));
            return;
        }

        setCargando(true);

        const idUsuario = localStorage.getItem("id_usuario") || "USR-GOOGLE-102030";

        const payload = {
            idUsuario,
            metodoPago,
            envio,
            detalles: carrito.map((item) => ({
                idProducto: item.idProducto || item.id,
                nombreProducto: item.nombreProducto || item.nom_prod || "Producto Petly",
                precioUnitario: item.precio,
                cantidad: item.cantidad,
                requiereSag: !!item.requiereSag,
            })),
            ...(requiereSagGlobal && { certificadoSag }),
        };

        try {
            const pedidoCreado = await crearPedido(payload);

            sessionStorage.setItem("idPedidoPendiente", pedidoCreado.idPedido);

            if (pedidoCreado.estado === "PENDIENTE_VALIDACION_SAG") {
                alert(t("alert_sag_pending", `Pedido #${pedidoCreado.idPedido} registrado. Queda en revisión por validación SAG antes de efectuar el cobro.`, { id: pedidoCreado.idPedido }));
                localStorage.removeItem("carro");
                navigate("/");
                return;
            }

            if (pedidoCreado.urlWebpay && pedidoCreado.tokenWebpay) {
                const form = document.createElement("form");
                form.action = pedidoCreado.urlWebpay;
                form.method = "POST";

                const inputToken = document.createElement("input");
                inputToken.type = "hidden";
                inputToken.name = "token_ws";
                inputToken.value = pedidoCreado.tokenWebpay;

                form.appendChild(inputToken);
                document.body.appendChild(form);
                form.submit();
            } else {
                alert(t("alert_order_success", `¡Pedido #${pedidoCreado.idPedido} generado con éxito!`, { id: pedidoCreado.idPedido }));
                localStorage.removeItem("carro");
                navigate("/");
            }
        } catch (err) {
            setErrorMsj(err.message || t("error_process_order", "Error al procesar el pedido."));
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <NavComponent />
            <main className="petly-simple-page py-5">
                <Container>
                    <div className="mb-4">
                        <span className="section-label">{t("checkout_section", "PASARELA DE PAGO")}</span>
                        <h1 className="petly-title mb-1">{t("checkout_title", "Finalizar Compra")}</h1>
                        <p className="petly-subtitle">{t("checkout_subtitle", "Ingresa tus datos de entrega y acreditación normativa")}</p>
                    </div>

                    {errorMsj && <Alert variant="danger">{errorMsj}</Alert>}

                    <Row className="g-4">
                        <Col lg={7}>
                            {/* REQUISITO SAG EXÓTICO */}
                            {requiereSagGlobal && (
                                <div className="checkout-sag-box mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="badge bg-danger" style={{ fontSize: "0.8rem" }}>
                                            {t("sag_badge_mandatory", "REQUISITO SAG OBLIGATORIO")}
                                        </span>
                                    </div>
                                    <h4 className="petly-title fs-5 mb-2">{t("sag_title", "Certificación de Especies Exóticas")}</h4>
                                    <p className="descripcion mb-3" style={{ fontSize: "0.88rem" }}>
                                        {t("sag_desc", "Tu carrito contiene especies sujetas a fiscalización del SAG. Debes ingresar la acreditación correspondiente.")}
                                    </p>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="spec-label">{t("sag_reg_label", "N° Registro SAG Autorizado *")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("sag_reg_placeholder", "Ej: SAG-2026-98765")}
                                            value={certificadoSag.numeroRegistroSag}
                                            onChange={(e) =>
                                                setCertificadoSag({ ...certificadoSag, numeroRegistroSag: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="spec-label">{t("sag_url_label", "URL del Documento (Opcional)")}</Form.Label>
                                        <Form.Control
                                            type="url"
                                            placeholder={t("sag_url_placeholder", "https://...")}
                                            value={certificadoSag.urlDocumento}
                                            onChange={(e) =>
                                                setCertificadoSag({ ...certificadoSag, urlDocumento: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </div>
                            )}

                            {/* FORMULARIO DE DESPACHO */}
                            <div className="producto-hero-card">
                                <h4 className="seccion-bloque-titulo mb-3">{t("shipping_header", "Datos de Despacho")}</h4>

                                <Form onSubmit={handleSubmit} id="checkout-form">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="spec-label">{t("receiver_name_label", "Nombre Completo Receptor *")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombreReceptor"
                                            placeholder={t("receiver_name_placeholder", "Ej: Thais Caamaño")}
                                            value={envio.nombreReceptor}
                                            onChange={handleEnvioChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="spec-label">{t("receiver_rut_label", "RUT Receptor *")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="rutReceptor"
                                                    placeholder={t("receiver_rut_placeholder", "Ej: 12345678-9")}
                                                    value={envio.rutReceptor}
                                                    onChange={handleEnvioChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="spec-label">{t("phone_label", "Teléfono *")}</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="telefono"
                                                    placeholder={t("phone_placeholder", "+56912345678")}
                                                    value={envio.telefono}
                                                    onChange={handleEnvioChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="spec-label">{t("region_label", "Región *")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="region"
                                                    value={envio.region}
                                                    onChange={handleEnvioChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="spec-label">{t("commune_label", "Comuna *")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="comuna"
                                                    value={envio.comuna}
                                                    onChange={handleEnvioChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="spec-label">{t("address_label", "Dirección Completa *")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="direccion"
                                            placeholder={t("address_placeholder", "Calle, Número, Depto/Casa")}
                                            value={envio.direccion}
                                            onChange={handleEnvioChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="spec-label">{t("notes_label", "Indicaciones Adicionales")}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="indicaciones"
                                            placeholder={t("notes_placeholder", "Ej: Casa esquina blanca...")}
                                            value={envio.indicaciones}
                                            onChange={handleEnvioChange}
                                        />
                                    </Form.Group>
                                </Form>
                            </div>
                        </Col>

                        {/* RESUMEN Y MEDIO DE PAGO */}
                        <Col lg={5}>
                            <div className="producto-seccion-bloque mb-4">
                                <h4 className="seccion-bloque-titulo mb-3">{t("summary_header", "Resumen de Compra")}</h4>

                                <div className="checkout-resumen-scroll mb-3">
                                    {carrito.map((item, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                            <div>
                                                <div className="producto-nombre mb-0" style={{ fontSize: "0.88rem" }}>
                                                    {item.nombreProducto || item.nom_prod}
                                                </div>
                                                <small className="text-muted">{t("quantity_short", "Cant:")} {item.cantidad}</small>
                                                {item.requiereSag && (
                                                    <span className="badge bg-danger ms-2 checkout-item-badge">
                                                        {t("exotic_species_badge", "Especie Exótica")}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="fw-bold" style={{ color: "var(--marron)" }}>
                                                ${((item.precio || 0) * (item.cantidad || 1)).toLocaleString("es-CL")}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                    <span className="fw-bold">{t("total_to_pay", "Total a Pagar:")}</span>
                                    <span className="precio" style={{ fontSize: "1.6rem" }}>
                                        ${montoTotal.toLocaleString("es-CL")}
                                    </span>
                                </div>
                            </div>

                            <div className="producto-seccion-bloque">
                                <h4 className="seccion-bloque-titulo mb-3">{t("payment_method_header", "Método de Pago")}</h4>
                                <Form.Select className="mb-3" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                                    <option value="WEBPAY">{t("payment_webpay_option", "💳 Webpay Plus (Transbank)")}</option>
                                </Form.Select>

                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    className="petly-btn w-100 py-3"
                                    disabled={cargando}
                                >
                                    {cargando
                                        ? t("btn_connecting", "Conectando con Transbank...")
                                        : requiereSagGlobal
                                        ? t("btn_submit_sag", "Enviar y Solicitar Validación SAG")
                                        : t("btn_pay_webpay", "Pagar con Webpay Plus")}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
            <FooterComponent />
        </>
    );
};