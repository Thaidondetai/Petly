import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Carro from "./pages/Carro";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Carro" element={<Carro />} />
      <Route path="/Contacto" element={<Contact />} />
      <Route path="/Producto" element={<ProductPage />} />
    </Routes>
  );
}

export default App;