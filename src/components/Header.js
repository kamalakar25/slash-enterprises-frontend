import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  X as CloseIcon,
  MenuIcon,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://slash-enterprises-backend.onrender.com/api";

function Header(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Fetch cart items count from backend
  const fetchCartCount = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${user.id}`);
      const cartItems = response.data.items || [];
      const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(itemCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const scriptId = "google-translate-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      const element = document.getElementById("google_translate_element");
      if (element && element.innerHTML.trim() === "") {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ar",
            autoDisplay: false,
            defaultLanguage: savedLanguage,
          },
          "google_translate_element"
        );

        if (savedLanguage && savedLanguage !== 'en') {
          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
              selectElement.value = savedLanguage;
              selectElement.dispatchEvent(new Event('change'));
            }
          }, 1000);
        }
      }
    };

    const handleLanguageChange = () => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.addEventListener('change', (e) => {
          const selectedLanguage = e.target.value;
          localStorage.setItem('selectedLanguage', selectedLanguage);

          const previousLanguage = localStorage.getItem('previousLanguage');
          if (selectedLanguage !== previousLanguage) {
            localStorage.setItem('previousLanguage', selectedLanguage);
            window.location.reload();
          }
        });
      }
    };

    const checkForSelectElement = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        handleLanguageChange();
        clearInterval(checkForSelectElement);
      }
    }, 500);

    return () => {
      clearInterval(checkForSelectElement);
    };
  }, []);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (reload) {
      window.location.reload();
      setReload(false);
    }
  }, [reload]);

  const handleReloadClick = () => {
    setReload(true);
  };

  const handleLogout = () => {
    logout();
    document.cookie = "googtrans=/en/en; path=/";
    localStorage.removeItem("selectedLanguage");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <motion.div>
        <AppBar
          sx={{
            background: "rgba(37, 38, 64, 0.9)",
            transition: "all 0.3s ease",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #0077b6, #2ecc71)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    "@media (max-width: 320px)": {
                      fontSize: "10px",
                    },
                    "@media (min-width: 321px) and (max-width: 380px)": {
                      fontSize: "12px",
                    },

                  }}
                  onClick={() => navigate("/")}
                >
                  Slash Enterprises
                </Typography>
              </motion.div>

              {/* Right Menu */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Language" placement="bottom">
                  <Box onClick={handleReloadClick} sx={{ cursor: 'pointer' }}>
                    <Typography>🌐</Typography>
                  </Box>
                </Tooltip>
                <Box sx={{ display: props.customStyles }}>
                  <div id="google_translate_element" />
                  <style>
                    {`
                      #google_translate_element select {
                        background-color: #f5f5f5;
                                                border: 2px solid rgba(26, 133, 190, 0.53);

                        border-radius: 8px;
                        padding: 8px;
                        font-size: 14px;
                        color: #333;
                        outline: none;
                        transition: all 0.3s ease;
                      }
                      #google_translate_element select:hover {
                        border-color: #0056b3;
                      }
                      #google_translate_element select:focus {
                        border-color: #004085;
                        box-shadow: 0 0 8px rgba(0, 91, 187, 0.4);
                      }
                    `}
                  </style>
                </Box>
                {/* Cart Icon */}
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ display: props.customStyles }}
                >
                  <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Logout Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Logout
                </Button>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 350,
            background: "rgba(37, 38, 64, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Menu
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(false)}
              style={{ width: "80px" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;