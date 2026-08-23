import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useMediaQuery, useTheme } from "@mui/material";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import "swiper/css/pagination";

import "../styles/swiper.css";

// import required modules
import { A11y, EffectCoverflow, EffectFlip, Keyboard, Pagination } from "swiper/modules";
import { PictureAsPdf } from "@mui/icons-material";

import { CarouselProps, ArchiveItem } from "../types";

const Carousel: React.FC<CarouselProps> = ({ data, effectMode = "coverflow", onOpenLink }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperData: ArchiveItem[] = data;

  if (swiperData.length === 0) {
    return <p>No items available.</p>;
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const activeItem = swiperData[activeIndex];
  const isFlipMode = effectMode === "flip";
  const isLoopEnabled = swiperData.length > 2;
  const swiperDirection = isMobile ? "vertical" : "horizontal";

  return (
    <div className="carousel-container">
      <Swiper
        effect={effectMode}
        direction={swiperDirection}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={isMobile ? 1.15 : "auto"}
        spaceBetween={isMobile ? 18 : 24}
        initialSlide={0}
        speed={700}
        watchSlidesProgress={true}
        {...(!isFlipMode
          ? {
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: isMobile ? 120 : 180,
              modifier: isMobile ? 1.35 : 1.8,
              slideShadows: false,
            },
          }
          : {
            flipEffect: {
              slideShadows: false,
              limitRotation: true,
            },
          })}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        a11y={{
          enabled: true,
        }}
        navigation={false}
        modules={[EffectCoverflow, EffectFlip, Pagination, Keyboard, A11y]}
        onSlideChange={handleSlideChange}
        className={`mySwiper ${isMobile ? "is-mobile" : "is-desktop"}`}
        loop={isLoopEnabled}
      >
        {swiperData.map((item) => (
          <SwiperSlide key={item.uid}>
            <div className="slide-content">
              <img src={item.url} alt={item.name} loading="lazy" decoding="async" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {activeItem && (
        <div className="item-details">
          <h3>{activeItem.name}</h3>
          <p className="item-meta">
            <span className="item-meta-label">Автор</span>
            <span className="item-meta-value">{activeItem.author}</span>
          </p>
          {activeItem.format && (
            <p className="item-meta">
              <span className="item-meta-label">Формат</span>
              <span className="item-meta-value">{activeItem.format}</span>
            </p>
          )}
          {activeItem.pages && (
            <p className="item-meta">
              <span className="item-meta-label">Страници</span>
              <span className="item-meta-value">{activeItem.pages} стр.</span>
            </p>
          )}
          {activeItem.year && (
            <p className="item-meta">
              <span className="item-meta-label">Година</span>
              <span className="item-meta-value">{activeItem.year} г.</span>
            </p>
          )}

          {activeItem.link && activeItem.link.trim() !== "" && (
            onOpenLink ? (
              <button
                type="button"
                className="item-link item-link-button"
                onClick={() => onOpenLink(activeItem)}
                aria-label={`Отвори ${activeItem.name}`}
              >
                <PictureAsPdf fontSize="large" />
              </button>
            ) : (
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="item-link"
                >
                  <PictureAsPdf fontSize="large" />
                </a>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;
