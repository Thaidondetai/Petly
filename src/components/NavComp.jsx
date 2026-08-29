import { NavLink, useSearchParams } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown, Form } from "react-bootstrap";

function NavComponent() {

  const[searchParams, SetSearchParams] = useSearchParams();
  const busqueda = searchParams.get("buscar") || "";
  const handleSearch = (e) =>{ e.preventDefault();
    const texto = e.target.elements.buscar.value;
    SetSearchParams({
      buscar: texto

    });

  };



  return (

    <>

      <Navbar expand="lg" className="petly-navbar">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="petly-logo">
            <span className="petly-logo-icon">🐾</span>
            Petly
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-principal" />
          <Navbar.Collapse id="navbar-principal">
            <Nav className="ms-auto align-items-lg-center">

           


              <Nav.Link as={NavLink} to="/Login" className="petly-nav-icon">
                Inicio sesión
              </Nav.Link>

              <Nav.Link as={NavLink} to="/Carro" className="petly-nav-icon">
                Carro
              </Nav.Link>

              <Nav.Link as={NavLink} to="/Contacto">
                Contacto
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="petly-category-bar">
        <Container>

          <div className="petly-category-content">

            <NavDropdown
              title="Categorías"
              id="categorias-dropdown-secondary"
              className="petly-categories">


        {/*urls por cambiar*/}
              <NavDropdown.Item as={NavLink} to="/categoria/perros">
                Perros
              </NavDropdown.Item>

              <NavDropdown.Item as={NavLink} to="/categoria/gatos">
                Gatos
              </NavDropdown.Item>

              <NavDropdown.Item as={NavLink} to="/categoria/exoticos">
                Exoticos
              </NavDropdown.Item>
            </NavDropdown>

            <Form className="petly-search" onSubmit={handleSearch}>
              <Form.Control
                name= "buscar"
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                defaultValue={busqueda}/>

              <button type="submit" className="petly-btn-search">
                Buscar
              </button>
            </Form>
          </div>
        </Container>

      </div>

    </>

  );

}

export default NavComponent;