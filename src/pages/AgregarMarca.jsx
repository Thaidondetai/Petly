import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";
import { useTranslation } from "react-i18next";

export default function AgregarMarca() {
  const { t } = useTranslation();
  const [nombreMarca, setNombreMarca] = useState("");
  const [descripcionMarca, setDescripcionMarca] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { agregarMarca } = useContext(ProductoContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreMarca.trim()) {
      alert(t("brand_alert_empty"));
      return;
    }

    setCargando(true);

    const nuevaMarca = {
      nombreMarca: nombreMarca.trim(),
      descripcion: descripcionMarca.trim()
    };

    try {
      await agregarMarca(nuevaMarca);
      alert(t("brand_added_success"));
      
      setNombreMarca("");
      setDescripcionMarca("");
      navigate("/DashboardAdmin");
    } catch (err) {
      console.error("Error al agregar marca:", err);
      alert("Hubo un error al agregar la marca. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="petly-simple-page min-vh-100 py-5">
      <div className="container d-flex justify-content-center">
        <div className="login-container" style={{ maxWidth: "480px", width: "100%" }}>
          <span className="section-label">{t("catalog_section")}</span>
          <h2 className="petly-title mb-1 fs-3">{t("new_brand_title")}</h2>
          <p className="petly-subtitle mb-4">{t("new_brand_subtitle")}</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-4">
              <label className="form-label small fw-semibold">{t("brand_name_label")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t("brand_placeholder")}
                value={nombreMarca}
                onChange={(e) => setNombreMarca(e.target.value)}
                required
                autoFocus
              />
              <label className="form-label small fw-semibold mt-3">{t("brand_desc_label")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t("brand_desc_placeholder")}
                value={descripcionMarca}
                onChange={(e) => setDescripcionMarca(e.target.value)}
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