import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow } from "swiper";
import "swiper/swiper.min.css";
import '../styles/swiper.css'

SwiperCore.use([EffectCoverflow]);

const Carousel = ({ data }) => {
  const [swiperData, setSwiperData] = useState(null);
  console.log(swiperData);
  useEffect(() => {
    setSwiperData(data);
  }, [data]);

  return (
    <>
      {swiperData === null ? (
        <p>Loading Data....</p>
      ) : (
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
          onSlideChange={() => { }}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {swiperData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="item-content">
                <div className="item-image">
                  <img src={item.url} alt="" className="item-image" />
                </div>
                <p>{item.name}</p>
                <p>Автор: {item.author}</p>
                <p>{item.Format}</p>
                <p>{item.Pages}</p>
                <p>{item.Year}г.</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Carousel;
