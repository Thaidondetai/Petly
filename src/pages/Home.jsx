import { useContext } from "react";
import FooterComponent from "../components/FooterComp";
import CarouselComp from "../components/Carousel";
import NavComponent from "../components/NavComp";
import CardComponent from "../components/CardComp";
import { useSearchParams } from "react-router-dom";
import { ProductoContext } from "../context/ProductoContext";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const { productos, categorias, categoriaSeleccionada, seleccionarCategoria, loading } = useContext(ProductoContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get("buscar") || "";

  const seleccionarCategoriaYLimpiarBusqueda = (idCat) => {
    setSearchParams({});
    seleccionarCategoria(idCat);
  };

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();
    const nombre = p.nombreProducto ? p.nombreProducto.toLowerCase() : "";
    const descripcion = p.descripcion ? p.descripcion.toLowerCase() : "";

    return (
      nombre.includes(texto) ||
      descripcion.includes(texto)
    );
  });

  return (
    <div className="petly-page">
      <NavComponent />
      <CarouselComp />

      <main className="petly-home py-5">
        <div className="container">
          <section className="categorias-section mb-5">
            <div className="section-heading mb-3">
              <h2 className="petly-title fs-4">{t("main_categories")}</h2>
            </div>

            <div className="categorias-grid">
              <div 
                className={`categoria-card ${categoriaSeleccionada === null ? 'activa' : ''}`}
                onClick={() => seleccionarCategoriaYLimpiarBusqueda(null)}
                style={{ cursor: 'pointer' }}
              >
                <span>{t("all_categories")}</span>
              </div>

              {categorias.map((cat) => (
                <div 
                  className={`categoria-card ${categoriaSeleccionada === cat.idCategoria ? 'activa' : ''}`}
                  key={cat.idCategoria}
                  onClick={() => seleccionarCategoriaYLimpiarBusqueda(cat.idCategoria)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{cat.nombreCategoria}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="section-heading mb-4">
            <h2 className="petly-title fs-4">{t("featured_products")}</h2>
            <p className="petly-subtitle">{t("featured_subtitle")}</p>
          </div>

          {loading ? (
            <p className="text-muted">{t("loading_products")}</p>
          ) : (
            <div className="row g-4">
              {productosFiltrados.length === 0 ? (
                <p className="text-muted">{t("no_products_found")}</p>
              ) : (
                productosFiltrados.map((p) => (
                  <div className="col-12 col-sm-6 col-lg-4" key={p.idProducto}>
                    <CardComponent producto={p} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <FooterComponent />
    </div>
  );
}

export default Home;