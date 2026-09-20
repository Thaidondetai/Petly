import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Carro from "./pages/Carro";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/Perfil";
import DashboardAdmin from "./pages/DashboardAdmin";
import AgregarProducto from "./pages/AgregarProducto";
import EditarEliminarProducto from "./pages/EditarEliminarProducto";
import AgregarCategoria from "./pages/AgregarCategoria";
import EditarEliminarCategoria from "./pages/EditarEliminarCategoria";
import EditarEliminarMarca from "./pages/EditarEliminarMarca";
import AgregarMarca from "./pages/AgregarMarca";

import { ProductoProvider } from "./context/ProductoContext";

// Protege ls rutas administrativas verificando el grupo admin en el token JWT
function RutaAdminProtegida({ children }) {
  const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  try {
    // Decodifica el payload del token JWT (sección central separada por puntos)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const groups = payload["cognito:groups"] || [];

    // Si el usuario no pertenece al grupo 'admin', redirige al inicio
    if (!groups.includes("admin")) {
      alert("Acceso denegado: Se requieren permisos de administrador.");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Error validando permisos de acceso:", error);
    return <Navigate to="/Login" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    // Intercambia el parmetro ?code= de Cognito por los tokens de acceso
    const exchangeCodeForTokens = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      const domain = import.meta.env.VITE_COGNITO_DOMAIN;
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
      });

      try {
        const response = await fetch(`${domain}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem("id_token", data.id_token);
          localStorage.setItem("access_token", data.access_token);

          // Limpia la URL removiendo el parámetro ?code=...
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error("Error al intercambiar token con Cognito:", error);
      }
    };

    exchangeCodeForTokens();
  }, []);

  return (
    <ProductoProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Carro" element={<Carro />} />
        <Route path="/Contacto" element={<Contact />} />
        <Route path="/Producto" element={<ProductPage />} />
        <Route path="/Perfil" element={<ProfilePage />} />

        <Route
          path="/DashboardAdmin"
          element={
            <RutaAdminProtegida>
              <DashboardAdmin />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/AgregarProducto"
          element={
            <RutaAdminProtegida>
              <AgregarProducto />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/EditarEliminarProducto"
          element={
            <RutaAdminProtegida>
              <EditarEliminarProducto />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/AgregarCategoria"
          element={
            <RutaAdminProtegida>
              <AgregarCategoria />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/EditarCategoria"
          element={
            <RutaAdminProtegida>
              <EditarEliminarCategoria />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/AgregarMarca"
          element={
            <RutaAdminProtegida>
              <AgregarMarca />
            </RutaAdminProtegida>
          }
        />
        <Route
          path="/EditarEliminarMarca"
          element={
            <RutaAdminProtegida>
              <EditarEliminarMarca />
            </RutaAdminProtegida>
          }
        />
      </Routes>
    </ProductoProvider>
  );
}

export default App;