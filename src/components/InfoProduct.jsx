import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE, handleImageError } from "../utils/constants";
import { ProductoContext } from "../context/ProductoContext";

function InfoProductComponent({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const { marcas, categorias } = useContext(ProductoContext);

  const idMarcaObtenido = 
    producto?.idMarca || 
    producto?.id_marca || 
    producto?.idMarcaProd || 
    producto?.marca?.idMarca || 
    producto?.marca?.id_marca;

  const marcaEncontrada = marcas?.find(
    (m) => Number(m.idMarca || m.id_marca || m.id) === Number(idMarcaObtenido)
  );

  const nombreMarca = 
    producto?.nombreMarca || 
    producto?.nom_marca || 
    producto?.marca?.nombreMarca || 
    producto?.marca?.nom_marca || 
    (marcaEncontrada ? (marcaEncontrada.nombreMarca || marcaEncontrada.nom_marca || marcaEncontrada.nombre) : null) ||
    "Sin marca";

  const idCategoriaObtenido = 
    producto?.idCategoria || 
    producto?.id_categoria || 
    producto?.categoria?.idCategoria;

  const categoriaEncontrada = categorias?.find(
    (c) => Number(c.idCategoria || c.id_categoria || c.id) === Number(idCategoriaObtenido)
  );

  const nombreCategoria = 
    producto?.nombreCategoria || 
    producto?.nom_cat || 
    producto?.categoria?.nombreCategoria || 
    (categoriaEncontrada ? (categoriaEncontrada.nombreCategoria || categoriaEncontrada.nom_cat || categoriaEncontrada.nombre) : null) ||
    "Sin categoría";

  const descripcionReal = 
    producto?.descripcion || 
    producto?.desc_prod || 
    producto?.descripcionProducto || 
    producto?.descrip || 
    producto?.desc;

  const hayStock = producto?.stock > 0;

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

    if (!hayStock) {
      alert("Este producto se encuentra agotado actualmente.");
      return;
    }

    const idProd = producto.idProducto || producto.id_prod || producto.id;
    let carro = JSON.parse(localStorage.getItem("carro")) || [];

    const existeIndex = carro.findIndex(
      (p) => p.idProducto === idProd
    );

    const cantidadEnCarro = existeIndex !== -1 ? carro[existeIndex].cantidad : 0;
    const totalSolicitado = cantidadEnCarro + cantidad;

    if (totalSolicitado > producto.stock) {
      alert(`No hay suficiente stock disponible. Ya tienes ${cantidadEnCarro} unidad(es) en tu carrito y el stock total es de ${producto.stock}.`);
      return;
    }

    if (existeIndex !== -1) {
      carro[existeIndex].cantidad = totalSolicitado;
    } else {
      carro.push({
        idProducto: idProd,
        nombreProducto: producto.nombreProducto || producto.nom_prod,
        precio: producto.precio,
        urlImagen: producto.urlImagen || producto.url_imagen,
        stockDisponible: producto.stock,
        cantidad: cantidad
      });
    }

    localStorage.setItem(
      "carro",
      JSON.stringify(carro)
    );

    setCantidad(1);
    alert("¡Producto agregado al carrito correctamente!");
  };

  return (
    <main className="producto-page py-4">
      <div className="container">
        <div className="mb-3">
          <Link to="/" className="text-decoration-none text-muted small fw-semibold">
            ← Volver al catálogo
          </Link>
        </div>

        <div className="producto-hero-card mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="producto-imagen-stage">
                <img
                  src={producto.urlImagen || producto.url_imagen || DEFAULT_IMAGE}
                  alt={producto.nombreProducto || producto.nom_prod}
                  onError={handleImageError}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <span className="producto-etiqueta mb-2">
                {nombreCategoria}
              </span>

              <h1 className="producto-titulo-principal mb-2">
                {producto.nombreProducto || producto.nom_prod}
              </h1>

              <p className="precio mb-2">
                ${producto.precio?.toLocaleString("es-CL")}
              </p>

              <p className="stock mb-4">
                Stock disponible:{" "}
                <strong className={hayStock ? "text-dark" : "text-danger"}>
                  {hayStock ? `${producto.stock} unidades` : "Agotado"}
                </strong>
              </p>

              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <div className="cantidad-selector">
                  <button type="button" onClick={disminuir} disabled={!hayStock}>−</button>
                  <input type="number" value={hayStock ? cantidad : 0} readOnly />
                  <button type="button" onClick={aumentar} disabled={!hayStock}>+</button>
                </div>

                <button
                  type="button"
                  className="btn petly-btn flex-grow-1"
                  onClick={guardarCantidad}
                  disabled={!hayStock}
                >
                  {hayStock ? "Agregar al carrito" : "Producto Agotado"}
                </button>
              </div>

              <Link to="/Carro" className="btn petly-btn-outline w-100 text-center">
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>

        <div className="producto-seccion-bloque mb-4">
          <h3 className="seccion-bloque-titulo">Especificaciones del producto</h3>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="spec-card">
                <span className="spec-label">Especie</span>
                <span className="spec-value">
                  {Number(producto.idEspecie || producto.id_especie) === 1 ? "Perro" : Number(producto.idEspecie || producto.id_especie) === 2 ? "Gato" : "Exótico"}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="spec-card">
                <span className="spec-label">Marca</span>
                <span className="spec-value">
                  {nombreMarca}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="spec-card">
                <span className="spec-label">Categoría</span>
                <span className="spec-value">
                  {nombreCategoria}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="spec-card">
                <span className="spec-label">Estado</span>
                <span className={`spec-value ${hayStock ? "text-success" : "text-danger"}`}>
                  {hayStock ? "Disponible" : "Agotado"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="producto-seccion-bloque">
          <h3 className="seccion-bloque-titulo">Descripción</h3>
          <p className="descripcion m-0">
            {descripcionReal || "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </main>
  );
}

export default InfoProductComponent;