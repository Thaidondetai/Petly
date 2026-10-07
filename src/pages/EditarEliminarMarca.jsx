import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const getAuthHeaders = () => {
  const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function EditarEliminarMarca() {
  const { t } = useTranslation();
  const [marcas, setMarcas] = useState([]);
  const [marcaEditada, setMarcaEditada] = useState(null);
  const [marcaEliminar, setMarcaEliminar] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const BFF_URL = import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";
  const API_URL = `${BFF_URL}/api/bff/marcas`;

  const cargarMarcas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      setMarcas(res.data);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  const abrirEditar = (marca) => {
    setMarcaEditada({ ...marca });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    const nombre = marcaEditada.nombreMarca || marcaEditada.nombre;
    if (!nombre || nombre.trim() === "") {
      alert(t("brand_alert_empty"));
      return;
    }

    const idMarca = marcaEditada.idMarca || marcaEditada.id;

    try {
      await axios.put(
        `${API_URL}/${idMarca}`,
        {
          nombreMarca: nombre.trim(),
          descripcion: marcaEditada.descripcion?.trim() || "",
        },
        getAuthHeaders()
      );
      alert(t("brand_updated_success"));
      cargarMarcas();
      setMarcaEditada(null);
    } catch (err) {
      console.error("Error al actualizar marca:", err);
      alert("Hubo un error al actualizar la marca.");
    }
  };

  const abrirEliminar = (marca) => {
    setMarcaEliminar({ ...marca });
  };

  const confirmarEliminar = async () => {
    const idMarca = marcaEliminar.idMarca || marcaEliminar.id;
    try {
      await axios.delete(`${API_URL}/${idMarca}`, getAuthHeaders());
      alert(t("brand_deleted_success"));
      cargarMarcas();
      setMarcaEliminar(null);
    } catch (err) {
      console.error("Error al eliminar marca:", err);
      alert("Hubo un error al eliminar la marca.");
    }
  };

  return (
    <div className="petly-simple-page py-5 min-vh-100">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="section-label">{t("products_section")}</span>
            <h1 className="petly-title mb-1 fs-3">{t("manage_brands_title")}</h1>
            <p className="petly-subtitle mb-0">{t("manage_brands_subtitle")}</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="petly-btn py-2 px-3 fw-semibold" onClick={() => navigate("/AgregarMarca")}>
              {t("create_brand_btn")}
            </button>
            <button className="petly-btn-outline py-2 px-3" onClick={() => navigate("/DashboardAdmin")}>
              {t("back_dashboard")}
            </button>
          </div>
        </div>

        <div className="card admin-table-card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>{t("col_id")}</th>
                    <th className="text-start">{t("brand_name_label")}</th>
                    <th className="text-start">{t("brand_desc_label")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {marcas && marcas.length > 0 ? (
                    marcas.map((m) => {
                      const id = m.idMarca || m.id;
                      const nombre = m.nombreMarca || m.nombre;
                      return (
                        <tr key={id}>
                          <td className="text-muted fw-semibold">#{id}</td>
                          <td className="fw-semibold text-start">{nombre}</td>
                          <td className="text-muted text-start small">{m.descripcion || t("no_brand_desc")}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => abrirEditar(m)}
                              >
                                {t("edit")}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => abrirEliminar(m)}
                              >
                                {t("delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        {loading ? (
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">{t("loading")}</span>
                          </div>
                        ) : (
                          <p className="text-muted mb-0">{t("no_brands_registered")}</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {marcaEditada && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={guardarCambios}>
                  <div className="modal-header petly-navbar text-white">
                    <h5 className="modal-title fw-bold">{t("edit")}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setMarcaEditada(null)}></button>
                  </div>
                  <div className="modal-body p-4 text-start">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">{t("brand_name_label")}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marcaEditada.nombreMarca || marcaEditada.nombre || ""}
                        onChange={(e) =>
                          setMarcaEditada({
                            ...marcaEditada,
                            nombreMarca: e.target.value,
                            nombre: e.target.value,
                          })
                        }
                        required
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">{t("brand_desc_label")}</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={marcaEditada.descripcion || ""}
                        onChange={(e) =>
                          setMarcaEditada({ ...marcaEditada, descripcion: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setMarcaEditada(null)}>
                      {t("cancel")}
                    </button>
                    <button type="submit" className="petly-btn py-2 px-3">
                      {t("save_changes")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {marcaEliminar && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">{t("confirm_delete")}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setMarcaEliminar(null)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="mb-1">{t("confirm_delete_brand_msg")}</p>
                  <strong className="d-block fs-5 text-dark mt-2">
                    {marcaEliminar.nombreMarca || marcaEliminar.nombre}
                  </strong>
                  <small className="text-muted">{t("brand_delete_note")}</small>
                </div>
                <div className="modal-footer bg-light justify-content-center">
                  <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setMarcaEliminar(null)}>
                    {t("cancel")}
                  </button>
                  <button type="button" className="btn btn-danger py-2 px-3 fw-bold rounded-3" onClick={confirmarEliminar}>
                    {t("yes_delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}