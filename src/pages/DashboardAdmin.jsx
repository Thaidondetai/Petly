import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
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