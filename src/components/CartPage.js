import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Paper,
  Container,
  IconButton,
  Dialog,
} from "@mui/material";
import { DeleteOutline, ShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MultiStepCheckoutForm from "./MultiStepCheckoutForm.js";
import Header from "./Header.js";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const EXCHANGE_RATE_INR_TO_AED = 0.044; // INR to AED for Arabic

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [userId, setUserId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  useEffect(() => {
    if (!userEmail) {
      toast.error("User not logged in!");
      navigate("/login");
      return;
    }
    fetchUserId();

    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userEmail, navigate]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/getUserId/${userEmail}`);
      setUserId(response.data.userId);
    } catch (err) {
      toast.error("Failed to fetch user ID.");
      console.error("Error fetching user ID:", err);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      const cartData = response.data || { items: [] };
      setCart({ ...cartData, items: cartData.items || [] });
      setError(null);
    } catch (err) {
      setError("Failed to load cart.");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    try {
      await axios.delete(`${API_BASE_URL}/cart/${userId}/item/${productId}`);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item?.productId?._id !== productId),
      }));
      toast.success("Item removed from cart!");
    } catch (err) {
      toast.error("Failed to remove item.");
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, change) => {
    if (!productId) return;
    const item = cart.items.find((item) => item?.productId?._id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    try {
      await axios.patch(`${API_BASE_URL}/cart/${userId}/item/${productId}`, {
        quantity: newQuantity,
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item?.productId?._id === productId ? { ...item, quantity: newQuantity } : item
        ),
      }));
    } catch (err) {
      toast.error("Failed to update quantity.");
      console.error("Error updating quantity:", err);
    }
  };

  const getRentalPriceDetails = (item) => {
    const isArabic = selectedLanguage === "ar";
    const currencySymbol = isArabic ? "د.إ" : "₹";
    const conversionRate = isArabic ? EXCHANGE_RATE_INR_TO_AED : 1;

    const rentalRates = item.productId?.rentalRates || { daily: 0, weekly: 0, monthly: 0 };
    const rentalPeriod = item.rentalPeriod || "daily";
    const rentalCount = item.rentalCount || 1;

    let basePrice = 0;
    switch (rentalPeriod) {
      case "daily":
        basePrice = rentalRates.daily * rentalCount;
        break;
      case "weekly":
        basePrice = rentalRates.weekly * rentalCount;
        break;
      case "monthly":
        basePrice = rentalRates.monthly * rentalCount;
        break;
      default:
        basePrice = rentalRates.daily; // Fallback
    }

    const finalPrice = (basePrice * conversionRate).toFixed(2);

    return {
      symbol: currencySymbol,
      finalPrice,
      periodText: `${rentalCount} ${rentalPeriod === "daily" ? "day(s)" : rentalPeriod === "weekly" ? "week(s)" : "month(s)"}`,
    };
  };

  const getTotalPrice = () => {
    return cart.items
      .reduce((total, item) => {
        if (!item?.productId?.rentalRates) return total;
        const { finalPrice } = getRentalPriceDetails(item);
        return total + parseFloat(finalPrice) * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Header />
      <div
        className="container-fluid"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          // background: "linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)",
          background: "linear-gradient(135deg,rgb(4, 97, 146),rgb(101, 243, 160))",

        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4, md: 5 },
            mt: { xs: 8, sm: 12, md: 15 },
            bgcolor: "background.paper",
            width: "85%",
            display: "flex",
            flexDirection: "column",
            marginBottom: "30px",
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "primary.main",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Your Cart
          </Typography>
          {loading ? (
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              Loading cart...
            </Typography>
          ) : error ? (
            <Typography variant="body1" sx={{ mt: 2, color: "error.main" }}>
              {error}
            </Typography>
          ) : cart.items.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              Your cart is empty
            </Typography>
          ) : (
            <Box>
              <List>
                {cart.items.map(
                  (item) =>
                    item?.productId && (
                      <React.Fragment key={item.productId._id}>
                        <ListItem
                          sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={item.productId.name || "Product"}
                              src={`http://localhost:5000${item.productId.image}`}
                              variant="square"
                              sx={{
                                width: { xs: 80, sm: 100, md: 120 },
                                height: { xs: 100, sm: 140, md: 160 },
                                mb: { xs: 1, sm: 0 },
                                marginRight: "10px",
                                objectFit: "cover",
                                borderRadius: 1,
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.productId.name || "Unknown Product"}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Model: {item.productId.model}
                                </Typography>
                                <Typography
                                  component="div"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {getRentalPriceDetails(item).symbol}
                                  {getRentalPriceDetails(item).finalPrice} for {getRentalPriceDetails(item).periodText}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 1,
                                  }}
                                >
                                  <IconButton
                                    onClick={() => updateQuantity(item.productId._id, -1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Remove />
                                  </IconButton>
                                  <Typography sx={{ mx: 1 }}>
                                    {item.quantity || 1}
                                  </Typography>
                                  <IconButton
                                    onClick={() => updateQuantity(item.productId._id, 1)}
                                  >
                                    <Add />
                                  </IconButton>
                                </Box>
                              </>
                            }
                          />
                          <Button
                            startIcon={<DeleteOutline />}
                            onClick={() => removeFromCart(item.productId._id)}
                            color="error"
                          >
                            Remove
                          </Button>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    )
                )}
              </List>
              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Total: {cart.items.length > 0 ? getRentalPriceDetails(cart.items[0]).symbol : "₹"}{getTotalPrice()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={handleProceedToBuy}
                  size="large"
                  fullWidth
                  sx = {{
                    bgcolor : '#00cc99',
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
        <Dialog
          open={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <MultiStepCheckoutForm
            totalPrice={getTotalPrice()}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </Dialog>
      </div>
    </>
  );
}

export default CartPage;