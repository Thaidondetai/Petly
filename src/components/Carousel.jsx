import Carousel from "react-bootstrap/Carousel";

function CarouselComponent() {
  return (
    <Carousel className="petly-carousel">
      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>Todo lo que tu<br />mascota necesita</h1>
            <p>Alimentos, juguetes, camas y más.<br />Para perros y gatos.</p>
          </div>
          <div className="hero-image">
            <img
              src="https://www.vitakraft.com/fileadmin/_processed_/4/3/csm_por_qu%C3%A9_duerme_tanto_mi_gato_876d94bdc3.jpg"
              alt="Productos para mascotas"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>Para perros<br />y gatos</h1>
            <p>Encuentra lo que necesitas<br />para tus mascotas.</p>
          </div>
          <div className="hero-image">
            <img
              src="https://cpdelivery.cl/wp-content/uploads/2025/05/mascotas-jugando-gatos-y-perros-mostrando-amistad-1536x861.jpg"
              alt="Productos para perros y gatos"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>Cuida a quienes<br />más quieres</h1>
            <p>Calidad y variedad<br />en un solo lugar.</p>
          </div>
          <div className="hero-image">
            <img
              src="https://clinicalaveterinaria.it/wp-content/uploads/2017/05/microchip-cane-gatto-coniglio.jpg"
              alt="Productos para mascotas"
            />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselComponent;