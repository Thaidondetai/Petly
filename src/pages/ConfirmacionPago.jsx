import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";
import { confirmarPagoWebpay } from "../utils/pedidoutil";

export const ConfirmacionPago = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tokenWs = searchParams.get("token_ws");

    const [estado, setEstado] = useState("PROCESANDO");
    const [datosTransaccion, setDatosTransaccion] = useState(null);
    const [errorMsj, setErrorMsj] = useState("");

    useEffect(() => {
        const procesarConfirmacion = async () => {
            const idPedidoGuardado = sessionStorage.getItem("idPedidoPendiente");

            if (!tokenWs) {
                setEstado("ERROR");
                setErrorMsj(t("error_token_invalid", "La transacción fue cancelada en Webpay o no se recibió un token válido."));
                return;
            }

            try {
                const respuesta = await confirmarPagoWebpay(tokenWs, idPedidoGuardado);

                if (respuesta.response_code === 0) {
                    setEstado("EXITO");
                    setDatosTransaccion(respuesta);

                    localStorage.removeItem("carro");
                    sessionStorage.removeItem("idPedidoPendiente");
                } else {
                    setEstado("ERROR");
                    setErrorMsj(t("error_transaction_rejected", "La transacción fue rechazada por la institución financiera."));
                }
            } catch (err) {
                setEstado("ERROR");
                setErrorMsj(err.message || t("error_transbank_validation", "Error al validar la transacción con Transbank."));
            }
        };

        procesarConfirmacion();
    }, [tokenWs, t]);

    return (
        <>
            <NavComponent />
            <main className="petly-simple-page py-5">
                <Container style={{ maxWidth: "650px" }}>

                    {/* ESTADO 1: PROCESANDO PAGO */}
                    {estado === "PROCESANDO" && (
                        <div className="confirmacion-card text-center py-5">
                            <Spinner animation="border" variant="danger" className="mb-3" style={{ width: "3.5rem", height: "3.5rem" }} />
                            <h3 className="petly-title mb-2">{t("validating_transaction_title", "Validando Transacción...")}</h3>
                            <p className="petly-subtitle">
                                {t("validating_transaction_subtitle", "Estamos confirmando la respuesta de Transbank Webpay. Por favor, no cierres esta pantalla.")}
                            </p>
                        </div>
                    )}

                    {/* ESTADO 2: PAGO EXITOSO */}
                    {estado === "EXITO" && (
                        <div className="confirmacion-card text-center">
                            <div className="confirmacion-icon mb-3">✅</div>
                            <span className="section-label">{t("payment_confirmed_label", "PAGO CONFIRMADO")}</span>
                            <h2 className="petly-title mb-2">{t("thank_you_title", "¡Gracias por tu compra!")}</h2>
                            <p className="petly-subtitle mb-4">
                                {t("order_registered_subtitle", "Hemos registrado tu pedido e iniciado su procesamiento.")}
                            </p>

                            {datosTransaccion && (
                                <div className="confirmacion-detalle-box text-start mb-4">
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                        <span className="spec-label">{t("buy_order_label", "Orden de Compra:")}</span>
                                        <span className="spec-value">{datosTransaccion.buy_order || "N/A"}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                        <span className="spec-label">{t("auth_code_label", "Código Autorización:")}</span>
                                        <span className="spec-value">{datosTransaccion.authorization_code || "N/A"}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                        <span className="spec-label">{t("card_label", "Tarjeta:")}</span>
                                        <span className="spec-value">
                                            **** **** **** {datosTransaccion.card_detail?.card_number || "****"}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="spec-label">{t("amount_paid_label", "Monto Pagado:")}</span>
                                        <span className="fw-bold fs-5" style={{ color: "var(--titulo)" }}>
                                            ${datosTransaccion.amount?.toLocaleString("es-CL")}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-2">
                                <Button className="petly-btn" onClick={() => navigate("/")}>
                                    {t("back_to_catalog_btn", "Volver al Catálogo")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ESTADO 3: PAGO RECHAZADO O CANCELADO */}
                    {estado === "ERROR" && (
                        <div className="confirmacion-card text-center">
                            <div className="confirmacion-icon mb-3">❌</div>
                            <span className="section-label" style={{ color: "var(--titulo)" }}>
                                {t("payment_failed_label", "PAGO NO REALIZADO")}
                            </span>
                            <h2 className="petly-title mb-2">{t("inconvenience_title", "Ocurrió un inconveniente")}</h2>
                            <p className="petly-subtitle text-danger mb-4">{errorMsj}</p>

                            <div className="d-flex justify-content-center gap-2">
                                <Button className="petly-btn" onClick={() => navigate("/checkout")}>
                                    {t("retry_payment_btn", "Reintentar Pago")}
                                </Button>
                                <Button className="petly-btn-outline" onClick={() => navigate("/")}>
                                    {t("back_to_catalog_btn", "Volver al Catálogo")}
                                </Button>
                            </div>
                        </div>
                    )}

                </Container>
            </main>
            <FooterComponent />
        </>
    );
};