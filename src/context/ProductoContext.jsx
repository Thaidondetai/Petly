import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProductoContext = createContext();

const BFF_URL = import.meta.env.VITE_BFF_URL || 'http://localhost:8083';

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export function ProductoProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);


  const cargarCategorias = useCallback(async () => {
    try {
      // Ajusta aquí si tu backend usa /api/bff/categorias o /api/categoria
      const res = await axios.get(`${BFF_URL}/api/bff/categorias`);
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías desde el BFF:", error);
    }
  }, []);

  const cargarMarcas = useCallback(async () => {
    try {
      const res = await axios.get(`${BFF_URL}/api/bff/marcas`);
      setMarcas(res.data);
    } catch (error) {
      console.error("Error al cargar marcas desde el BFF:", error);
    }
  }, []);

  const cargarProductos = useCallback(async (categoriaId = null) => {
    try {
      const url = categoriaId 
        ? `${BFF_URL}/api/bff/productos?categoriaId=${categoriaId}` 
        : `${BFF_URL}/api/bff/productos`;
      const response = await axios.get(url);
      setProductos(response.data);
    } catch (err) {
      console.error("Error al obtener productos desde el BFF:", err);
    }
  }, []);

  const seleccionarCategoria = useCallback((idCategoria) => {
    setCategoriaSeleccionada(idCategoria);
    cargarProductos(idCategoria);
  }, [cargarProductos]);

  useEffect(() => {
    let activo = true;
    const inicializar = async () => {
      await Promise.all([cargarCategorias(), cargarMarcas(), cargarProductos(null)]);
      if (activo) setLoading(false);
    };
    inicializar();
    return () => { activo = false; };
  }, [cargarCategorias, cargarMarcas, cargarProductos]);


  const crearProducto = async (nuevoProducto) => {
    try {
      const res = await axios.post(`${BFF_URL}/api/bff/productos`, nuevoProducto, getAuthHeaders());
      await cargarProductos(categoriaSeleccionada);
      return res.data;
    } catch (err) {
      console.error("Error al crear producto:", err);
      throw err;
    }
  };

  const actualizarProducto = async (actualizarProd) => {
    try {
      const id = actualizarProd.idProducto || actualizarProd.id;
      const res = await axios.put(`${BFF_URL}/api/bff/productos/${id}`, actualizarProd, getAuthHeaders());
      await cargarProductos(categoriaSeleccionada);
      return res.data;
    } catch (err) {
      console.error("Error al editar producto:", err);
      throw err;
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${BFF_URL}/api/bff/productos/${id}`, getAuthHeaders());
      
      let carro = JSON.parse(localStorage.getItem("carro")) || [];
      const carroFiltrado = carro.filter((item) => (item.idProducto || item.id) !== id);
      localStorage.setItem("carro", JSON.stringify(carroFiltrado));

      await cargarProductos(categoriaSeleccionada);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      throw err;
    }
  };

  const agregarCategoria = async (nuevaCategoria) => {
    try {
      const res = await axios.post(`${BFF_URL}/api/bff/categorias`, nuevaCategoria, getAuthHeaders());
      await cargarCategorias();
      return res.data;
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      throw error;
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`${BFF_URL}/api/bff/categorias/${id}`, getAuthHeaders());
      await cargarCategorias();
      await cargarProductos(categoriaSeleccionada);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  };

  const agregarMarca = async (nuevaMarca) => {
    try {
      const res = await axios.post(`${BFF_URL}/api/bff/marcas`, nuevaMarca, getAuthHeaders());
      await cargarMarcas();
      return res.data;
    } catch (error) {
      console.error('Error al agregar marca:', error);
      throw error;
    }
  };

  const eliminarMarca = async (id) => {
    try {
      await axios.delete(`${BFF_URL}/api/bff/marcas/${id}`, getAuthHeaders());
      await cargarMarcas();
      await cargarProductos(categoriaSeleccionada);
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      throw error;
    }
  };

  return (
    <ProductoContext.Provider value={{ 
      productos, categorias, marcas, categoriaSeleccionada, loading, 
      seleccionarCategoria, cargarProductos, cargarCategorias, cargarMarcas, 
      crearProducto, actualizarProducto, eliminarProducto, 
      agregarCategoria, eliminarCategoria, agregarMarca, eliminarMarca }}>
      {children}
    </ProductoContext.Provider>
  );
}