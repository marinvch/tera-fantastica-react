import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import books from "../../Assets/books/data/data.json";

function Books() {
  return (
    <>
      <Swiper wrapperTag="ul" spaceBetween={10} slidesPerView={5} loop={true}>
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
