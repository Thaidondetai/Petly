import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import producto from "../data/producto";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";

function Carro() {

  const [carritoDetallado, setCarritoDetallado] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
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

    localStorage.setItem(
      "carro",
      JSON.stringify(items)

    );

  };

  const actualizarCarrito = () => {
    const carrito = leerCarrito();
    const detallado = carrito
      .map((item) => {

        const productoEncontrado = producto.find(
          (p) => p.id_prod === item.id
        );

        if (!productoEncontrado) {
          return null;
        }

        return {
          ...productoEncontrado,
          cantidad: item.cantidad,
          subtotal:
            productoEncontrado.precio *
            item.cantidad
        };

      }).filter(Boolean);

    setCarritoDetallado(detallado);

    const totalCalc = detallado.reduce((acc, p) => acc + p.subtotal, 0);

    setTotal(totalCalc);
  };

  useEffect(() => {
    actualizarCarrito();
}, []);

  const cambiarCantidad = (id, nuevaCantidad) => {

    if (nuevaCantidad < 1) {
      return;
    }

    const carrito = leerCarrito();
    const actualizado = carrito.map((item) =>

      item.id === id ? {...item, cantidad: nuevaCantidad}: item

    );
    guardarCarrito(actualizado);
    actualizarCarrito();
  };

  const eliminarProducto = (id) => {
    const carrito = leerCarrito().filter((item) => item.id !== id);

    guardarCarrito(carrito);
    actualizarCarrito();

  };

  const comprar = () => {

    if (carritoDetallado.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    alert("Compra realizada correctamente.");
    localStorage.removeItem("carro");
    setCarritoDetallado([]);
    setTotal(0);};

  return (

    <>

      <NavComponent />

      <main className="petly-carrito">
        <Container className="py-5">
          <div className="carrito-header">
            <span className="section-label">
              PETLY
            </span>

            <h1 className="petly-title mb-2">
              Tu carrito
            </h1>

            <p>
              Revisa tus productos antes de comprar.
            </p>
          </div>

          {carritoDetallado.length === 0 ? (
            <div className="carrito-vacio">
              <div className="carrito-vacio-icon">
              </div>

              <p>
                No tienes productos en el carrito.
              </p>

              <Button className="petly-btn" onClick={() => navigate("/")}>
                Ver productos
              </Button>
            </div>
          ) : (
            <>

              {carritoDetallado.map((item) => (

                <div key ={item.id_prod} className="carrito-item">

                  <div className="carrito-producto">
                    <img
                      src={item.url_imagen}
                      alt={item.nom_prod}/>

                    <div>
                      <h5>
                        {item.nom_prod}
                      </h5>

                      <p>
                        ${item.precio.toLocaleString("es-CL")} c/u
                      </p>

                      <strong>
                        Subtotal: $
                        {item.subtotal.toLocaleString("es-CL")}
                      </strong>
                    </div>
                  </div>

                  <div className="carrito-controles">
                    <div className="cantidad-carrito">
                      <Button className="cantidad-btn" onClick={() => cambiarCantidad(
                            item.id_prod,
                            item.cantidad - 1)}>
                        −
                      </Button>

                      <span>
                        {item.cantidad}
                      </span>

                      <Button className="cantidad-btn" onClick={() => cambiarCantidad(
                        item.id_prod, 
                        item.cantidad + 1)}>
                        +
                      </Button>
                    </div>



                    <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(item.id_prod)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}

              <div className="carrito-resumen">

                <h3>
                  Total: ${total.toLocaleString("es-CL")}
                </h3>

                <Button className="petly-btn" onClick={comprar}>
                  Comprar
                </Button>
              </div>

              <Button className="petly-btn-outline mt-3" onClick={() => navigate("/")}>
                Volver al inicio
              </Button>

            </>

          )}
        </Container>
      </main>
      <FooterComponent />
    </>
  );
}

export default Carro;