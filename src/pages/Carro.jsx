import { useState, useEffect, useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";
import { ProductoContext } from "../context/ProductoContext";
import { DEFAULT_IMAGE, handleImageError } from "../utils/constants";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

function Carro() {
  const [carritoDetallado, setCarritoDetallado] = useState([]);
  const [total, setTotal] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();
  const { cargarProductos } = useContext(ProductoContext);

  const leerCarrito = () => {
    try {
      const data = localStorage.getItem("carro");
      const parsed = JSON.parse(data) || [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const guardarCarrito = (items) => {
    localStorage.setItem("carro", JSON.stringify(items));
  };

  const actualizarCarrito = async () => {
    const carrito = leerCarrito();
    if (carrito.length === 0) {
      setCarritoDetallado([]);
      setTotal(0);
      return;
    }

    const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8083";
    const carritoValido = [];
    let huboEliminados = false;

    for (const item of carrito) {
      const idProd = item.idProducto || item.id;
      try {
        const res = await axios.get(`${BFF_URL}/api/bff/productos/${idProd}/detalle`);
        if (res.data && (res.data.idProducto || res.data.id)) {
          carritoValido.push(item);
        } else {
          huboEliminados = true;
        }
      } catch {
        huboEliminados = true;
      }
    }

    if (huboEliminados) {
      alert("Algunos productos de tu carrito fueron removidos porque ya no están disponibles en la tienda.");
      guardarCarrito(carritoValido);
    }

    const detallado = carritoValido.map((item) => ({
      ...item,
      subtotal: item.precio * item.cantidad
    }));

    setCarritoDetallado(detallado);
    const totalCalc = detallado.reduce((acc, p) => acc + p.subtotal, 0);
    setTotal(totalCalc);
  };

  useEffect(() => {
    actualizarCarrito();
  }, []);

  const cambiarCantidad = (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const carrito = leerCarrito();
    const productoActual = carrito.find((p) => (p.idProducto || p.id) === idProducto);

    if (productoActual && nuevaCantidad > productoActual.stockDisponible) {
      alert(`No puedes agregar más unidades. El stock disponible es de ${productoActual.stockDisponible}.`);
      return;
    }

    const actualizado = carrito.map((item) =>
      (item.idProducto || item.id) === idProducto ? {...item, cantidad: nuevaCantidad}: item
    );
    guardarCarrito(actualizado);
    
    const detallado = actualizado.map((item) => ({
      ...item,
      subtotal: item.precio * item.cantidad
    }));
    setCarritoDetallado(detallado);
    setTotal(detallado.reduce((acc, p) => acc + p.subtotal, 0));
  };

  const eliminarProducto = (idProducto) => {
    const carrito = leerCarrito().filter((item) => (item.idProducto || item.id) !== idProducto);
    guardarCarrito(carrito);
    
    const detallado = carrito.map((item) => ({
      ...item,
      subtotal: item.precio * item.cantidad
    }));
    setCarritoDetallado(detallado);
    setTotal(detallado.reduce((acc, p) => acc + p.subtotal, 0));
  };

  const comprar = async () => {
    if (carritoDetallado.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/Login");
      return;
    }

    setProcesando(true);
    const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8083";

    try {
      for (const item of carritoDetallado) {
        const idProd = item.idProducto || item.id;
        const res = await axios.get(`${BFF_URL}/api/bff/productos/${idProd}/detalle`);
        const productoBackend = res.data;

        if (productoBackend.stock < item.cantidad) {
          alert(`La compra falló: El producto "${item.nombreProducto || item.nom_prod}" solo cuenta con ${productoBackend.stock} unidades en stock.`);
          setProcesando(false);
          return;
        }

        const payloadDescuento = {
          idProducto: parseInt(idProd, 10),
          nombreProducto: productoBackend.nombreProducto || item.nombreProducto || "Producto",
          precio: parseFloat(productoBackend.precio || item.precio),
          stock: parseInt(productoBackend.stock - item.cantidad, 10),
          descripcion: productoBackend.descripcion || item.descripcion || "Sin descripción",
          urlImagen: productoBackend.urlImagen || item.urlImagen || "",
          idMarca: productoBackend.idMarca ? parseInt(productoBackend.idMarca, 10) : null,
          idCategoria: productoBackend.idCategoria ? parseInt(productoBackend.idCategoria, 10) : null,
          idEspecie: parseInt(productoBackend.idEspecie || item.idEspecie || 1, 10)
        };

        await axios.put(
          `${BFF_URL}/api/bff/productos/${idProd}/descontar-stock`,
          payloadDescuento,
          getAuthHeaders()
        );
      }

      alert("🎉 ¡Compra realizada con éxito! El stock ha sido actualizado en la tienda.");
      localStorage.removeItem("carro");
      setCarritoDetallado([]);
      setTotal(0);

      await cargarProductos();
    } catch (error) {
      console.error("Error procesando compra:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Tu sesión ha expirado o no tienes permisos para realizar la compra. Inicia sesión nuevamente.");
      } else {
        alert("Ocurrió un error al procesar la compra en el servidor.");
      }
    } finally {
      setProcesando(false);
    }
  };

  return (
    <>
      <NavComponent />
      <main className="petly-simple-page py-5">
        <Container>
          <div className="mb-4">
            <span className="section-label">PETLY</span>
            <h1 className="petly-title mb-1">Tu carrito</h1>
            <p className="petly-subtitle">Revisa tus productos antes de comprar.</p>
          </div>

          {carritoDetallado.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <p className="petly-subtitle mb-3">No tienes productos en el carrito.</p>
              <div>
                <Button className="petly-btn" onClick={() => navigate("/")}>
                  Ver productos
                </Button>
              </div>
            </div>
          ) : (
            <>
              {carritoDetallado.map((item) => {
                const id = item.idProducto || item.id;
                return (
                  <div key={id} className="card p-3 mb-3 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.urlImagen || item.url_imagen || DEFAULT_IMAGE}
                          alt={item.nombreProducto || item.nom_prod}
                          className="admin-prod-thumb"
                          style={{ width: "70px", height: "70px" }}
                          onError={handleImageError}
                        />
                        <div>
                          <h5 className="mb-1 fw-bold fs-6">{item.nombreProducto || item.nom_prod}</h5>
                          <p className="text-muted small mb-1">${item.precio?.toLocaleString("es-CL")} c/u</p>
                          <strong className="text-danger small">Subtotal: ${item.subtotal?.toLocaleString("es-CL")}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3">
                        <div className="cantidad-selector m-0">
                          <button type="button" onClick={() => cambiarCantidad(id, item.cantidad - 1)}>−</button>
                          <input type="number" value={item.cantidad} readOnly />
                          <button type="button" onClick={() => cambiarCantidad(id, item.cantidad + 1)}>+</button>
                        </div>

                        <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(id)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="card p-4 mt-4 border-0 shadow-sm d-flex flex-row justify-content-between align-items-center" style={{ borderRadius: "12px" }}>
                <h3 className="petly-title fs-4 mb-0">Total: ${total.toLocaleString("es-CL")}</h3>
                <Button className="petly-btn" onClick={comprar} disabled={procesando}>
                  {procesando ? "Procesando..." : "Comprar"}
                </Button>
              </div>

              <div className="mt-3">
                <Button className="petly-btn-outline" onClick={() => navigate("/")}>
                  Volver al inicio
                </Button>
              </div>
            </>
          )}
        </Container>
      </main>
      <FooterComponent />
    </>
  );
}

export default Carro;