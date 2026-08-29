import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";
import InfoProductComponent from "../components/InfoProduct";
import { useLocation } from "react-router-dom";

function ProductPage() {
  const location = useLocation();
  const { producto } = location.state || {};

  if (!producto) {
    return (
      <>
        <NavComponent />

        <main className="container py-5 producto-no-encontrado">
          <h1 className="petly-title">
            No se encontró el producto.
          </h1>
        </main>

        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <NavComponent />
      <InfoProductComponent producto={producto} />
      <FooterComponent />
    </>
  );
}

export default ProductPage;