import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";

function Login() {
  const handleGoogleLogin = () => {
    const domain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

    const cognitoUrl = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&identity_provider=Google&scope=email+openid+profile`;

    window.location.href = cognitoUrl;
  };

  return (
    <>
      <NavComponent />

      <main className="petly-simple-page py-5">
        <div className="container d-flex justify-content-center">
          <div className="login-container">
            <span className="section-label">
              PETLY
            </span>

            <h1 className="petly-title fs-3 mb-2">
              Iniciar sesión
            </h1>

            <p className="petly-subtitle mb-4">
              Accede a tu cuenta de Petly.
            </p>

            <button 
              type="button" 
              className="btn petly-btn w-100 py-2"
              onClick={handleGoogleLogin}
            >
              Continuar con Google
            </button>
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}

export default Login;