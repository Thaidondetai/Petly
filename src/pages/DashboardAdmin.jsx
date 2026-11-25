import { useContext, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavComponent from '../components/NavComp';
import FooterComponent from '../components/FooterComp';
import { ProductoContext } from '../context/ProductoContext';
import { DEFAULT_IMAGE, handleImageError } from '../utils/constants';
import { useTranslation } from 'react-i18next';

function DashboardAdmin() {
  const { t } = useTranslation();
  const { productos } = useContext(ProductoContext);
  const [productosExoticos, setProductosExoticos] = useState([]);

  useEffect(() => {
    if (productos && Array.isArray(productos)) {
      const exoticos = productos.filter(p => {
        const idEspecieNum = parseInt(p.idEspecie || p.id_especie || p.especieId, 10);
        return p.esExotico || p.requiereSag || p.requiere_sag || idEspecieNum === 3;
      });
      setProductosExoticos(exoticos.map(p => ({ ...p, sagValidated: p.sagValidated ?? false })));
    }
  }, [productos]);

  const handleAprobarSag = async (idProducto) => {
    const BFF_URL = import.meta.env.VITE_BFF_URL || "https://jbwthrmbj2.execute-api.us-east-1.amazonaws.com";
    const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.patch(`${BFF_URL}/api/bff/productos/${idProducto}/aprobar-sag`, {
        sagValidated: true
      }, { headers });

      setProductosExoticos(prev =>
        prev.map(prod => {
          const id = prod.idProducto || prod.id_prod || prod.id;
          return id === idProducto ? { ...prod, sagValidated: true } : prod;
        })
      );
      
      alert("¡Validación SAG aprobada con éxito!");
    } catch (error) {
      console.error("Error al aprobar SAG en el backend:", error);
      // Fallback visual temporal si el endpoint aún está en configuración
      setProductosExoticos(prev =>
        prev.map(prod => {
          const id = prod.idProducto || prod.id_prod || prod.id;
          return id === idProducto ? { ...prod, sagValidated: true } : prod;
        })
      );
      alert("Validación SAG actualizada localmente.");
    }
  };

  const ultimosProductos = useMemo(() => {
    if (!productos || !Array.isArray(productos) || productos.length === 0) return [];
    return [...productos].reverse().slice(0, 5);
  }, [productos]);

  return (
    <>
      <NavComponent />
      <main className="petly-simple-page py-5">
        <div className="container">
          <div className="mb-4">
            <span className="section-label">{t("admin_section")}</span>
            <h1 className="petly-title mb-1">{t("admin_hello")}</h1>
            <p className="petly-subtitle">{t("admin_subtitle")}</p>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card admin-card-stat p-3">
                <div className="card-body">
                  <span className="stat-title">{t("stat_new_users")}</span>
                  <p className="stat-number mt-2">120</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card admin-card-stat p-3">
                <div className="card-body">
                  <span className="stat-title">{t("stat_monthly_sales")}</span>
                  <p className="stat-number mt-2">450</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card admin-card-stat p-3">
                <div className="card-body">
                  <span className="stat-title">{t("stat_monthly_profit")}</span>
                  <p className="stat-number mt-2">$2.000.000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-5">
            <div className="col-12 col-md-6">
              <div className="dropdown w-100">
                <button
                  className="btn petly-btn dropdown-toggle w-100 py-3"
                  type="button"
                  id="dropdownProductosBtn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t("product_mgmt")}
                </button>
                <ul className="dropdown-menu w-100 admin-dropdown-menu" aria-labelledby="dropdownProductosBtn">
                  <li>
                    <Link className="dropdown-item admin-dropdown-item" to="/AgregarProducto">
                      {t("add_product_opt")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item admin-dropdown-item" to="/EditarEliminarProducto">
                      {t("edit_delete_product_opt")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="dropdown w-100">
                <button
                  className="btn petly-btn dropdown-toggle w-100 py-3"
                  type="button"
                  id="dropdownCatalogoBtn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t("catalog_mgmt")}
                </button>
                <ul className="dropdown-menu w-100 admin-dropdown-menu" aria-labelledby="dropdownCatalogoBtn">
                  <li>
                    <Link className="dropdown-item admin-dropdown-item" to="/AgregarCategoria">
                      {t("add_category_opt")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item admin-dropdown-item" to="/EditarCategoria">
                      {t("edit_delete_category_opt")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item admin-dropdown-item" to="/EditarEliminarMarca">
                      {t("brand_mgmt_opt")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sección de Validación SAG para Productos Exóticos */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card admin-table-card border-warning">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h2 className="petly-title fs-4 mb-1">🐾 Validación SAG - Productos Exóticos</h2>
                    <p className="petly-subtitle mb-0">Revisa y aprueba los identificadores SAG para habilitar la compra de especies exóticas.</p>
                  </div>

                  <div className="table-responsive">
                    <table className="table admin-table align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Imagen</th>
                          <th className="text-start">Nombre Producto</th>
                          <th>Identificador SAG</th>
                          <th>Estado SAG</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosExoticos.length > 0 ? (
                          productosExoticos.map((prod) => {
                            const id = prod.idProducto || prod.id_prod || prod.id;
                            const nombre = prod.nombreProducto || prod.nom_prod || prod.nombre;
                            const imagen = prod.urlImagen || prod.url_imagen || prod.imagen;

                            return (
                              <tr key={id}>
                                <td className="text-muted fw-semibold">#{id}</td>
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
                                  <code>{prod.sagIdentifier || prod.sagCode || 'SAG-EXOTIC-2026'}</code>
                                </td>
                                <td>
                                  <span className={`badge ${prod.sagValidated ? 'bg-success' : 'bg-warning text-dark'}`}>
                                    {prod.sagValidated ? 'Aprobado ✅' : 'Pendiente ⏳'}
                                  </span>
                                </td>
                                <td>
                                  {!prod.sagValidated ? (
                                    <button
                                      className="btn btn-sm btn-warning fw-bold text-white px-3"
                                      onClick={() => handleAprobarSag(id)}
                                    >
                                      Aprobar SAG
                                    </button>
                                  ) : (
                                    <span className="text-muted small">Habilitado para pago</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-muted py-4">No hay productos exóticos pendientes de validación SAG.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Últimos Productos Registrados */}
          <div className="row">
            <div className="col-12">
              <div className="card admin-table-card">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h2 className="petly-title fs-4 mb-1">{t("recent_products_title")}</h2>
                    <p className="petly-subtitle mb-0">{t("recent_products_subtitle")}</p>
                  </div>

                  <div className="table-responsive">
                    <table className="table admin-table align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th>{t("col_id")}</th>
                          <th>{t("col_image")}</th>
                          <th className="text-start">{t("col_name")}</th>
                          <th>{t("col_price")}</th>
                          <th>{t("col_stock")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ultimosProductos.length > 0 ? (
                          ultimosProductos.map((prod) => {
                            const id = prod.idProducto || prod.id_prod || prod.id;
                            const nombre = prod.nombreProducto || prod.nom_prod || prod.nombre;
                            const imagen = prod.urlImagen || prod.url_imagen || prod.imagen;

                            return (
                              <tr key={id}>
                                <td className="text-muted fw-semibold">#{id}</td>
                                <td>
                                  <img
                                    src={imagen || DEFAULT_IMAGE}
                                    alt={nombre}
                                    className="admin-prod-thumb"
                                    onError={handleImageError}
                                  />
                                </td>
                                <td className="fw-semibold text-start">{nombre}</td>
                                <td className="text-success fw-bold">${prod.precio?.toLocaleString("es-CL")}</td>
                                <td>{prod.stock} u.</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-muted py-4">{t("no_products_registered")}</td>
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
      </main>
      <FooterComponent />
    </>
  );
}

export default DashboardAdmin;