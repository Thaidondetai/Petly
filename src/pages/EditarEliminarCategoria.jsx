import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function EditarEliminarCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_URL = "http://34.193.229.170:8080/api/v1/categorias";

  // Cargar categorías desde la API
  
  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Abrir modal de edición
  const abrirEditar = (categoria) => {
    setCategoriaEditada({ ...categoria });
  };

  // Guardar cambios al editar
  const guardarCambios = async (e) => {
    e.preventDefault();

    if (!categoriaEditada.nombre || categoriaEditada.nombre.trim() === "") {
      alert("Debes ingresar un nombre para la categoría.");
      return;
    }

    try {
      await axios.put(`${API_URL}/${categoriaEditada.id}`, {
        nombre: categoriaEditada.nombre.trim(),
      });
      alert("¡Categoría actualizada exitosamente!");
      cargarCategorias();
      setCategoriaEditada(null);
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      alert("Hubo un error al actualizar la categoría.");
    }
  };

  // Abrir modal de eliminación
  const abrirEliminar = (categoria) => {
    setCategoriaEliminar({ ...categoria });
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    try {
      await axios.delete(`${API_URL}/${categoriaEliminar.id}`);
      alert("Categoría eliminada exitosamente.");
      cargarCategorias();
      setCategoriaEliminar(null);
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("Hubo un error al eliminar la categoría.");
    }
  };

  return (
    <div className="petly-simple-page py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="section-label">CATÁLOGO</span>
            <h1 className="petly-title mb-1">Gestión de Categorías 🏷️</h1>
            <p className="petly-subtitle mb-0">Edita o elimina categorías del catálogo</p>
          </div>
          <button className="petly-btn-outline" onClick={() => navigate("/DashboardAdmin")}>
            ⬅ Volver al Dashboard
          </button>
        </div>

        {/* Tabla de Categorías */}
        <div className="card admin-table-card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className="text-start">Nombre de Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias && categorias.length > 0 ? (
                    categorias.map((c) => (
                      <tr key={c.id}>
                        <td className="text-muted fw-semibold">#{c.id}</td>
                        <td className="fw-semibold text-start">{c.nombre}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => abrirEditar(c)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => abrirEliminar(c)}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        {loading ? (
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Cargando categorías...</span>
                          </div>
                        ) : (
                          <p className="text-muted mb-0">No hay categorías registradas en el catálogo.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de Edición */}
        {categoriaEditada && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={guardarCambios}>
                  <div className="modal-header petly-navbar text-white">
                    <h5 className="modal-title fw-bold">✏️ Editar Categoría</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setCategoriaEditada(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4 text-start">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Nombre de la Categoría</label>
                      <input
                        type="text"
                        className="form-control"
                        value={categoriaEditada.nombre || ""}
                        onChange={(e) =>
                          setCategoriaEditada({ ...categoriaEditada, nombre: e.target.value })
                        }
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button
                      type="button"
                      className="petly-btn-outline py-2 px-3"
                      onClick={() => setCategoriaEditada(null)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="petly-btn py-2 px-3">
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Eliminación */}
        {categoriaEliminar && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">🗑️ Confirmar Eliminación</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setCategoriaEliminar(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="mb-1">¿Estás seguro de que deseas eliminar esta categoría?</p>
                  <strong className="d-block fs-5 text-dark mt-2">{categoriaEliminar.nombre}</strong>
                  <small className="text-muted">Los productos asociados a esta categoría podrían quedar sin clasificación.</small>
                </div>
                <div className="modal-footer bg-light justify-content-center">
                  <button
                    type="button"
                    className="petly-btn-outline py-2 px-3"
                    onClick={() => setCategoriaEliminar(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger py-2 px-3 fw-bold rounded-3"
                    onClick={confirmarEliminar}
                  >
                    Sí, eliminar
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