import { Link } from "react-router-dom";
import CountdownTimer from "@/components/common/Countdown";

const targetDate = new Date();
targetDate.setHours(targetDate.getHours() + 12);
export default function Banner() {
  return (
    <section>
      <div className="container">
        <div className="s-banner-countdown banner-cd-fashion">
          <div className="image">
            <img
              src="https://themesflat.co/html/vineta/images/banner/fashion-1.jpg"
              alt=""
              className="lazyload"
              width={1440}
              height={488}
            />
          </div>
          <div className="banner-content text-center">
            <div className="box-title wow fadeInUp">
              <p className="season text-md fw-medium">SUMMER SALE</p>
              <h2 className="fw-medium">50% OFF</h2>
              <p className="sub text-md fw-medium">WITH PROMOTE CODE: 12D34E</p>
            </div>
            <div className="box-countdown d-flex justify-content-center wow fadeInUp">
              <div className="wg-countdown-2">
                <span className="js-countdown">
                  <CountdownTimer
                    targetDate={targetDate.toISOString()}
                    style={2}
                  />
                </span>
              </div>
            </div>
            <div className="box-btn wow fadeInUp">
              <Link
                to={`/shop-collection-list`}
                className="tf-btn btn-white hover-primary"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
