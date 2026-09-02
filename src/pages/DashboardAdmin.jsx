import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function DashboardAdmin() {
  const [ultimosProductos, setUltimosProductos] = useState([]);

  return (
    <div className="container py-5">
      {/* Encabezado */}
      <div className="mb-4">
        <span className="section-label">PANEL DE CONTROL</span>
        <h1 className="petly-title mb-1">Hola, Administrador 🐾</h1>
        <p className="petly-subtitle">Resumen general y administración de la plataforma Petly</p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card admin-card-stat p-3 shadow-sm border-0">
            <div className="card-body">
              <span className="stat-title">Usuarios Nuevos 👥</span>
              <p className="stat-number mt-2">120</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card admin-card-stat p-3 shadow-sm border-0">
            <div className="card-body">
              <span className="stat-title">Ventas del Mes 🛒</span>
              <p className="stat-number mt-2">450</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card admin-card-stat p-3 shadow-sm border-0">
            <div className="card-body">
              <span className="stat-title">Ganancias del Mes 💰</span>
              <p className="stat-number mt-2">$2.000.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menús Desplegables de Bootstrap */}
      <div className="row g-3 mb-5">
        {/* Dropdown Productos */}
        <div className="col-md-6">
          <div className="dropdown w-100">
            <button
              className="btn petly-btn dropdown-toggle w-100"
              type="button"
              id="dropdownProductosBtn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Gestión de Productos
            </button>
            <ul className="dropdown-menu w-100 admin-dropdown-menu shadow" aria-labelledby="dropdownProductosBtn">
              <li>
                <Link className="dropdown-item admin-dropdown-item" to="/AgregarProducto">
                  ➕ Agregar producto
                </Link>
              </li>
              <li>
                <Link className="dropdown-item admin-dropdown-item" to="/EditarEliminarProducto">
                  ✏️ Editar o eliminar producto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dropdown Catálogo */}
        <div className="col-md-6">
          <div className="dropdown w-100">
            <button
              className="btn petly-btn dropdown-toggle w-100"
              type="button"
              id="dropdownCatalogoBtn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Gestión de Catálogo
            </button>
            <ul className="dropdown-menu w-100 admin-dropdown-menu shadow" aria-labelledby="dropdownCatalogoBtn">
              <li>
                <Link className="dropdown-item admin-dropdown-item" to="/AgregarCategoria">
                  ➕ Agregar categorías
                </Link>
              </li>
              <li>
                <Link className="dropdown-item admin-dropdown-item" to="/EditarCategoria">
                  ✏️ Editar o eliminar categorías
                </Link>
              </li>
              <li>
                <Link className="dropdown-item admin-dropdown-item" to="/EditarEliminarMarca">
                  🏷️ Gestión de Marcas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="row">
        <div className="col-12">
          <div className="card admin-table-card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="section-heading mb-3">
                <h2>Últimos 5 Productos Añadidos</h2>
                <p>Lista de productos registrados recientemente en Petly</p>
              </div>

              <div className="table-responsive">
                <table className="table admin-table align-middle text-center mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th className="text-start">Nombre del Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosProductos && ultimosProductos.length > 0 ? (
                      ultimosProductos.map((prod) => (
                        <tr key={prod.id_producto || prod.id}>
                          <td className="text-muted fw-semibold">#{prod.id_producto || prod.id}</td>
                          <td>
                            <img
                              src={prod.url_imagen || prod.imagen}
                              alt={prod.nombre_producto || prod.nombre}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                            />
                          </td>
                          <td className="fw-semibold text-start">{prod.nombre_producto || prod.nombre}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-muted py-4">
                          No hay productos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;