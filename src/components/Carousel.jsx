import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";

function CarouselComponent() {
  const { t } = useTranslation();

  return (
    <Carousel className="petly-carousel">
      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>
              {t("hero_slide1_title_line1")}<br />
              {t("hero_slide1_title_line2")}
            </h1>
            <p>
              {t("hero_slide1_desc_line1")}<br />
              {t("hero_slide1_desc_line2")}
            </p>
          </div>
          <div className="hero-image">
            <img
              src="https://www.vitakraft.com/fileadmin/_processed_/4/3/csm_por_qu%C3%A9_duerme_tanto_mi_gato_876d94bdc3.jpg"
              alt="Productos para mascotas"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>
              {t("hero_slide2_title_line1")}<br />
              {t("hero_slide2_title_line2")}
            </h1>
            <p>
              {t("hero_slide2_desc_line1")}<br />
              {t("hero_slide2_desc_line2")}
            </p>
          </div>
          <div className="hero-image">
            <img
              src="https://cpdelivery.cl/wp-content/uploads/2025/05/mascotas-jugando-gatos-y-perros-mostrando-amistad-1536x861.jpg"
              alt="Productos para perros y gatos"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>
              {t("hero_slide3_title_line1")}<br />
              {t("hero_slide3_title_line2")}
            </h1>
            <p>
              {t("hero_slide3_desc_line1")}<br />
              {t("hero_slide3_desc_line2")}
            </p>
          </div>
          <div className="hero-image">
            <img
              src="https://clinicalaveterinaria.it/wp-content/uploads/2017/05/microchip-cane-gatto-coniglio.jpg"
              alt="Productos para mascotas"
            />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselComponent;