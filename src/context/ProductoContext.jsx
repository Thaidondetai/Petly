import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductoContext = createContext();

export function ProductoProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://34.193.229.170:8080/api/v1/productos");
      setProductos(response.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const crearProducto = async (nuevoProducto) => {
    try {
      await axios.post("http://34.193.229.170:8080/api/v1/productos", nuevoProducto);
      await cargarProductos();
    } catch (err) {
      console.error("Error al crear producto:", err);
    }
  };

  const actualizarProducto = async (actualizarProd) => {
    try {
      const id = actualizarProd.id;
      await axios.put(`http://34.193.229.170:8080/api/v1/productos/${id}`, actualizarProd);
      await cargarProductos();
    } catch (err) {
      console.error("Error al editar producto:", err);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://34.193.229.170:8080/api/v1/productos/${id}`);
      await cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  return (
    <ProductoContext.Provider value={{ productos, loading, cargarProductos, crearProducto, actualizarProducto, eliminarProducto }}>
      {children}
    </ProductoContext.Provider>
  );
}