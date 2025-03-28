import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { motion } from "framer-motion";

const benefits = [
  "Flexible Rental Durations",
  "Hassle-Free Returns",
  "Affordable Pricing Plans",
  "Thoroughly Sanitized Items",
  "24/7 Customer Support",
];

function BenefitsSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "#1D2A3A" }}>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ 
          background: "linear-gradient(135deg, #0077b6, #2ecc71)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 6, }}
      >
        Why Choose Our Rental Service?
      </Typography>
      <List sx={{ maxWidth: 600, margin: "0 auto" }}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ListItem>
              <ListItemIcon>
                <Check sx={{ color: "secondary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary={benefit}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "text.primary",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );
}

export default BenefitsSection;
