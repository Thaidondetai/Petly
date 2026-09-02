import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Carro from "./pages/Carro";
import ProductPage from "./pages/ProductPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import AgregarProducto from "./pages/AgregarProducto";
import EditarEliminarProducto from "./pages/EditarEliminarProducto";
import AgregarCategoria from "./pages/AgregarCategoria";
import EditarEliminarCategoria from "./pages/EditarEliminarCategoria";
import EditarEliminarMarca from "./pages/EditarEliminarMarca";
import AgregarMarca from "./pages/AgregarMarca";

import {ProductoProvider} from "./context/ProductoContext";


function App() {
  return (
    <ProductoProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Carro" element={<Carro />} />
        <Route path="/Contacto" element={<Contact />} />
        <Route path="/Producto" element={<ProductPage />} />
        <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/AgregarProducto" element={<AgregarProducto />} />
        <Route path="/EditarEliminarProducto" element={<EditarEliminarProducto />} />
        <Route path="/AgregarCategoria" element={<AgregarCategoria />} />
        <Route path="/EditarCategoria" element={<EditarEliminarCategoria />} />
        <Route path="/AgregarMarca" element={<AgregarMarca />} />
        <Route path ="/EditarEliminarMarca" element={<EditarEliminarMarca />} />
      </Routes>
    </ProductoProvider>
  );
}

export default App;