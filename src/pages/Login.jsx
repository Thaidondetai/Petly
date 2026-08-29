import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";

function Login() {
  return (
    <>
      <NavComponent />

      <main className="petly-simple-page">
        <div className="login-container">

          <span className="section-label">
            PETLY
          </span>

          <h1 className="petly-title">
            Iniciar sesión
          </h1>

          <p className="petly-subtitle">
            Accede a tu cuenta de Petly.
          </p>

          <button type="button" className="btn petly-btn w-100">
            Continuar con Google
          </button>

        </div>
      </main>
      <FooterComponent />
    </>
  );
}

export default Login;