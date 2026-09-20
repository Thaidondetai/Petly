import Carousel from "react-bootstrap/Carousel";

function CarouselComponent() {
  return (
    <Carousel className="petly-carousel">
      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>Todo lo que tu<br />mascota necesita</h1>
            <p>Alimentos, juguetes, camas y más.<br />Para perros y gatos.</p>
            <button className="petly-btn">VER PRODUCTOS</button>
          </div>
          <div className="hero-image">
            <img
              src="https://i.pinimg.com/1200x/a8/06/1d/a8061dab5091d2b1970052bfb3956259.jpg"
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
            <button className="petly-btn">VER PRODUCTOS</button>
          </div>
          <div className="hero-image">
            <img
              src="https://i.pinimg.com/1200x/a8/06/1d/a8061dab5091d2b1970052bfb3956259.jpg"
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
            <button className="petly-btn">VER PRODUCTOS</button>
          </div>
          <div className="hero-image">
            <img
              src="https://i.pinimg.com/1200x/a8/06/1d/a8061dab5091d2b1970052bfb3956259.jpg"
              alt="Productos para mascotas"
            />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselComponent;