import FooterComponent from "../components/FooterComp";
import CarouselComp from "../components/Carousel";
import NavComponent from "../components/NavComp";
import CardComponent from "../components/CardComp";
import producto from "../data/producto";
import { useSearchParams } from "react-router-dom";

function Home() {

  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("buscar") || "";
  const productosFiltrados = producto.filter((p) => {
    const texto = busqueda.toLowerCase();

    return(
      p.nom_prod.toLowerCase().includes(texto) ||
      p.tipo_prod.toLowerCase().includes(texto) ||
      p.desc_prod.toLowerCase().includes(texto) 
    );
  });

  return (
    <div className="petly-page">

      <NavComponent />
      <CarouselComp />

      <main className="petly-home">
        <div className="container py-5">
          <section className="categorias-section">
            <div className="section-heading">
              <h2>
                Categorías principales
              </h2>
            </div>

            <div className="categorias-grid">
              <div className="categoria-card">
                <div className="categoria-icon">

              

                </div>

                <span>
                  Perros
                </span>
              </div>

              <div className="categoria-card">
                <div className="categoria-icon">

            

                </div>
                <span>
                  Gatos
                </span>
              </div>

              <div className="categoria-card">
                <div className="categoria-icon">

          

                </div>
                <span>
                  Alimentación
                </span>
              </div>

              <div className="categoria-card">
                <div className="categoria-icon">

            

                </div>
                <span>
                  Camas
                </span>
              </div>

              <div className="categoria-card">
                <div className="categoria-icon">

            

                </div>
                <span>
                  Juguetes
                </span>
              </div>

              <div className="categoria-card">
                <div className="categoria-icon">

                

                </div>
                <span>
                  Higiene
                </span>
              </div>
            </div>
        
          </section>

          <div className="section-heading productos-heading">
            <h2>
              Productos destacados
            </h2>
            <p>
              Todo lo que necesitas para cuidar a tu mascota.
            </p>
          </div>

          <div className="row g-4">
            {productosFiltrados.map((p) => (
              <div className="col-12 col-sm-6 col-lg-4" key={p.id_prod}>
                <CardComponent producto={p} />
              </div>

            ))}

          </div>
        </div>
      </main>
      <FooterComponent />
    </div>

  );

}

export default Home;