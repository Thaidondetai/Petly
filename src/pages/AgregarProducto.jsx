import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function AgregarProducto() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [idEspecie, setIdEspecie] = useState("1");
  const [precioProducto, setPrecioProducto] = useState("");
  const [stockProducto, setStockProducto] = useState("");
  const [imagenProducto, setImagenProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [idMarca, setIdMarca] = useState("1");
  const [idCategoria, setIdCategoria] = useState("1");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const nuevoProducto = {
      nombre: nombreProducto,
      id_especie: parseInt(idEspecie, 10),
      precio: parseFloat(precioProducto),
      stock: parseInt(stockProducto, 10),
      imagen: imagenProducto,
      descripcion: descripcionProducto,
      id_marca: parseInt(idMarca, 10),
      id_categoria: parseInt(idCategoria, 10),
    };

    try {
      await axios.post("http://34.193.229.170:8080/api/v1/productos", nuevoProducto);
      alert("¡Producto agregado correctamente!");

      // Limpiar formulario
      setNombreProducto("");
      setIdEspecie("1");
      setPrecioProducto("");
      setStockProducto("");
      setDescripcionProducto("");
      setImagenProducto("");
      setIdMarca("1");
      setIdCategoria("1");

      navigate("/DashboardAdmin");
    } catch (err) {
      console.error("Error al agregar producto:", err);
      alert("Hubo un error al agregar el producto. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="petly-simple-page min-vh-100 py-5">
      <div className="container d-flex justify-content-center">
        <div className="login-container" style={{ maxWidth: "700px", width: "100%" }}>
          <span className="section-label">INVENTARIO</span>
          <h2 className="petly-title mb-1">Agregar Nuevo Producto 🐾</h2>
          <p className="petly-subtitle mb-4">Completa los datos para añadirlo al catálogo</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="row g-3">
              {/* Nombre */}
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

              {/* Selector de Especie */}
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

              {/* Precio */}
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

              {/* Stock */}
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

              {/* Marca */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Marca</label>
                <select
                  className="form-select"
                  value={idMarca}
                  onChange={(e) => setIdMarca(e.target.value)}
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
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  required
                >
                  <option value="1">1: Comida</option>
                  <option value="2">2: Juguetes</option>
                  <option value="3">3: Accesorios</option>
                </select>
              </div>

              {/* URL o Path de la Imagen */}
              <div className="col-12">
                <label className="form-label small fw-semibold">Imagen (Nombre o URL)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. alimento-perro.png o https://..."
                  value={imagenProducto}
                  onChange={(e) => setImagenProducto(e.target.value)}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label small fw-semibold">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Detalles e ingredientes o especificaciones del producto..."
                  value={descripcionProducto}
                  onChange={(e) => setDescripcionProducto(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex gap-3 mt-4">
              <button
                type="submit"
                className="petly-btn w-50"
                disabled={cargando}
              >
                {cargando ? "Guardando..." : "Agregar Producto"}
              </button>

              <button
                type="button"
                className="petly-btn-outline w-50"
                onClick={() => navigate("/DashboardAdmin")}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}