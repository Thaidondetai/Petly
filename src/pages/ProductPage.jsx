import { useEffect, useState } from "react";
import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";
import InfoProductComponent from "../components/InfoProduct";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { producto: productoState } = location.state || {};
  const [productoDetalle, setProductoDetalle] = useState(productoState || null);
  const [loading, setLoading] = useState(true);

  const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8083";

  useEffect(() => {
    const id = productoState?.idProducto || productoState?.id_prod || productoState?.id;

    if (id) {
      axios
        .get(`${BFF_URL}/api/bff/productos/${id}/detalle`)
        .then((res) => {
          if (!res.data) {
            alert("Este producto ya no se encuentra disponible.");
            navigate("/");
            return;
          }

          setProductoDetalle({
            ...productoState,
            ...res.data,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.warn("No se pudo obtener el detalle remoto del BFF, utilizando datos locales:", err);
          if (productoState) {
            setProductoDetalle(productoState);
          } else {
            alert("El producto fue eliminado o no está disponible.");
            navigate("/");
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [productoState, navigate, BFF_URL]);

  if (loading) {
    return (
      <>
        <NavComponent />
        <main className="container py-5 text-center">
          <p className="petly-subtitle">Cargando detalle del producto...</p>
        </main>
        <FooterComponent />
      </>
    );
  }

  if (!productoDetalle) {
    return (
      <>
        <NavComponent />
        <main className="container py-5 text-center">
          <h1 className="petly-title fs-3">No se encontró el producto.</h1>
          <button className="petly-btn mt-3" onClick={() => navigate("/")}>
            Volver al catálogo
          </button>
        </main>
        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <NavComponent />
      <InfoProductComponent producto={productoDetalle} />
      <FooterComponent />
    </>
  );
}

export default ProductPage;