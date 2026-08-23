import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  ListItemButton,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  Container,
  useTheme
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import Home from "./pages/Home";
import Newspaper from "./pages/Newspaper";
import Magazines from "./pages/Magazines";
import Books from "./pages/Books";
import GlobalSearch from "./components/GlobalSearch";

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Width of the permanent drawer, in px. Kept as a bare number so each rule can carry its own
  // unit: interpolating it directly produced `calc(100% - 220)`, invalid CSS that the browser
  // drops — which let the AppBar run full-width underneath the drawer and hid the search results.
  const DRAWER_PX = 220;
  const drawerWidth = isMobile ? "100%" : `${DRAWER_PX}px`;
  const contentWidth = isMobile ? "100%" : `calc(100% - ${DRAWER_PX}px)`;
  const contentOffset = isMobile ? 0 : `${DRAWER_PX}px`;

  const navItems = [
    { title: "Начало", path: "/", icon: <HomeIcon /> },
    { title: "Вестник", path: "/newspaper", icon: <MenuBookIcon /> },
    { title: "Списания", path: "/magazines", icon: <ImportContactsIcon /> },
    { title: "Книги", path: "/books", icon: <LocalLibraryIcon /> }
  ];

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <AppBar 
          position="fixed" 
          sx={{ 
            width: contentWidth,
            ml: contentOffset,
            backgroundColor: "#f7f4ed",
            color: "#171512",
            borderBottom: "1px solid #ddd4c5",
            boxShadow: "none",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              py: 1.5,
              px: { xs: 1, md: 3 },
              flexWrap: "nowrap",
              minHeight: "auto",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, flexShrink: 0 }}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <GlobalSearch />
            </Box>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          anchor="left"
          open={drawerOpen}
          onClose={isMobile ? handleDrawerToggle : undefined}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: "#f7f4ed",
              borderRight: '1px solid #ddd4c5',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: 3,
            px: 2.5,
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#171512',
                fontWeight: 700,
                fontFamily: "'Roboto Slab', serif",
                letterSpacing: '0.04em',
                mb: 0.5,
              }}
            >
              ТЕРА ФАНТАСТИКА
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#5d574a',
                fontStyle: 'italic',
              }}
            >
              Архив на българската фантастика
            </Typography>
          </Box>
          
          <Divider sx={{ backgroundColor: '#ddd4c5' }} />
          
          <List sx={{ mt: 1.5, px: 1 }}>
            {navItems.map((item) => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton 
                  component={NavLink}
                  to={item.path}
                  sx={{ 
                    color: '#171512',
                    py: 1.25,
                    px: 1.25,
                    borderRadius: 999,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: '#ede6d8',
                    },
                    '&.active': {
                      backgroundColor: '#171512',
                      color: '#f7f4ed',
                      '& .MuiListItemIcon-root': {
                        color: '#f7f4ed',
                      },
                    },
                  }}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                >
                  <ListItemIcon sx={{
                    color: "inherit",
                    minWidth: '40px',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: 'medium',
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Typography 
              variant="caption" 
              component="p" 
              sx={{ 
                color: '#7a7567', 
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              © {new Date().getFullYear()} Тера Фантастика
            </Typography>
          </Box>
        </Drawer>
        
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            width: contentWidth,
            overflow: 'auto',
            height: '100vh',
            backgroundColor: '#f3efe6',
          }}
        >
          <Toolbar /> {/* This creates space for the fixed AppBar */}
          <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, pb: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/newspaper" element={<Newspaper />} />
              <Route path="/magazines" element={<Magazines />} />
              <Route path="/books" element={<Books />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
};

export default App;