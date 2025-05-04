import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../styles/swiper.css";

// import required modules
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { PictureAsPdf } from "@mui/icons-material";

import { CarouselProps, CarouselItem } from "../types";

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [swiperData, setSwiperData] = useState<CarouselItem[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setSwiperData(data);
  }, [data]);

  if (!swiperData) {
    return <p>Loading Data....</p>;
  }

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  const activeItem = swiperData[activeIndex];

  return (
    <div className="carousel-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={2}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
        className="mySwiper"
        loop={true}
      >
        {swiperData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="slide-content">
              <img src={item.url} alt={item.name} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {activeItem && (
        <div className="item-details">
          <h3>{activeItem.name}</h3>
          <p>Автор: {activeItem.author}</p>
          {activeItem.Format && <p>Формат: {activeItem.Format}</p>}
          {activeItem.Pages && <p>{activeItem.Pages} стр.</p>}
          {activeItem.Year && <p>{activeItem.Year}г.</p>}

          {activeItem.link && activeItem.link.trim() !== "" && (
            <a
              href={activeItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="item-link"
            >
              <PictureAsPdf fontSize="large" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;
