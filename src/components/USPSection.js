import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import {
  Favorite,
  LocalShipping,
  Brush,
  SupportAgent,
  EventAvailable,
  VerifiedUser,
  MonetizationOn
} from "@mui/icons-material";
import { motion } from "framer-motion";

const uspItems = [
  {
    icon: <EventAvailable sx={{ fontSize: 48, color: "#2ECC71" }} />,
    title: "Flexible Rental Plans",
    description: "Choose from daily, weekly, or monthly rentals.",
  },
  {
    icon: <VerifiedUser sx={{ fontSize: 48, color: "#2ECC71" }} />,
    title: "Secure & Verified",
    description: "All rentals are verified for quality and reliability.",
  },
  {
    icon: <MonetizationOn sx={{ fontSize: 48, color: "#2ECC71" }} />,
    title: "Affordable Pricing",
    description: "Best rates with no hidden charges.",
  },
  // {
  //   icon: <SupportAgent sx={{ fontSize: 48, color: "#2ECC71" }} />,
  //   title: "24/7 Customer Support",
  //   description: "Get assistance anytime, anywhere.",
  // },
];



function USPSection() {
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "#003366",
      }}
    >
      <Grid container spacing={4}>
        {uspItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {item.icon}
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ mt: 2, color: "#00A9E0" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default USPSection;
