import { Card } from "react-bootstrap";

import { Link } from "react-router-dom";

function CardComponent({ producto }) {

  return (

    <Card className="producto-card h-100">

      <div className="img-container">

        <Card.Img

          variant="top"

          src={producto.url_imagen}

          alt={producto.nom_prod}

        />

      </div>

      <Card.Body className="d-flex flex-column">

        <Card.Title className="producto-nombre">

          {producto.nom_prod}

        </Card.Title>

        <p className="producto-precio">

          ${producto.precio.toLocaleString("es-CL")}

        </p>

        <Link

          to="/Producto"

          state={{ producto }}

          className="btn petly-btn mt-auto"

        >

          Ver producto

        </Link>

      </Card.Body>

    </Card>

  );

}

export default CardComponent;