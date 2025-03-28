import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const EXCHANGE_RATE_INR_TO_AED = 0.044;

function ProductShowcase({ category }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );

  useEffect(() => {
    fetchProducts();
    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/products${category && category !== "all" ? `/${category}` : ""}`
      );
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getGridSize = () => {
    const screenWidth = window.innerWidth;
  
    if (screenWidth < 600) return 6;  // 2 cards per row for small screens
    if (screenWidth < 960) return 4;  // 3 cards per row for tablets
    if (screenWidth < 1280) return 3;  // 4 cards per row for small desktops
    return 2;  // 6 cards per row for large screens
  };
  

  const getRentalPriceDetails = (rentalRates) => {
    const isArabic = selectedLanguage === "ar";
    const currencySymbol = isArabic ? "د.إ" : "₹";
    const conversionRate = isArabic ? EXCHANGE_RATE_INR_TO_AED : 1;

    return {
      symbol: currencySymbol,
      daily: (rentalRates?.daily * conversionRate).toFixed(2),
      weekly: (rentalRates?.weekly * conversionRate).toFixed(2),
      monthly: (rentalRates?.monthly * conversionRate).toFixed(2),
    };
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          
        }}
      >
        <CircularProgress sx={{ color: "#00cc99", size: 40 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          bgcolor: "#1a1a1a",

        }}
      >
        <Typography sx={{ color: "#ff6666", fontSize: "1.25rem" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      id="productshowcase"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: "#1a1a1a",
        borderRadius: "0px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
        direction: selectedLanguage === "ar" ? "rtl" : "ltr",
        minHeight: "50vh",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{
          background: "linear-gradient(135deg, #0077b6, #2ecc71)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        Rental Products
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {products.map((product, index) => {
          const { symbol, daily, weekly, monthly } = getRentalPriceDetails(
            product.rentalRates
          );

          return (
            <Grid item xs={getGridSize()} key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  onClick={() => handleCardClick(product._id)}
                  sx={{
                    bgcolor: "#2d2d2d",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    maxWidth: { xs: "100%", sm: 200, md: 290 }, // Smaller card width
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 30px rgba(0, 204, 153, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: { xs: 100, sm: 120, md: 180 }, // Reduced height
                      objectFit: "fill",
                      bgcolor: "#333",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                    image={`https://slash-enterprises-backend.onrender.com${product.image}`}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: { xs: 1, sm: 1.5 },
                      bgcolor: "#2d2d2d",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#fff",
                          mb: 0.5,
                          fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#b0b0b0",
                          mb: 0.5,
                          fontSize: { xs: "0.65rem", sm: "0.7rem" },
                        }}
                      >
                        Model: {product.model}
                      </Typography>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#00A9E0",
                            fontWeight: "medium",
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          }}
                        >
                          {symbol}
                          {daily} / day
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#b0b0b0",
                            fontSize: { xs: "0.6rem", sm: "0.65rem" },
                          }}
                        >
                          {symbol}
                          {weekly} / wk • {symbol}
                          {monthly} / mo
                        </Typography>
                      </Box>
                      <Chip
                        label={product.inStock ? "In Stock" : "Out of Stock"}
                        color={product.inStock ? "success" : "error"}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: product.inStock ? "#00cc99" : "#ff6666",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: { xs: "0.6rem", sm: "0.65rem" },
                          padding: "1px 4px",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ProductShowcase;