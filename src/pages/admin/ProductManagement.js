import { Add as AddIcon, Image as ImageIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Select,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const validateField = (name, value, formData, imageFile) => {
  switch (name) {
    case "name":
      return !value.trim() ? "Product name is required" : "";
    case "model":
      return !value.trim() ? "Model is required" : "";
    case "description":
      return !value.trim() ? "Description is required" : "";
    case "category":
      return !value ? "Category is required" : "";
    case "dailyRate":
      if (!value) return "Daily rate is required";
      const dailyNum = Number(value);
      if (isNaN(dailyNum)) return "Daily rate must be a valid number";
      if (dailyNum < 1) return "Daily rate must be at least ₹1";
      if (dailyNum > 5000) return "Daily rate cannot exceed ₹5000";
      return "";
    case "weeklyRate":
      if (!value) return "Weekly rate is required";
      const weeklyNum = Number(value);
      if (isNaN(weeklyNum)) return "Weekly rate must be a valid number";
      if (weeklyNum < 5) return "Weekly rate must be at least ₹5";
      if (weeklyNum > 20000) return "Weekly rate cannot exceed ₹20,000";
      return "";
    case "monthlyRate":
      if (!value) return "Monthly rate is required";
      const monthlyNum = Number(value);
      if (isNaN(monthlyNum)) return "Monthly rate must be a valid number";
      if (monthlyNum < 10) return "Monthly rate must be at least ₹10";
      if (monthlyNum > 50000) return "Monthly rate cannot exceed ₹50,000";
      return "";
    case "image":
      return !imageFile ? "Product image is required" : "";
    default:
      return "";
  }
};

const ProductManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    description: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    category: "",
    inStock: true,
    rating: 4.5,
    reviews: 0,
  });

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          showErrorAlert("Please upload a valid image (JPEG, PNG, JPG)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showErrorAlert("Image size must be less than 5MB");
          return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      const error = validateField(name, value, formData, imageFile);
      setErrors((prev) => ({ ...prev, [name]: error }));

      // Only show SweetAlert for non-pricing fields
      if (
        error &&
        value &&
        name !== "dailyRate" &&
        name !== "weeklyRate" &&
        name !== "monthlyRate"
      ) {
        showErrorAlert(error);
      }
    }
  };

  const handleStockToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      inStock: e.target.checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      description: "",
      dailyRate: "",
      weeklyRate: "",
      monthlyRate: "",
      category: "",
      inStock: true,
      rating: 4.5,
      reviews: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key], formData, imageFile);
    });
    newErrors.image = validateField("image", "", formData, imageFile);
    setErrors(newErrors);

    const errorMessages = Object.values(newErrors).filter((error) => error);
    if (errorMessages.length > 0) {
      // Show alert only for the first error, but skip pricing fields
      const firstErrorField = Object.keys(newErrors).find(
        (key) => newErrors[key]
      );
      if (
        firstErrorField !== "dailyRate" &&
        firstErrorField !== "weeklyRate" &&
        firstErrorField !== "monthlyRate"
      ) {
        showErrorAlert(errorMessages[0]);
      }
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dailyRate", formData.dailyRate);
      formDataToSend.append("weeklyRate", formData.weeklyRate);
      formDataToSend.append("monthlyRate", formData.monthlyRate);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("inStock", formData.inStock);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("reviews", formData.reviews);
      formDataToSend.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/add-products`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add product");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            Add Rental Product
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.model}
                helperText={errors.model}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Daily Rate"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleInputChange}
                required
                error={!!errors.dailyRate}
                helperText={errors.dailyRate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
                inputProps={{ min: 1, max: 5000, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Weekly Rate"
                name="weeklyRate"
                type="number"
                value={formData.weeklyRate}
                onChange={handleInputChange}
                required
                error={!!errors.weeklyRate}
                helperText={errors.weeklyRate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
                inputProps={{ min: 5, max: 20000, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Monthly Rate"
                name="monthlyRate"
                type="number"
                value={formData.monthlyRate}
                onChange={handleInputChange}
                required
                error={!!errors.monthlyRate}
                helperText={errors.monthlyRate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
                inputProps={{ min: 10, max: 50000, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.category}
              >
                <InputLabel
                  sx={{
                    color: "#000",
                    backgroundColor: formData.category ? "#fff" : "transparent",
                    padding: "0 4px",
                    "&.Mui-focused": {
                      color: "#6C63FF",
                      backgroundColor: "#fff",
                    },
                  }}
                >
                  Category
                </InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #ccc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #999",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #6C63FF",
                    },
                    backgroundColor: "#fff",
                  }}
                >
                  <MenuItem value="Electronics">🔌 Electronics</MenuItem>
                  <MenuItem value="Tools">🛠️ Tools</MenuItem>
                  <MenuItem value="Furniture">🪑 Furniture</MenuItem>
                  <MenuItem value="Vehicles">🚗 Vehicles</MenuItem>
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<ImageIcon />}
                sx={{ height: isMobile ? "40px" : "56px" }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleInputChange}
                  name="image"
                />
              </Button>
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    mt: 2,
                    maxWidth: "100%",
                    maxHeight: "150px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.image || "Image is required"}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
                size={isMobile ? "small" : "medium"}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inStock}
                    onChange={handleStockToggle}
                    color="primary"
                  />
                }
                label="In Stock"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: "120px" } }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: "120px" } }}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <AddIcon />
                  }
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductManagement;