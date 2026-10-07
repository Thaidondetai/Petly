import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";
import { useTranslation } from "react-i18next";

export default function AgregarCategoria() {
  const { t } = useTranslation();
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { agregarCategoria } = useContext(ProductoContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreCategoria.trim()) {
      alert(t("category_alert_empty"));
      return;
    }

    setCargando(true);

    const nuevaCategoria = {
      nombreCategoria: nombreCategoria.trim(),
    };

    try {
      await agregarCategoria(nuevaCategoria);
      alert(t("category_added_success"));
      
      setNombreCategoria("");
      navigate("/DashboardAdmin");
    } catch (err) {
      console.error("Error al agregar categoría:", err);
      alert("Hubo un error al agregar la categoría. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="petly-simple-page min-vh-100 py-5">
      <div className="container d-flex justify-content-center">
        <div className="login-container" style={{ maxWidth: "480px", width: "100%" }}>
          <span className="section-label">{t("catalog_section")}</span>
          <h2 className="petly-title mb-1 fs-3">{t("new_category_title")}</h2>
          <p className="petly-subtitle mb-4">{t("new_category_subtitle")}</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-4">
              <label className="form-label small fw-semibold">{t("category_name_label")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t("category_placeholder")}
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="petly-btn w-50"
                disabled={cargando}
              >
                {cargando ? t("saving") : t("add")}
              </button>

              <button
                type="button"
                className="petly-btn-outline w-50"
                onClick={() => navigate("/DashboardAdmin")}
              >
                {t("back")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}