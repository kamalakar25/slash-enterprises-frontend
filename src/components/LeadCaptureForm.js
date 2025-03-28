


import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Create custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    background: {
      default: "#1a1a1a",
      paper: "#2a2a2a",
    },
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1440,
      xxl: 2560,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          padding: "0.875rem 1.5rem",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.2s ease",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        },
      },
    },
  },
});

  

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formHeight, setFormHeight] = useState("auto");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    phone: /^[6-9]\d{9}$/,
  };

    const titleStyles = {
      fontSize: {
        xs: "1.5rem",
        sm: "1.75rem",
        md: "2rem",
        lg: "2.25rem",
        xl: "2.5rem",
        xxl: "3rem",
      },
      fontWeight: 700,
      textAlign: "center",
      marginBottom: {
        xs: "1.5rem",
        sm: "2rem",
        md: "2.5rem",
      },
      background: "linear-gradient(45deg,rgb(174, 70, 184),rgb(165, 23, 165))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }

  // Error messages
  const errorMessages = {
    name: {
      required: "Name is required",
      pattern: "Name should only contain letters and spaces (2-50 characters)",
    },
    phone: {
      required: "Phone number is required",
      pattern:
        "Phone number must start with 6, 7, 8, or 9 and be 10 digits long",
    },
  };

  const validateField = (name, value) => {
    if (!value) return errorMessages[name].required;
    if (patterns[name] && !patterns[name].test(value)) {
      return errorMessages[name].pattern;
    }
    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, phone: true });

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitted(true);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: "Something went wrong. Please try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const containerStyles = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    padding: "2rem",
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth={false} disableGutters sx={containerStyles}>
        <Paper
          elevation={8}
          sx={{ padding: "2rem", maxWidth: "480px", width: "100%" }}
        >
          <Typography variant="h1" sx={titleStyles}>
            Get 15% Off Your First Order
          </Typography>
          <AnimatePresence>
            {submitted ? (
              <Alert severity="success">Thank you for signing up!</Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap="1.5rem">
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    fullWidth
                  />
                  {errors.submit && (
                    <Alert severity="error">{errors.submit}</Alert>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Claim Your 15% Off"
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </AnimatePresence>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default LeadCaptureForm;
