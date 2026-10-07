import { useEffect, useState } from "react";
import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";
import InfoProductComponent from "../components/InfoProduct";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

function ProductPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { producto: productoState } = location.state || {};
  const [productoDetalle, setProductoDetalle] = useState(productoState || null);
  const [loading, setLoading] = useState(true);

  const BFF_URL = import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";

  useEffect(() => {
    const id = productoState?.idProducto || productoState?.id_prod || productoState?.id;

    if (id) {
      axios
        .get(`${BFF_URL}/api/bff/productos/${id}/detalle`)
        .then((res) => {
          if (!res.data) {
            alert(t("product_not_found"));
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
            alert(t("product_not_found"));
            navigate("/");
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [productoState, navigate, BFF_URL, t]);

  if (loading) {
    return (
      <>
        <NavComponent />
        <main className="container py-5 text-center">
          <p className="petly-subtitle">{t("loading_product_detail")}</p>
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
          <h1 className="petly-title fs-3">{t("product_not_found")}</h1>
          <button className="petly-btn mt-3" onClick={() => navigate("/")}>
            {t("back_to_catalog")}
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