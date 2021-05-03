import React from "react";
import SwiperCore, { EffectCube } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import magazines from "../../Assets/magazines/data/data.json";

SwiperCore.use([EffectCube]);
function Magazines() {
  return (
    <Swiper
      effect="cube"
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
