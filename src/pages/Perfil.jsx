import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavComponent from "../components/NavComp";
import FooterComponent from "../components/FooterComp";

function ProfilePage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "Usuario Petly",
    email: "Cargando...",
    rol: "CLIENTE",
    fechaRegistro: "01/2026",
  });

  useEffect(() => {
    const idToken = localStorage.getItem("id_token");
    if (idToken) {
      try {
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        const groups = payload["cognito:groups"] || [];
        const esAdmin = groups.includes("admin");

        setUsuario((prev) => ({
          ...prev,
          nombre: payload.name || payload.email?.split("@")[0] || "Usuario Petly",
          email: payload.email || "Sin correo",
          rol: esAdmin ? "ADMIN" : "CLIENTE",
        }));
      } catch (err) {
        console.error("Error al decodificar el token:", err);
      }
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");

    const domain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI;

    if (domain && clientId && logoutUri) {
      window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`;
    } else {
      navigate("/Login");
    }
  };

  return (
    <>
      <NavComponent />

      <main className="petly-simple-page py-5">
        <div className="container" style={{ maxWidth: "850px" }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="section-label">MI CUENTA</span>
              <h1 className="petly-title mb-1">Perfil de Usuario</h1>
              <p className="petly-subtitle mb-0">Gestiona tus datos personales y preferencias</p>
            </div>

            <div className="d-flex gap-2">
              {usuario.rol === "ADMIN" && (
                <button
                  className="petly-btn py-2 px-3 fw-semibold"
                  onClick={() => navigate("/DashboardAdmin")}
                >
                  Panel Admin
                </button>
              )}
              <button
                className="btn btn-outline-danger py-2 px-3 fw-semibold rounded-3"
                onClick={cerrarSesion}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card admin-card-stat p-4 text-center border-0 shadow-sm">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold fs-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "var(--marron)",
                    borderRadius: "50%",
                  }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>

                <h5 className="fw-bold mb-1">{usuario.nombre}</h5>
                <p className="text-muted small mb-3">{usuario.email}</p>

                <span
                  className={`badge ${
                    usuario.rol === "ADMIN" ? "bg-danger" : "bg-secondary"
                  } px-3 py-2 text-uppercase mb-3`}
                  style={{ letterSpacing: "0.5px" }}
                >
                  {usuario.rol === "ADMIN" ? "Administrador" : "Cliente"}
                </span>

                <hr className="my-3 text-muted" />

                <small className="text-muted d-block text-start">
                  <strong>Estado:</strong> Sesión activa
                </small>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="card admin-table-card p-4 border-0 shadow-sm">
                <h3 className="petly-title fs-5 mb-3">Información Personal</h3>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="spec-card">
                      <span className="spec-label">Nombre / Usuario</span>
                      <span className="spec-value">{usuario.nombre}</span>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="spec-card">
                      <span className="spec-label">Correo Electrónico</span>
                      <span className="spec-value">{usuario.email}</span>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="spec-card">
                      <span className="spec-label">Rol Asignado</span>
                      <span className="spec-value">{usuario.rol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}

export default ProfilePage;