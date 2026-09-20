import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";

export default function AgregarProducto() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [idEspecie, setIdEspecie] = useState("1");
  const [precioProducto, setPrecioProducto] = useState("");
  const [stockProducto, setStockProducto] = useState("");
  const [imagenProducto, setImagenProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [idMarca, setIdMarca] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { categorias, marcas, crearProducto, cargarMarcas, cargarCategorias } = useContext(ProductoContext);

  useEffect(() => {
    cargarMarcas();
    cargarCategorias();
  }, [cargarMarcas, cargarCategorias]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCargando(true);

    const nuevoProducto = {
      nombreProducto: nombreProducto.trim(),
      idEspecie: parseInt(idEspecie, 10),
      precio: parseFloat(precioProducto),
      stock: parseInt(stockProducto, 10),
      urlImagen: imagenProducto.trim(),
      descripcion: descripcionProducto.trim(),
      idMarca: idMarca && idMarca !== "" ? parseInt(idMarca, 10) : null,
      idCategoria: idCategoria && idCategoria !== "" ? parseInt(idCategoria, 10) : null,
    };

    try {
      await crearProducto(nuevoProducto);
      alert("¡Producto agregado correctamente!");
      navigate("/DashboardAdmin");
    } catch (err) {
      console.error("Error al agregar producto:", err);
      alert("Hubo un error al agregar el producto.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="petly-simple-page min-vh-100 py-5">
      <div className="container d-flex justify-content-center">
        <div className="login-container" style={{ maxWidth: "700px", width: "100%" }}>
          <span className="section-label">INVENTARIO</span>
          <h2 className="petly-title mb-1 fs-3">Agregar Nuevo Producto 🐾</h2>
          <p className="petly-subtitle mb-4">Completa los datos para añadirlo al catálogo</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-semibold">Nombre del producto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Alimento Premium Adulto"
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Especie</label>
                <select
                  className="form-select"
                  value={idEspecie}
                  onChange={(e) => setIdEspecie(e.target.value)}
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
                  placeholder="Ej. 15990"
                  value={precioProducto}
                  onChange={(e) => setPrecioProducto(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Stock disponible</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ej. 50"
                  value={stockProducto}
                  onChange={(e) => setStockProducto(e.target.value)}
                  min="0"
                  required
                />
              </div>

              {/* Selector de Marcas */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Marca</label>
                <select
                  className="form-select"
                  value={idMarca}
                  onChange={(e) => setIdMarca(e.target.value)}
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
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
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
                <label className="form-label small fw-semibold">Imagen (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. https://..."
                  value={imagenProducto}
                  onChange={(e) => setImagenProducto(e.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Detalles del producto..."
                  value={descripcionProducto}
                  onChange={(e) => setDescripcionProducto(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button type="submit" className="petly-btn w-50" disabled={cargando}>
                {cargando ? "Guardando..." : "Agregar Producto"}
              </button>
              <button type="button" className="petly-btn-outline w-50" onClick={() => navigate("/DashboardAdmin")}>
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}