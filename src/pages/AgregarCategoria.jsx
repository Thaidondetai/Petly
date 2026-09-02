import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function AgregarCategoria() {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreCategoria.trim()) {
      alert("Por favor ingresa un nombre para la categoría.");
      return;
    }

    setCargando(true);

    const nuevaCategoria = {
      nombre: nombreCategoria.trim(),
    };

    try {
      // Ajusta la URL según el endpoint real de tu API de catálogo/categorías
      await axios.post("http://34.193.229.170:8080/api/v1/categorias", nuevaCategoria);
      alert("¡Categoría agregada correctamente!");
      
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
          <span className="section-label">CATÁLOGO</span>
          <h2 className="petly-title mb-1">Nueva Categoría 🏷️</h2>
          <p className="petly-subtitle mb-4">Ingresa el nombre para clasificar tus productos</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-4">
              <label className="form-label small fw-semibold">Nombre de la categoría</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Alimentos, Juguetes, Higiene..."
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