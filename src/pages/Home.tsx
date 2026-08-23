import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getBooks, getMagazines } from "../archive";
import { normalizePublicAssetPath } from "../utils/archivePaths";

/**
 * The hero cycles one cover from each part of the archive. Covers come from the archive module,
 * so adding an issue to the JSON changes what the front page shows — there is no second list to
 * keep in sync.
 */
const heroSlides = [
  { url: normalizePublicAssetPath("NewspaperImages/tfnpp1.png"), label: "Вестник" },
  { url: getMagazines()[0]?.url, label: "Списание" },
  { url: getBooks()[0]?.url, label: "Книга" },
].filter((slide): slide is { url: string; label: string } => Boolean(slide.url));

const SLIDE_MS = 5000;

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length < 2) {
      return;
    }

    // Someone who has asked for less motion gets the first cover and no cycling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, SLIDE_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        // No forced viewport height on mobile: with one column it pushed the cover a full
        // screen down, below the fold.
        minHeight: { xs: "auto", md: "calc(100vh - 64px)" },
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
        gap: { xs: 2.5, md: 5 },
        px: { xs: 1, md: 2 },
        py: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          py: { xs: 0, md: 6 },
          order: { xs: 2, md: 1 },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "#7a7567",
            letterSpacing: "0.14em",
          }}
        >
          Дигитален архив
        </Typography>

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            lineHeight: 1.05,
            maxWidth: "12ch",
            color: "#171512",
            mb: 3,
          }}
        >
          Тера Фантастика
        </Typography>

        <Box sx={{ maxWidth: 720 }}>
          <Typography
            variant="h6"
            paragraph
            sx={{
              marginBottom: 3,
              color: "#322d24",
              maxWidth: "34ch",
            }}
          >
            Малък архив за четене на книги, списания и вестник от Тера Фантастика на телефон и настолен компютър.
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#5d574a",
            }}
          >
            От 1999 година насам изданията на Тера Фантастика пазят важна част от българската жанрова сцена. Тук архивът е подреден така, че съдържанието да остава на преден план, без тежък интерфейс и без излишни ефекти.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button component={RouterLink} to="/newspaper" variant="contained" sx={{ backgroundColor: "#171512", "&:hover": { backgroundColor: "#2a251d" } }}>
              Отвори вестника
            </Button>
            <Button component={RouterLink} to="/books" variant="outlined" sx={{ borderColor: "#c8bfae", color: "#171512" }}>
              Разгледай книгите
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        aria-label={`Корица: ${heroSlides[activeSlide]?.label ?? ""}`}
        sx={{
          position: "relative",
          overflow: "hidden",
          order: { xs: 1, md: 2 },
          minHeight: { xs: 360, md: 560 },
          borderRadius: 6,
          border: "1px solid #d8d1c2",
          backgroundColor: "#fffdf8",
          boxShadow: "0 18px 40px rgba(23, 21, 18, 0.08)",
        }}
      >
        {heroSlides.map((slide, index) => (
          <Box
            key={slide.url}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${slide.url}')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              // `contain`, not `cover`: the three covers have different aspect ratios (a
              // broadsheet page next to two portrait covers) and cover cropped the titles off.
              backgroundSize: "contain",
              opacity: index === activeSlide ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
            }}
          />
        ))}

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ position: "absolute", bottom: 12, left: 0, right: 0, justifyContent: "center" }}
        >
          {heroSlides.map((slide, index) => (
            <Box
              key={slide.url}
              sx={{
                width: index === activeSlide ? 18 : 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: index === activeSlide ? "#171512" : "rgba(23,21,18,0.28)",
                transition: "width .4s ease, background-color .4s ease",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
