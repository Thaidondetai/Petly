import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";

function Contact() {
  return (
    <>
      <NavComponent />
      
      <main className="petly-simple-page py-5">
        <div className="container">
          <div className="simple-content">
            <span className="section-label">
              PETLY
            </span>

            <h1 className="petly-title fs-2 mb-2">
              Contacto
            </h1>

            <p className="petly-subtitle">
              ¿Tienes alguna duda? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}

export default Contact;