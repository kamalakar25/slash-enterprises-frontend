import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; // Assuming this is a custom component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const EXCHANGE_RATE_INR_TO_AED = 0.044;

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery("(min-width:2000px)");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );
  const [rentalPeriod, setRentalPeriod] = useState("daily");
  const [rentalCount, setRentalCount] = useState(1);

  useEffect(() => {
    fetchProductDetails();
    const handleStorageChange = (e) => {
      if (e.key === "selectedLanguage") {
        setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/products/detail/${productId}`;
      const response = await axios.get(url);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch product details. Please try again later.");
      toast.error("Error loading product details");
    } finally {
      setLoading(false);
    }
  };

  const getUserId = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) throw new Error("User not logged in");
    const userResponse = await axios.get(`${API_BASE_URL}/users/getUserId/${userEmail}`);
    return userResponse.data.userId;
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      const userId = await getUserId();
      await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
        rentalPeriod,
        rentalCount: Number(rentalCount),
      });
      toast.success(
        `${product.name} added to cart for ${rentalCount} ${rentalPeriod === "daily" ? "day(s)" : rentalPeriod === "weekly" ? "week(s)" : "month(s)"}!`,
        { position: "bottom-center", autoClose: 2000 }
      );
    } catch (error) {
      toast.error(error.message === "User not logged in" ? "Please log in to add items to cart" : "Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
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

  const getMaxCount = () => {
    switch (rentalPeriod) {
      case "daily": return 30;
      case "weekly": return 12;
      case "monthly": return 6;
      default: return 1;
    }
  };

  const handleRentalCountChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), getMaxCount()));
    setRentalCount(value);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#1a1a1a", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress sx={{ color: "#00cc99" }} />
        </Box>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#1a1a1a", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Alert severity="error" sx={{ width: "100%", maxWidth: "sm" }}>
            {error || "Product not found."}
          </Alert>
        </Box>
      </Box>
    );
  }

  const { symbol, daily, weekly, monthly } = getRentalPriceDetails(product.rentalRates);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0e154d", // Full-screen dark background
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with Spacing */}
      <Box sx={{ bgcolor: "#1a1a1a", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}>
        <Header />
      </Box>

      {/* Content Container */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: isLargeScreen ? "1800px" : "xl",
          flexGrow: 1,
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#1a1a1a", // Background only on content
          borderRadius: { xs: 0, md: "20px" },
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
          mt: { xs: 2, sm: 3, md: 4 }, // Gap below header
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ width: "100%" }}
        >
          {/* Back Button */}
          <Box sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "#00cc99",
                bgcolor: "rgba(0, 204, 153, 0.1)",
                "&:hover": { bgcolor: "rgba(0, 204, 153, 0.2)" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="body1" sx={{ color: "#fff", ml: 1, fontWeight: "medium" }}>
              Back
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="stretch">
            {/* Image Section */}
            <Grid item xs={12} sm={6} md={5}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderRadius: "20px",
                  overflow: "hidden",
                  bgcolor: "#2d2d2d",
                  // height: "100%",
                  position: "relative",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Box
                  component={motion.img}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: { xs: 220, sm: 320, md: 420 },
                    objectFit: "contain",
                    borderRadius: "16px",
                  }}
                />
              </Paper>
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} sm={6} md={7}>
              <Box
                sx={{
                  bgcolor: "#2d2d2d",
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid rgba(0, 204, 153, 0.2)",
                }}
              >
                {/* Product Name with Unique Gradient */}
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1.5,
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    background: "linear-gradient(45deg, #0077b6, #2ecc71)",

                    // background: "linear-gradient(90deg, #00cc99 0%, #ffcc00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  {product.name}
                </Typography>

                {/* Model */}
                <Typography
                  variant="body1"
                  sx={{ color: "#b0b0b0", mb: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  Model: {product.model}
                </Typography>

                {/* Rating */}
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={product.rating || 4.5} readOnly precision={0.5} sx={{ color: "#ffcc00" }} />
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    ({product.reviews || 12} reviews)
                  </Typography>
                </Box>

                {/* Stock Status */}
                <Chip
                  label={product.inStock ? "In Stock" : "Out of Stock"}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: product.inStock ? "#00cc99" : "#ff6666",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "4px 8px",

                    width: { xs: "100%", sm: "75%", md: "50%", lg: "40%" }, // Responsive width
                  }}
                />

                {/* Pricing */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00cc99",
                      fontWeight: "medium",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      textShadow: "0 2px 4px rgba(0, 204, 153, 0.3)",
                    }}
                  >
                    {symbol}{daily} / day
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#b0b0b0", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                  >
                    {symbol}{weekly} / week • {symbol}{monthly} / month
                  </Typography>
                </Box>

                {/* Rental Options */}
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: "#ffb400", "&.Mui-focused": { color: "#00cc99" } }}>
                      Rental Period
                    </InputLabel>
                    <Select
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value)}
                      label="Rental Period"
                      sx={{
                        bgcolor: "#1a1a2e", // Dark background
                        color: "#fff", // White text
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffb400", // Yellow border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffcc00", // Lighter yellow on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffb400",
                        },
                      }}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>

                  {/* <TextField
                    fullWidth
                    type="number"
                    label={`Number of ${rentalPeriod === "daily" ? "Days" : rentalPeriod === "weekly" ? "Weeks" : "Months"}`}
                    value={rentalCount}
                    onChange={handleRentalCountChange}
                    inputProps={{ min: 1, max: getMaxCount() }}
                    sx={{
                      bgcolor: "#333",
                      borderRadius: "12px",
                      "& .MuiInputLabel-root": { color: "#b0b0b0" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#00cc99" },
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "#00cc99" },
                        "&:hover fieldset": { borderColor: "#00cc99" },
                        "&.Mui-focused fieldset": { borderColor: "#00cc99" },
                      },
                    }}
                  /> */}
                </Box>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#fff",
                    mb: 3,
                    lineHeight: 1.7,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontStyle: "italic",
                  }}
                >
                  {product.description}
                </Typography>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={addingToCart ? null : <ShoppingCart />}
                  sx={{
                    width: "100%",
                    py: 1.5,
                    bgcolor: "#00cc99",
                    "&:hover": { bgcolor: "#00b386" },
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(1, 61, 12, 0.71), inset 0 2px 4px rgba(2, 25, 75, 0.25)",

                    position: "relative",
                    overflow: "hidden",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      transition: "left 0.3s ease",
                    },
                    "&:hover:before": { left: "100%" },
                  }}
                  onClick={addToCart}
                  disabled={!product.inStock || addingToCart}
                >
                  {addingToCart ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    <Typography variant="button" sx={{ fontWeight: "bold", color: "#fff" }}>
                      Add to Cart
                    </Typography>
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <ToastContainer />
    </Box>
  );
}

export default ProductDetail;