import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";
import { DEFAULT_IMAGE, handleImageError } from "../utils/constants";

export default function EditarEliminarProducto() {
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const navigate = useNavigate();

  const { productos, categorias, marcas, loading, actualizarProducto, eliminarProducto } =
    useContext(ProductoContext);

  const abrirEditar = (producto) => {
    setProductoEditado({
      ...producto,
      idMarca: producto.idMarca || producto.id_marca || "",
      idCategoria: producto.idCategoria || producto.id_categoria || ""
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    const nombre = productoEditado.nombreProducto || productoEditado.nombre;
    if (!nombre || nombre.trim() === "") {
      alert("Debes ingresar un nombre al producto.");
      return;
    }

    const id = productoEditado.idProducto || productoEditado.id_prod || productoEditado.id;

    const payload = {
      id: id,
      idProducto: id,
      nombreProducto: nombre.trim(),
      descripcion: (productoEditado.descripcion || "").trim(),
      idEspecie: parseInt(productoEditado.idEspecie || productoEditado.id_especie || 1, 10),
      idMarca: productoEditado.idMarca ? parseInt(productoEditado.idMarca, 10) : null,
      idCategoria: productoEditado.idCategoria ? parseInt(productoEditado.idCategoria, 10) : null,
      precio: parseFloat(productoEditado.precio),
      stock: parseInt(productoEditado.stock, 10),
      urlImagen: (productoEditado.urlImagen || productoEditado.imagen || "").trim()
    };

    try {
      await actualizarProducto(payload);
      alert("¡Producto actualizado exitosamente!");
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
    const id = productoEliminar.idProducto || productoEliminar.id_prod || productoEliminar.id;
    try {
      await eliminarProducto(id);
      alert("Producto eliminado exitosamente.");
      setProductoEliminar(null);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al confirmar eliminar producto.");
    }
  };

  return (
    <div className="petly-simple-page py-5 min-vh-100">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="section-label">ADMINISTRACIÓN</span>
            <h1 className="petly-title mb-1 fs-3">Gestión de Productos 🐾</h1>
            <p className="petly-subtitle mb-0">Edita o elimina productos del catálogo de Petly</p>
          </div>
          <button className="petly-btn-outline" onClick={() => navigate("/DashboardAdmin")}>
            ⬅ Volver al Dashboard
          </button>
        </div>

        <div className="card admin-table-card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th className="text-start">Nombre</th>
                    <th>Especie</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos && productos.length > 0 ? (
                    productos.map((p) => {
                      const id = p.idProducto || p.id_prod || p.id;
                      const nombre = p.nombreProducto || p.nom_prod || p.nombre;
                      const imagen = p.urlImagen || p.url_imagen || p.imagen;
                      const idEspecie = p.idEspecie || p.id_especie;

                      return (
                        <tr key={id}>
                          <td>
                            <img
                              src={imagen || DEFAULT_IMAGE}
                              alt={nombre}
                              className="admin-prod-thumb"
                              onError={handleImageError}
                            />
                          </td>
                          <td className="fw-semibold text-start">{nombre}</td>
                          <td>
                            {idEspecie === 1 ? "🐶 Perro" : idEspecie === 2 ? "🐱 Gato" : "🦜 Exótico"}
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
                      );
                    })
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

        {/* Modal Editar */}
        {productoEditado && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={guardarCambios}>
                  <div className="modal-header petly-navbar text-white">
                    <h5 className="modal-title fw-bold">✏️ Editar Producto</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setProductoEditado(null)}></button>
                  </div>
                  <div className="modal-body p-4 text-start">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Nombre del Producto</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productoEditado.nombreProducto || productoEditado.nombre || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, nombreProducto: e.target.value, nombre: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Especie</label>
                        <select
                          className="form-select"
                          value={productoEditado.idEspecie || productoEditado.id_especie || 1}
                          onChange={(e) => setProductoEditado({ ...productoEditado, idEspecie: e.target.value, id_especie: e.target.value })}
                          required
                        >
                          <option value="1">1: Perro 🐶</option>
                          <option value="2">2: Gato 🐱</option>
                          <option value="3">3: Exótico 🦜</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Precio ($ CLP)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productoEditado.precio || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, precio: e.target.value })}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          value={productoEditado.stock || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, stock: e.target.value })}
                          min="0"
                          required
                        />
                      </div>

                      {/* Selector de Marcas */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Marca</label>
                        <select
                          className="form-select"
                          value={productoEditado.idMarca || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, idMarca: e.target.value })}
                        >
                          <option value="">Sin marca</option>
                          {marcas && marcas.map((m) => {
                            const id = m.idMarca || m.id_marca || m.id;
                            const nombre = m.nombreMarca || m.nom_marca || m.nombre;
                            return (
                              <option key={id} value={id}>
                                {nombre}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Selector de Categorías */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Categoría</label>
                        <select
                          className="form-select"
                          value={productoEditado.idCategoria || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, idCategoria: e.target.value })}
                        >
                          <option value="">Sin categoría</option>
                          {categorias && categorias.map((cat) => {
                            const id = cat.idCategoria || cat.id_categoria || cat.id;
                            const nombre = cat.nombreCategoria || cat.nom_cat || cat.nombre;
                            return (
                              <option key={id} value={id}>
                                {nombre}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">URL de la Imagen</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productoEditado.urlImagen || productoEditado.url_imagen || productoEditado.imagen || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, urlImagen: e.target.value, url_imagen: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Descripción</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={productoEditado.descripcion || productoEditado.desc_prod || ""}
                          onChange={(e) => setProductoEditado({ ...productoEditado, descripcion: e.target.value, desc_prod: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setProductoEditado(null)}>Cancelar</button>
                    <button type="submit" className="petly-btn py-2 px-3">Guardar cambios</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {productoEliminar && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">🗑️ Confirmar Eliminación</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setProductoEliminar(null)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="mb-1">¿Estás seguro de que deseas eliminar este producto?</p>
                  <strong className="d-block fs-5 text-dark mt-2">{productoEliminar.nombreProducto || productoEliminar.nom_prod || productoEliminar.nombre}</strong>
                </div>
                <div className="modal-footer bg-light justify-content-center">
                  <button type="button" className="petly-btn-outline py-2 px-3" onClick={() => setProductoEliminar(null)}>Cancelar</button>
                  <button type="button" className="btn btn-danger py-2 px-3 fw-bold rounded-3" onClick={confirmarEliminar}>Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}