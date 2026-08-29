import { useState } from "react";

import { Link } from "react-router-dom";

function InfoProductComponent({ producto }) {

  const [cantidad, setCantidad] = useState(1);

  const aumentar = () => {

    if (cantidad < producto.stock) {

      setCantidad(cantidad + 1);

    }

  };

  const disminuir = () => {

    if (cantidad > 1) {

      setCantidad(cantidad - 1);

    }

  };

  const guardarCantidad = () => {

    if (!producto) {

      alert("No has seleccionado un producto.");

      return;

    }

    let carro = JSON.parse(localStorage.getItem("carro")) || [];

    const existe = carro.find(

      (p) => p.id === producto.id_prod

    );

    if (existe) {

      if (existe.cantidad + cantidad > producto.stock) {

        alert("No hay suficiente stock disponible.");

        return;

      }

      existe.cantidad += cantidad;

    } else {

      carro.push({

        id: producto.id_prod,

        cantidad: cantidad

      });

    }

    localStorage.setItem(

      "carro",

      JSON.stringify(carro)

    );

    setCantidad(1);

    alert("Producto agregado al carrito");

  };

  return (

    <main className="producto-page">

      <div className="container">

        <div className="producto-grid">

          <div className="producto-imagen">

            <img

              src={producto.url_imagen}

              alt={producto.nom_prod}

            />

          </div>

          <div className="producto-info">

            <span className="producto-etiqueta">

              PRODUCTO

            </span>

            <h1>

              {producto.nom_prod}

            </h1>

            <p className="descripcion">

              {producto.desc_prod}

            </p>

            <p className="precio">

              ${producto.precio.toLocaleString("es-CL")}

            </p>

            <p className="stock">

              Stock disponible: {producto.stock}

            </p>

            <div className="cantidad-selector">

              <button

                type="button"

                onClick={disminuir}

              >

                −

              </button>

              <input

                type="number"

                value={cantidad}

                readOnly

              />

              <button

                type="button"

                onClick={aumentar}

              >

                +

              </button>

            </div>

            <div className="botones">

              <button

                type="button"

                className="btn petly-btn"

                onClick={guardarCantidad}

              >

                Agregar al carrito

              </button>

              <Link

                to="/Carro"

                className="btn petly-btn-outline"

              >

                Ir al carrito

              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>

  );

}

export default InfoProductComponent;