import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE, handleImageError } from "../utils/constants";

function CardComponent({ producto }) {
  return (
    <Card className="producto-card h-100">
      <div className="img-container">
        <Card.Img
          variant="top"
          src={producto.urlImagen || DEFAULT_IMAGE}
          alt={producto.nombreProducto}
          onError={handleImageError}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="producto-nombre">
          {producto.nombreProducto}
        </Card.Title>

        <p className="producto-precio">
          ${producto.precio?.toLocaleString("es-CL")}
        </p>

        <Link
          to="/Producto"
          state={{ producto }}
          className="btn petly-btn mt-auto text-center"
        >
          Ver producto
        </Link>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;