import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";
import { useTranslation } from "react-i18next";

export default function EditarEliminarCategoria() {
  const { t } = useTranslation();
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);

  const navigate = useNavigate();
  const { categorias, loading, cargarCategorias, eliminarCategoria } = useContext(ProductoContext);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const abrirEditar = (categoria) => {
    setCategoriaEditada({ ...categoria });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    const nombre = categoriaEditada.nombreCategoria || categoriaEditada.nombre;
    if (!nombre || nombre.trim() === "") {
      alert(t("category_alert_empty"));
      return;
    }

    const id = categoriaEditada.idCategoria || categoriaEditada.id;
    const BFF_URL = import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";
    
    const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");

    try {
      const response = await fetch(`${BFF_URL}/api/bff/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ nombreCategoria: nombre.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      alert(t("category_updated_success"));
      cargarCategorias();
      setCategoriaEditada(null);
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      alert("Hubo un error al actualizar la categoría.");
    }
  };

  const abrirEliminar = (categoria) => {
    setCategoriaEliminar({ ...categoria });
  };

  const confirmarEliminar = async () => {
    const id = categoriaEliminar.idCategoria || categoriaEliminar.id;
    try {
      await eliminarCategoria(id);
      alert(t("category_deleted_success"));
      setCategoriaEliminar(null);
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("Hubo un error al eliminar la categoría.");
    }
  };

  return (
    <div className="petly-simple-page py-5 min-vh-100">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="section-label">{t("catalog_section")}</span>
            <h1 className="petly-title mb-1 fs-3">{t("manage_categories_title")}</h1>
            <p className="petly-subtitle mb-0">{t("manage_categories_subtitle")}</p>
          </div>
          <button className="petly-btn-outline" onClick={() => navigate("/DashboardAdmin")}>
            {t("back_dashboard")}
          </button>
        </div>

        <div className="card admin-table-card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>{t("col_id")}</th>
                    <th className="text-start">{t("category_name_label")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias && categorias.length > 0 ? (
                    categorias.map((c) => {
                      const id = c.idCategoria || c.id;
                      const nombre = c.nombreCategoria || c.nombre;
                      return (
                        <tr key={id}>
                          <td className="text-muted fw-semibold">#{id}</td>
                          <td className="fw-semibold text-start">{nombre}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => abrirEditar(c)}
                              >
                                {t("edit")}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => abrirEliminar(c)}
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
                      <td colSpan="3" className="text-center py-4">
                        {loading ? (
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">{t("loading")}</span>
                          </div>
                        ) : (
                          <p className="text-muted mb-0">{t("no_categories_registered")}</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {categoriaEditada && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={guardarCambios}>
                  <div className="modal-header petly-navbar text-white">
                    <h5 className="modal-title fw-bold">{t("edit")}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setCategoriaEditada(null)}></button>
                  </div>
                  <div className="modal-body p-4 text-start">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">{t("category_name_label")}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={categoriaEditada.nombreCategoria || categoriaEditada.nombre || ""}
                        onChange={(e) =>
                          setCategoriaEditada({ ...categoriaEditada, nombreCategoria: e.target.value, nombre: e.target.value })
                        }
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setCategoriaEditada(null)}>
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

        {categoriaEliminar && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">{t("confirm_delete")}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setCategoriaEliminar(null)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="mb-1">{t("confirm_delete_category_msg")}</p>
                  <strong className="d-block fs-5 text-dark mt-2">
                    {categoriaEliminar.nombreCategoria || categoriaEliminar.nombre}
                  </strong>
                  <small className="text-muted">{t("category_delete_note")}</small>
                </div>
                <div className="modal-footer bg-light justify-content-center">
                  <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setCategoriaEliminar(null)}>
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