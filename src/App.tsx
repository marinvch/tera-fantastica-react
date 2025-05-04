import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
  Divider
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";

import Home from "./components/Layout/Home";
import Newspaper from "./pages/Newspaper";
import Magazines from "./pages/Magazines";
import Books from "./pages/Books";

const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerWidth = isMobile ? "100%" : "240px";

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { sm: `calc(100% - ${drawerWidth})` },
            ml: { sm: drawerWidth },
            backgroundColor: '#111',
            boxShadow: 3
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              Тера Фантастика
            </Typography>
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
              backgroundColor: "#111",
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
            px: 2
          }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                mb: 1
              }}
            >
              ТЕРА ФАНТАСТИКА
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center' 
              }}
            >
              Архив на българската фантастика
            </Typography>
          </Box>
          
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          
          <List sx={{ mt: 2 }}>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/" 
                sx={{ 
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }} 
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>
                  <HomeIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Начало" 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: 'medium'
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/newspaper" 
                sx={{ 
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }} 
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>
                  <MenuBookIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Вестник" 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: 'medium'
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/magazines" 
                sx={{ 
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }} 
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>
                  <ImportContactsIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Списания" 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: 'medium'
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/books" 
                sx={{ 
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }} 
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>
                  <LocalLibraryIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Книги" 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: 'medium'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </List>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Typography 
              variant="caption" 
              component="p" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)', 
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
            width: { sm: `calc(100% - ${drawerWidth})` },
            overflow: 'auto',
            height: '100vh'
          }}
        >
          <Toolbar /> {/* This creates space for the fixed AppBar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newspaper" element={<Newspaper />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;