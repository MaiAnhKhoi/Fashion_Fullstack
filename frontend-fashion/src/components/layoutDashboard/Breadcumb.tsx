import { Link } from "react-router-dom";

export default function Breadcumb({
  pageTitle,
  pageName,
}: {
  pageTitle: string;
  pageName: string;
}) {
  return (
    <section
      className="tf-page-title"
      style={{
        backgroundImage:
          "url(https://themesflat.co/html/vineta/images/section/page-title.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="box-title text-center">
          <h4 className="title">{pageTitle}</h4>
          <div className="breadcrumb-list">
            <Link className="breadcrumb-item" to={`/`}>
              Home
            </Link>
            <div className="breadcrumb-item dot">
              <span />
            </div>
            <div className="breadcrumb-item current">{pageName}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
