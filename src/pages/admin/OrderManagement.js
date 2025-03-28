import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Static exchange rate (INR to AED) - Replace with API call in production
const EXCHANGE_RATE_INR_TO_AED = 0.044;

const OrderManagement = ({ orders, setOrders }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState({});
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

  const rentalStatuses = [
    "Rental Requested",
    "Rental Approved",
    "Rented Out",
    "Returned",
    "Rental Cancelled",
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/orders/${orderId}`,
        { orderStatus: newStatus }
      );

      // Update orders in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      toast.success("Rental status updated successfully");
    } catch (error) {
      console.error("Error updating rental status:", error);
      toast.error("Failed to update rental status");
    } finally {
      setLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getRentalPriceDetails = (items) => {
    const isArabic = selectedLanguage === "ar";
    const currencySymbol = isArabic ? "د.إ" : "₹";
    const conversionRate = isArabic ? EXCHANGE_RATE_INR_TO_AED : 1;

    const totalINR = items.reduce((acc, item) => {
      const rentalRates = item.productId?.rentalRates || { daily: 0, weekly: 0, monthly: 0 };
      const rentalPeriod = item.rentalPeriod || "daily";
      const rentalCount = item.rentalCount || 1;
      const quantity = item.quantity || 1;

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
          basePrice = rentalRates.daily;
      }
      return acc + (basePrice * quantity);
    }, 0);

    const convertedAmount = (totalINR * conversionRate).toFixed(2);

    return {
      symbol: currencySymbol,
      convertedAmount,
    };
  };

  const getRentalDuration = (items) => {
    return items.map(item => `${item.rentalPeriod}(s)`).join(", ");   // ${item.rentalCount}
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Rental Management
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rental ID</TableCell>
              {!isMobile && <TableCell>Customer</TableCell>}
              <TableCell>Rental Duration</TableCell>
              <TableCell>Total Rental Cost</TableCell>
              <TableCell>Rental Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { symbol, convertedAmount } = getRentalPriceDetails(order.items);
              const duration = getRentalDuration(order.items);

              return (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.userId?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.userId?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>{duration}</TableCell>
                  <TableCell>{symbol}{convertedAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={loading[order._id]}
                      sx={{ minWidth: 120 }}
                    >
                      {rentalStatuses.map((status) => (
                        <MenuItem key={status} value={status.toLowerCase()}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderManagement;