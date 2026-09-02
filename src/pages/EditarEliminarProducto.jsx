import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";

export default function EditarEliminarProducto() {
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const navigate = useNavigate();
  
  const { productos, loading, cargarProductos, actualizarProducto, eliminarProducto } =
    useContext(ProductoContext);

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirEditar = (producto) => {
    setProductoEditado({ ...producto });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    if (!productoEditado.nombre || productoEditado.nombre.trim() === "") {
      alert("Debes ingresar un nombre al producto");
      return;
    }

    if (!productoEditado.descripcion || productoEditado.descripcion.trim() === "") {
      alert("La descripción no puede estar vacía.");
      return;
    }

    if (!productoEditado.precio || Number(productoEditado.precio) <= 0) {
      alert("Debes ingresar un precio mayor a 0");
      return;
    }

    if (!productoEditado.imagen || productoEditado.imagen.trim() === "") {
      alert("Debes ingresar una URL o nombre de imagen válido.");
      return;
    }

    const payload = {
      ...productoEditado,
      id_especie: parseInt(productoEditado.id_especie, 10),
      id_marca: parseInt(productoEditado.id_marca, 10),
      id_categoria: parseInt(productoEditado.id_categoria, 10),
      precio: parseFloat(productoEditado.precio),
      stock: parseInt(productoEditado.stock, 10),
    };

    try {
      await actualizarProducto(payload);
      alert("¡Producto actualizado exitosamente!");
      cargarProductos();
      setProductoEditado(null);
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("Error al actualizar el producto.");
    }
  };

  const abrirEliminar = (producto) => {
    setProductoEliminar({ ...producto });
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarProducto(productoEliminar.id);
      alert("Producto eliminado exitosamente.");
      cargarProductos();
      setProductoEliminar(null);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al confirmar eliminar producto.");
    }
  };

  return (
    <div className="petly-simple-page py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="section-label">ADMINISTRACIÓN</span>
            <h1 className="petly-title mb-1">Gestión de Productos 🐾</h1>
            <p className="petly-subtitle mb-0">Edita o elimina productos del catálogo de Petly</p>
          </div>
          <button className="petly-btn-outline" onClick={() => navigate("/DashboardAdmin")}>
            ⬅ Volver al Dashboard
          </button>
        </div>

        {/* Tabla de Productos */}
        <div className="card admin-table-card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Especie</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos && productos.length > 0 ? (
                    productos.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            width="50"
                            height="50"
                            className="rounded object-fit-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50?text=No+Img";
                            }}
                          />
                        </td>
                        <td className="fw-semibold text-start">{p.nombre}</td>
                        <td>
                          {p.id_especie === 1 ? "🐶 Perro" : p.id_especie === 2 ? "🐱 Gato" : "🦜 Exótico"}
                        </td>
                        <td className="text-success fw-bold">${Number(p.precio).toLocaleString("es-CL")}</td>
                        <td>{p.stock}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => abrirEditar(p)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => abrirEliminar(p)}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        {loading ? (
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Cargando productos...</span>
                          </div>
                        ) : (
                          <p className="text-muted mb-0">No hay productos registrados en el catálogo.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de Editar */}
        {productoEditado && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={guardarCambios}>
                  <div className="modal-header petly-navbar text-white">
                    <h5 className="modal-title fw-bold">✏️ Editar Producto</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setProductoEditado(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4 text-start">
                    <div className="row g-3">
                      {/* Nombre */}
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Nombre del Producto</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productoEditado.nombre || ""}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, nombre: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Especie */}
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Especie</label>
                        <select
                          className="form-select"
                          value={productoEditado.id_especie || "1"}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, id_especie: e.target.value })
                          }
                          required
                        >
                          <option value="1">1: Perro 🐶</option>
                          <option value="2">2: Gato 🐱</option>
                          <option value="3">3: Exótico 🦜</option>
                        </select>
                      </div>

                      {/* Precio */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Precio ($ CLP)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productoEditado.precio || ""}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, precio: e.target.value })
                          }
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      {/* Stock */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productoEditado.stock || ""}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, stock: e.target.value })
                          }
                          min="0"
                          required
                        />
                      </div>

                      {/* Marca */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Marca</label>
                        <select
                          className="form-select"
                          value={productoEditado.id_marca || "1"}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, id_marca: e.target.value })
                          }
                          required
                        >
                          <option value="1">1: Marca A</option>
                          <option value="2">2: Marca B</option>
                          <option value="3">3: Marca C</option>
                        </select>
                      </div>

                      {/* Categoría */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Categoría</label>
                        <select
                          className="form-select"
                          value={productoEditado.id_categoria || "1"}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, id_categoria: e.target.value })
                          }
                          required
                        >
                          <option value="1">1: Comida</option>
                          <option value="2">2: Juguetes</option>
                          <option value="3">3: Accesorios</option>
                        </select>
                      </div>

                      {/* Imagen */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold">URL o Nombre de la Imagen</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productoEditado.imagen || ""}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, imagen: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Descripción */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Descripción</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={productoEditado.descripcion || ""}
                          onChange={(e) =>
                            setProductoEditado({ ...productoEditado, descripcion: e.target.value })
                          }
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button
                      type="button"
                      className="petly-btn-outline py-2 px-3"
                      onClick={() => setProductoEditado(null)}
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

        {/* Modal de Eliminar */}
        {productoEliminar && (
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
                    onClick={() => setProductoEliminar(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="mb-1">¿Estás seguro de que deseas eliminar este producto?</p>
                  <strong className="d-block fs-5 text-dark mt-2">{productoEliminar.nombre}</strong>
                  <small className="text-muted">Esta acción no se puede deshacer.</small>
                </div>
                <div className="modal-footer bg-light justify-content-center">
                  <button
                    type="button"
                    className="petly-btn-outline py-2 px-3"
                    onClick={() => setProductoEliminar(null)}
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