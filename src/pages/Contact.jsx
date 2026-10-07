import FooterComponent from "../components/FooterComp";
import NavComponent from "../components/NavComp";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();

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
              {t("contact_title")}
            </h1>

            <p className="petly-subtitle">
              {t("contact_subtitle")}
            </p>
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}

export default Contact;