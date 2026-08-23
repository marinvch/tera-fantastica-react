import React, { useEffect, useRef, useState } from "react";
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

const Carousel: React.FC<CarouselProps> = ({
  data,
  effectMode = "coverflow",
  onOpenLink,
  initialUid,
  onActiveChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const swiperData: ArchiveItem[] = data;
  // An unknown uid is not an error: deep links outlive catalogues, so fall back to the first item.
  const initialIndex = Math.max(
    0,
    swiperData.findIndex((item) => item.uid === initialUid),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperType | null>(null);

  if (swiperData.length === 0) {
    return <p>No items available.</p>;
  }

  // initialSlide only applies on mount, but the uid can change under a mounted carousel — picking
  // a search result while already on /books is exactly that. Follow the prop when it moves.
  useEffect(() => {
    const swiper = swiperRef.current;
    const target = swiperData.findIndex((item) => item.uid === initialUid);

    if (!swiper || target < 0 || swiper.realIndex === target) {
      return;
    }

    // slideToLoop, not slideTo: with loop enabled the raw indices count cloned slides.
    if (swiper.params.loop) {
      swiper.slideToLoop(target);
    } else {
      swiper.slideTo(target);
    }
  }, [initialUid, swiperData]);

  const handleSlideChange = (swiper: SwiperType) => {
    // realIndex, not activeIndex: loop mode clones slides, so activeIndex counts the clones.
    setActiveIndex(swiper.realIndex);
    const item = swiperData[swiper.realIndex];
    if (item) {
      onActiveChange?.(item);
    }
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
        initialSlide={initialIndex}
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
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
