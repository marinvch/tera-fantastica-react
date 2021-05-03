import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow } from "swiper";
import "./gallary.css";
import "swiper/swiper.min.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css";
import "swiper/components/pagination/pagination.min.css";
import books from "../../Assets/books/data/data.json";

SwiperCore.use([EffectCoverflow]);

function Books() {
  return (
    <>
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
        {books.map((books) => (
          <SwiperSlide key={books.id}>
            {console.log(books)}
            <div className="books-content">
              <div className="books-image">
                <img src={books.url} alt="" className="books-image" />
              </div>
              <p>{books.text.name}</p>
              <p>Автор: {books.text.author}</p>
              <p>{books.text.Format}</p>
              <p>{books.text.Pages}</p>
              <p>{books.text.Year}г.</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Books;
