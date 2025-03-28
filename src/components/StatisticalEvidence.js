import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import { motion } from "framer-motion";

const stats = [
  { value: "98%", label: "Customer Satisfaction" },
  { value: "10K+", label: "Successful Rentals" },
  { value: "24/7", label: "Support Availability" },
];

function StatisticalEvidence() {
  return (
    <Box sx={{ py: 8, bgcolor: "#003366" }}>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ background: "linear-gradient(135deg, #0077b6, #2ecc71)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", mb: 6 }}
      >
        Why Rent With Us?
      </Typography>
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  component="div"
                  gutterBottom
                  sx={{ color: "secondary.main", fontWeight: "bold" }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ color: "text.primary" }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StatisticalEvidence;
