import { NavLink, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Form, NavDropdown } from "react-bootstrap";
import { useEffect, useState, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyContext } from "../context/CurrencyContext";

// Componente simple de bandera mediante imagen nativa
const FlagIcon = ({ code, alt }) => (
  <img
    src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/48x36/${code.toLowerCase()}.png 2x`}
    width="18"
    height="13"
    alt={alt || code}
    style={{ borderRadius: "2px", objectFit: "cover", display: "inline-block" }}
  />
);

function NavComponent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const busqueda = searchParams.get("buscar") || "";

  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useContext(CurrencyContext);

  const [usuario, setUsuario] = useState({
    estaLogueado: false,
    esAdmin: false,
  });

  const verificarSesion = useCallback(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const groups = payload["cognito:groups"] || [];
        setUsuario({
          estaLogueado: true,
          esAdmin: groups.includes("admin"),
        });
      } catch {
        setUsuario({ estaLogueado: false, esAdmin: false });
      }
    } else {
      setUsuario({ estaLogueado: false, esAdmin: false });
    }
  }, []);

  useEffect(() => {
    verificarSesion();

    window.addEventListener("storage", verificarSesion);
    return () => {
      window.removeEventListener("storage", verificarSesion);
    };
  }, [location.pathname, verificarSesion]);

  const handleSearch = (e) => {
    e.preventDefault();
    const texto = e.target.elements.buscar.value.trim();
    if (texto) {
      navigate(`/?buscar=${encodeURIComponent(texto)}`);
    } else {
      navigate("/");
    }
  };

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
      setUsuario({ estaLogueado: false, esAdmin: false });
      navigate("/");
    }
  };

  return (
    <Navbar expand="lg" className="petly-navbar sticky-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="petly-logo">
          <span className="petly-logo-icon">🐾</span>
          Petly
        </Navbar.Brand>

        {/* Buscador Desktop */}
        <Form className="petly-search-integrated d-none d-lg-flex mx-auto" onSubmit={handleSearch}>
          <Form.Control
            name="buscar"
            type="search"
            placeholder={t("placeholder_search", "Buscar alimentos, juguetes, accesorios...")}
            aria-label="Buscar productos"
            defaultValue={busqueda}
          />
          <button type="submit" className="petly-btn-search">
            {t("search", "Buscar")}
          </button>
        </Form>

        <Navbar.Toggle aria-controls="navbar-principal" />

        <Navbar.Collapse id="navbar-principal">
          {/* Buscador Mobile */}
          <Form className="petly-search-integrated d-lg-none my-3" onSubmit={handleSearch}>
            <Form.Control
              name="buscar"
              type="search"
              placeholder={t("placeholder_search", "Buscar productos...")}
              aria-label="Buscar productos"
              defaultValue={busqueda}
            />
            <button type="submit" className="petly-btn-search">
              {t("search", "Buscar")}
            </button>
          </Form>

          <Nav className="ms-auto align-items-lg-center gap-2">
            {/* Selectores de Moneda e Idioma usando NavDropdown nativo */}
            <div className="d-flex gap-2 my-2 my-lg-0 align-items-center">
              {/* Moneda */}
              <NavDropdown
                id="dropdown-currency"
                title={
                  <span className="d-inline-flex align-items-center gap-1 text-white">
                    <FlagIcon code={currency === "CLP" ? "cl" : currency === "USD" ? "us" : "eu"} />
                    {currency}
                  </span>
                }
                onSelect={(val) => setCurrency(val)}
              >
                <NavDropdown.Item eventKey="CLP" className="d-flex align-items-center gap-2">
                  <FlagIcon code="cl" /> CLP ($)
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="USD" className="d-flex align-items-center gap-2">
                  <FlagIcon code="us" /> USD ($)
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="EUR" className="d-flex align-items-center gap-2">
                  <FlagIcon code="eu" /> EUR (€)
                </NavDropdown.Item>
              </NavDropdown>

              {/* Idioma */}
              <NavDropdown
                id="dropdown-language"
                title={
                  <span className="d-inline-flex align-items-center gap-1 text-white">
                    <FlagIcon code={i18n.language?.startsWith("en") ? "us" : "cl"} />
                    {(i18n.language || "es").substring(0, 2).toUpperCase()}
                  </span>
                }
                onSelect={(lang) => i18n.changeLanguage(lang)}
              >
                <NavDropdown.Item eventKey="es" className="d-flex align-items-center gap-2">
                  <FlagIcon code="cl" /> ES
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="en" className="d-flex align-items-center gap-2">
                  <FlagIcon code="us" /> EN
                </NavDropdown.Item>
              </NavDropdown>
            </div>

            {/* Opciones de Navegación */}
            {usuario.esAdmin && (
              <Nav.Link as={NavLink} to="/DashboardAdmin" className="fw-bold text-warning">
                ⚙️ {t("admin_panel", "Panel Admin")}
              </Nav.Link>
            )}

            <Nav.Link as={NavLink} to="/Carro" className="petly-nav-icon">
              {t("cart", "Carro")} 🛒
            </Nav.Link>

            <Nav.Link as={NavLink} to="/Contacto">
              {t("contact", "Contacto")}
            </Nav.Link>

            {usuario.estaLogueado ? (
              <>
                <Nav.Link as={NavLink} to="/Perfil" className="petly-nav-icon">
                  {t("profile", "Mi Perfil")} 👤
                </Nav.Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light ms-lg-2 my-2 my-lg-0"
                  onClick={cerrarSesion}
                >
                  {t("logout", "Cerrar Sesión")}
                </button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/Login" className="petly-nav-icon fw-semibold">
                {t("login", "Iniciar sesión")}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavComponent;