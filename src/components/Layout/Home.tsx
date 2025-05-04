import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Home: React.FC = () => {
  // Use newspapper.jpg as background since it's already in the assets
  const backgroundImagePath = `${process.env.PUBLIC_URL}/Assets/newspaper/dzc_output_images/newspapper.jpg`;

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 64px)", // Subtract app bar height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay for better text visibility
          zIndex: 1,
        }
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: "relative", 
          zIndex: 2, 
          color: "white",
          padding: { xs: 3, md: 5 },
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 4,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}
        >
          Тера Фантастика
        </Typography>
        
        <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
          <Typography 
            variant="h5" 
            paragraph 
            sx={{ 
              marginBottom: 3,
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)" 
            }}
          >
            Българска фантастика за всички любители на жанра
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontSize: "1.1rem", 
              lineHeight: 1.7,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)" 
            }}
          >
            От 1999 година списание "Тера Фантастика" допринася за развитието на българската научна фантастика и фентъзи. 
            Създадено от Юрий Илков, списанието бързо се превръща в любимо четиво за феновете на жанра.
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontSize: "1.1rem", 
              lineHeight: 1.7,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)" 
            }}
          >
            В продължение на години, "Тера Фантастика" публикува както оригинални разкази и новели от български автори, 
            така и преводи на световноизвестни произведения. Освен това, списанието съдържа критически статии, 
            рецензии и интервюта с писатели от жанра.
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontSize: "1.1rem", 
              lineHeight: 1.7,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)" 
            }}
          >
            Този уебсайт е дигитален архив на изданията на "Тера Фантастика", 
            създаден с цел да запази и направи достъпно това богато литературно наследство 
            за новите поколения любители на фантастиката и фентъзито.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
