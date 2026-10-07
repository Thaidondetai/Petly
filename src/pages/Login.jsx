import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();

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
              {t("login_title")}
            </h1>

            <p className="petly-subtitle mb-4">
              {t("login_subtitle")}
            </p>

            <button 
              type="button" 
              className="btn petly-btn w-100 py-2"
              onClick={handleGoogleLogin}
            >
              {t("continue_google")}
            </button>
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}

export default Login;