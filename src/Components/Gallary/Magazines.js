import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow } from "swiper";
import "./gallary.css";
import "swiper/swiper.min.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
import "swiper/components/pagination/pagination.min.css"
import magazines from "../../Assets/magazines/data/data.json";

SwiperCore.use([EffectCoverflow]);
function Magazines() {
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      loop={true}
      onSlideChange={() => {}}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {magazines.map((magazine) => (
        <SwiperSlide key={magazine.id}>
          <div className="magazine-content">
            <div className="magazine-image">
              <img src={magazine.url} alt="" className="magazine-image" />
            </div>
            <p>{magazine.text.name}</p>
            <p>Автор: {magazine.text.author}</p>
            <p>{magazine.text.Format}</p>
            <p>{magazine.text.Pages}</p>
            <p>{magazine.text.Year}г.</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Magazines;
