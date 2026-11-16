import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";
import { useCurrency } from "../context/CurrencyContext";
import { procesarPagoWebpay } from "../utils/pedidoutil";
import { useTranslation } from "react-i18next";

export function Checkout() {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [datosEnvio, setDatosEnvio] = useState({
        nombreReceptor: "",
        rutReceptor: "",
        telefono: "",
        region: "",
        comuna: "",
        direccionCompleta: "",
        indicacionesAdicionales: ""
    });

    const [permisoSag, setPermisoSag] = useState("");

    useEffect(() => {
        const verificarCarritoYEspecies = async () => {
        try {
            const data = localStorage.getItem("carro");
            const parsed = JSON.parse(data) || [];
            if (!Array.isArray(parsed) || parsed.length === 0) {
            navigate("/Carro");
            return;
            }

            const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8083";
            const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const carritoEnriquecido = await Promise.all(
            parsed.map(async (item) => {
                const idProd = item.idProducto || item.id;
                try {
                const res = await fetch(`${BFF_URL}/api/bff/productos/${idProd}/detalle`, { headers });
                if (res.ok) {
                    const prodBackend = await res.json();
                    const especieBackend = prodBackend.idEspecie || prodBackend.id_especie || item.idEspecie || item.id_especie;
                    return {
                    ...item,
                    ...prodBackend,
                    idEspecie: especieBackend,
                    requiereSag: prodBackend.requiereSag || prodBackend.requiere_sag || parseInt(especieBackend, 10) === 3,
                    sagValidated: prodBackend.sagValidated ?? false
                    };
                }
                } catch (e) {
                console.error("Error obteniendo detalle del producto:", e);
                }
                return item;
            })
            );

            setCarrito(carritoEnriquecido);
        } catch (e) {
            console.error("Error leyendo carrito:", e);
            navigate("/Carro");
        }
        };

        verificarCarritoYEspecies();
    }, [navigate]);

    const requiereSagGlobal = carrito.some((item) => {
        const idEspecieNum = parseInt(item.idEspecie || item.id_especie || item.especieId, 10);
        return item.requiereSag === true || item.requiere_sag === true || idEspecieNum === 3;
    });

    const totalCalculado = carrito.reduce((acc, item) => {
        const precio = parseFloat(item.precio || 0);
        const cantidad = parseInt(item.cantidad || 1, 10);
        return acc + precio * cantidad;
    }, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosEnvio((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handlePagar = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");
        if (!token) {
        alert(t("login_required_buy") || "Debes iniciar sesión para realizar la compra.");
        navigate("/Login");
        return;
        }

        // Validación estricta de aprobación SAG por el administrador
        const productoExoticoSinAprobar = carrito.find(item => {
            const idEspecieNum = parseInt(item.idEspecie || item.id_especie || item.especieId, 10);
            const esExotico = item.requiereSag === true || item.requiere_sag === true || idEspecieNum === 3;
            return esExotico && !item.sagValidated;
        });

        if (productoExoticoSinAprobar) {
            setErrorMsg(`El producto "${productoExoticoSinAprobar.nombreProducto || productoExoticoSinAprobar.nombre}" requiere validación y aprobación SAG por parte del administrador.`);
            return;
        }

        if (requiereSagGlobal && !permisoSag.trim()) {
        setErrorMsg("Debes ingresar el número de permiso o registro SAG para productos de especie exótica.");
        return;
        }

        setLoading(true);

        try {
        await procesarPagoWebpay(carrito, totalCalculado, {
            ...datosEnvio,
            permisoSag: requiereSagGlobal ? permisoSag.trim() : null
        });
        } catch (err) {
        console.error("Error iniciando pago Webpay:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            setErrorMsg("Tu sesión ha expirado o no tienes permisos. Por favor vuelve a iniciar sesión.");
        } else {
            const detalle = err.response?.data?.mensaje || err.response?.data?.error || err.message;
            setErrorMsg(`No se pudo iniciar el pago: ${detalle}`);
        }
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
        <NavComponent />
        <main className="petly-simple-page py-5">
            <Container>
            {errorMsg && (
                <Alert variant="danger" className="mb-4">
                {errorMsg}
                </Alert>
            )}

            <Form onSubmit={handlePagar}>
                <Row className="g-4">
                <Col lg={7}>
                    <Card className="p-4 border-0 shadow-sm rounded-3">
                    <h4 className="fw-bold mb-4" style={{ color: "#8B0000" }}>
                        Datos de Despacho
                    </h4>

                    <Row className="g-3">
                        <Col md={12}>
                        <Form.Group controlId="nombreReceptor">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            NOMBRE COMPLETO RECEPTOR *
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="nombreReceptor"
                            required
                            value={datosEnvio.nombreReceptor}
                            onChange={handleInputChange}
                            placeholder="Thais Caamaño"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={6}>
                        <Form.Group controlId="rutReceptor">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            RUT RECEPTOR *
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="rutReceptor"
                            required
                            value={datosEnvio.rutReceptor}
                            onChange={handleInputChange}
                            placeholder="Ej: 12345678-9"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={6}>
                        <Form.Group controlId="telefono">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            TELÉFONO *
                            </Form.Label>
                            <Form.Control
                            type="tel"
                            name="telefono"
                            required
                            value={datosEnvio.telefono}
                            onChange={handleInputChange}
                            placeholder="+56912345678"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={6}>
                        <Form.Group controlId="region">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            REGIÓN *
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="region"
                            required
                            value={datosEnvio.region}
                            onChange={handleInputChange}
                            placeholder="Valparaíso"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={6}>
                        <Form.Group controlId="comuna">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            COMUNA *
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="comuna"
                            required
                            value={datosEnvio.comuna}
                            onChange={handleInputChange}
                            placeholder="La Ligua"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={12}>
                        <Form.Group controlId="direccionCompleta">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            DIRECCIÓN COMPLETA *
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="direccionCompleta"
                            required
                            value={datosEnvio.direccionCompleta}
                            onChange={handleInputChange}
                            placeholder="Calle, Número, Depto/Casa"
                            />
                        </Form.Group>
                        </Col>

                        <Col md={12}>
                        <Form.Group controlId="indicacionesAdicionales">
                            <Form.Label className="small fw-bold text-uppercase text-secondary">
                            INDICACIONES ADICIONALES
                            </Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={2}
                            name="indicacionesAdicionales"
                            value={datosEnvio.indicacionesAdicionales}
                            onChange={handleInputChange}
                            placeholder="Ej: Dejar con conserje, llamar al llegar..."
                            />
                        </Form.Group>
                        </Col>

                        {requiereSagGlobal && (
                        <Col md={12}>
                            <div className="alert alert-warning p-3 mt-3 rounded-3 shadow-sm border-warning">
                            <h6 className="fw-bold mb-2 text-dark">
                                ⚠️ Declaración SAG Requerida (Especie Exótica)
                            </h6>
                            <p className="small mb-2 text-muted">
                                Uno o más productos en tu carrito corresponden a especies exóticas. Debes ingresar tu número de permiso o registro SAG.
                            </p>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Ingrese N° de Permiso SAG / Registro Exótico"
                                value={permisoSag}
                                onChange={(e) => setPermisoSag(e.target.value)}
                            />
                            </div>
                        </Col>
                        )}
                    </Row>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="p-4 border-0 shadow-sm rounded-3 mb-4">
                    <h5 className="fw-bold mb-3" style={{ color: "#8B0000" }}>
                        Resumen de Compra
                    </h5>

                    <div className="mb-3">
                        {carrito.map((item, index) => {
                        const id = item.idProducto || item.id || index;
                        const subtotal = (item.precio || 0) * (item.cantidad || 1);
                        return (
                            <div key={id} className="mb-3 pb-2 border-bottom">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                <div className="fw-bold small">{item.nombreProducto || item.nom_prod || "Producto"}</div>
                                <div className="text-muted small">Cant: {item.cantidad}</div>
                                </div>
                                <div className="fw-bold text-dark">{formatPrice(subtotal)}</div>
                            </div>
                            </div>
                        );
                        })}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 fs-5 fw-bold">
                        <span>Total a Pagar:</span>
                        <span className="text-danger fs-4">{formatPrice(totalCalculado)}</span>
                    </div>
                    </Card>

                    <Card className="p-4 border-0 shadow-sm rounded-3">
                    <h5 className="fw-bold mb-3" style={{ color: "#8B0000" }}>
                        Método de Pago
                    </h5>

                    <div className="p-3 mb-4 rounded-3 border d-flex align-items-center bg-light">
                        <span className="fs-5 me-2">💳</span>
                        <span className="fw-semibold text-dark">Webpay Plus (Transbank)</span>
                    </div>

                    <Button
                        type="submit"
                        className="petly-btn w-100 py-2 fs-6 fw-bold"
                        style={{ backgroundColor: "#C86414", borderColor: "#C86414" }}
                        disabled={loading}
                    >
                        {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Procesando...
                        </>
                        ) : (
                        "Pagar con Webpay Plus"
                        )}
                    </Button>
                    </Card>
                </Col>
                </Row>
            </Form>
            </Container>
        </main>
        <FooterComponent />
        </>
    );
}

export default Checkout;