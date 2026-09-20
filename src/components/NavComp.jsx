import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function NavComponent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const busqueda = searchParams.get("buscar") || "";

  const [usuario, setUsuario] = useState({
    estaLogueado: false,
    esAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("id_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const groups = payload["cognito:groups"] || [];
        setUsuario({
          estaLogueado: true,
          esAdmin: groups.includes("admin"),
        });
      } catch (error) {
        setUsuario({ estaLogueado: false, esAdmin: false });
      }
    } else {
      setUsuario({ estaLogueado: false, esAdmin: false });
    }
  }, []);

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

        <Form className="petly-search-integrated d-none d-lg-flex mx-auto" onSubmit={handleSearch}>
          <Form.Control
            name="buscar"
            type="search"
            placeholder="Buscar alimentos, juguetes, accesorios..."
            aria-label="Buscar productos"
            defaultValue={busqueda}
          />
          <button type="submit" className="petly-btn-search">
            Buscar
          </button>
        </Form>

        <Navbar.Toggle aria-controls="navbar-principal" />

        <Navbar.Collapse id="navbar-principal">
          <Form className="petly-search-integrated d-lg-none my-3" onSubmit={handleSearch}>
            <Form.Control
              name="buscar"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              defaultValue={busqueda}
            />
            <button type="submit" className="petly-btn-search">
              Buscar
            </button>
          </Form>

          <Nav className="ms-auto align-items-lg-center">
            {usuario.esAdmin && (
              <Nav.Link as={NavLink} to="/DashboardAdmin" className="fw-bold text-warning">
                ⚙️ Panel Admin
              </Nav.Link>
            )}

            <Nav.Link as={NavLink} to="/Carro" className="petly-nav-icon">
              Carro
            </Nav.Link>

            <Nav.Link as={NavLink} to="/Contacto">
              Contacto
            </Nav.Link>

            {usuario.estaLogueado ? (
              <>
                <Nav.Link as={NavLink} to="/Perfil" className="petly-nav-icon">
                  Mi Perfil
                </Nav.Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light ms-lg-2 my-2 my-lg-0"
                  onClick={cerrarSesion}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/Login" className="petly-nav-icon">
                Inicio sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavComponent;