import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Static exchange rate (INR to AED) - Replace with API call in production
const EXCHANGE_RATE_INR_TO_AED = 0.044;

const OrderHistory = ({ orders }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

  const getRentalStatusColor = (status) => {
    const statusColors = {
      "rental requested": 'warning',
      "rental approved": 'info',
      "rented out": 'primary',
      "returned": 'success',
      "rental cancelled": 'error',
    };
    return statusColors[status.toLowerCase()] || 'default';
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
    return items.map(item => `${item.rentalPeriod}(s)`).join(", "); //${item.rentalCount} 
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Rental History
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
              <TableCell>Rental Date</TableCell>
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
                        <Typography variant="body2">{order.userId?.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.userId?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>{duration}</TableCell>
                  <TableCell>
                    {symbol}{convertedAmount}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={getRentalStatusColor(order.orderStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default OrderHistory;