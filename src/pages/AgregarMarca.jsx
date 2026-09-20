import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductoContext } from "../context/ProductoContext";

export default function AgregarMarca() {
  const [nombreMarca, setNombreMarca] = useState("");
  const [descripcionMarca, setDescripcionMarca] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { agregarMarca } = useContext(ProductoContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreMarca.trim()) {
      alert("Por favor ingresa un nombre para la marca.");
      return;
    }

    setCargando(true);

    const nuevaMarca = {
      nombreMarca: nombreMarca.trim(),
      descripcion: descripcionMarca.trim()
    };

    try {
      await agregarMarca(nuevaMarca);
      alert("¡Marca agregada correctamente!");
      
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
          <span className="section-label">CATÁLOGO</span>
          <h2 className="petly-title mb-1 fs-3">Nueva Marca 🏷️</h2>
          <p className="petly-subtitle mb-4">Ingresa el nombre de una marca nueva para identificar la empresa de tus productos</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-4">
              <label className="form-label small fw-semibold">Nombre de la marca</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Royal Canin, Pedigree, Whiskas..."
                value={nombreMarca}
                onChange={(e) => setNombreMarca(e.target.value)}
                required
                autoFocus
              />
              <label className="form-label small fw-semibold mt-3">Descripción de la marca</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Marca de alimentos para mascotas..."
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
                {cargando ? "Guardando..." : "Agregar"}
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