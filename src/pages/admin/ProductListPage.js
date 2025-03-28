import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Edit, Delete, Image as ImageIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const EXCHANGE_RATE_INR_TO_AED = 0.044;

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

const ProductListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
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
  let selectedLanguage;
  try {
    selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  } catch (e) {
    console.warn("Storage access blocked, defaulting to English:", e);
    selectedLanguage = "en";
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data || []);
      toast.success("Products loaded successfully");
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    setEditProduct(product);
    setFormData(
      product
        ? {
            name: product.name,
            model: product.model,
            description: product.description,
            dailyRate: product.rentalRates.daily.toString(),
            weeklyRate: product.rentalRates.weekly.toString(),
            monthlyRate: product.rentalRates.monthly.toString(),
            category: product.category || "",
            inStock: product.inStock !== undefined ? product.inStock : true,
            rating: product.rating || 4.5,
            reviews: product.reviews || 0,
          }
        : {
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
          }
    );
    setImageFile(null);
    setImagePreview(product ? `${API_BASE_URL}${product.image}` : null);
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please upload a valid image (JPEG, PNG, JPG)",
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Image size must be less than 5MB",
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormErrors((prev) => ({ ...prev, image: "" }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      const error = validateField(name, value, formData, imageFile);
      setFormErrors((prev) => ({ ...prev, [name]: error }));

      if (
        error &&
        value &&
        name !== "dailyRate" &&
        name !== "weeklyRate" &&
        name !== "monthlyRate"
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: error,
          timer: 2000,
          showConfirmButton: false,
        });
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
    setFormErrors({});
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key], formData, imageFile);
    });
    newErrors.image = editProduct ? "" : validateField("image", "", formData, imageFile); // Allow no image on update
    setFormErrors(newErrors);
  
    const errorMessages = Object.values(newErrors).filter((error) => error);
    if (errorMessages.length > 0) {
      const firstErrorField = Object.keys(newErrors).find((key) => newErrors[key]);
      if (
        firstErrorField !== "dailyRate" &&
        firstErrorField !== "weeklyRate" &&
        firstErrorField !== "monthlyRate"
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: errorMessages[0],
          timer: 2000,
          showConfirmButton: false,
        });
      }
      return;
    }
  
    setFormLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dailyRate", formData.dailyRate);
      formDataToSend.append("weeklyRate", formData.weeklyRate);
      formDataToSend.append("monthlyRate", formData.monthlyRate);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("inStock", formData.inStock.toString()); // Ensure string
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("reviews", formData.reviews);
      if (imageFile) formDataToSend.append("image", imageFile);
  
      let response;
      if (editProduct) {
        response = await fetch(`${API_BASE_URL}/products/${editProduct._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/add-products`, {
          method: "POST",
          body: formDataToSend,
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editProduct ? "update" : "add"} product`);
      }
  
      const productData = await response.json();
      console.log("Response Data:", productData);
  
      setProducts((prev) => {
        const updatedProducts = editProduct
          ? prev.map((p) => (p._id === editProduct._id ? productData : p))
          : [...prev, productData];
        console.log("Updated Products:", updatedProducts);
        return updatedProducts;
      });
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Product ${editProduct ? "updated" : "added"} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const getRentalPriceDisplay = (rentalRates) => {
    const isArabic = selectedLanguage === "ar";
    const currencySymbol = isArabic ? "د.إ" : "₹";
    const conversionRate = isArabic ? EXCHANGE_RATE_INR_TO_AED : 1;

    return {
      daily: `${currencySymbol}${(rentalRates.daily * conversionRate).toFixed(2)}`,
      weekly: `${currencySymbol}${(rentalRates.weekly * conversionRate).toFixed(2)}`,
      monthly: `${currencySymbol}${(rentalRates.monthly * conversionRate).toFixed(2)}`,
    };
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6">Rental Product List</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: "primary.main" }}
          >
            Add Product
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Rental Rates (Daily/Weekly/Monthly)</TableCell>
                {!isMobile && <TableCell>Image</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 5} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const rates = getRentalPriceDisplay(product.rentalRates);
                  return (
                    <TableRow key={product._id} hover>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.model}</TableCell>
                      <TableCell>
                        {rates.daily} / {rates.weekly} / {rates.monthly}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{editProduct ? "Edit Rental Product" : "Add Rental Product"}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            <form onSubmit={handleSaveProduct}>
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
                    error={!!formErrors.name}
                    helperText={formErrors.name}
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
                    error={!!formErrors.model}
                    helperText={formErrors.model}
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
                    error={!!formErrors.dailyRate}
                    helperText={formErrors.dailyRate}
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
                    error={!!formErrors.weeklyRate}
                    helperText={formErrors.weekRate}
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
                    error={!!formErrors.monthlyRate}
                    helperText={formErrors.monthlyRate}
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
                    error={!!formErrors.category}
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
                    {formErrors.category && (
                      <Typography color="error" variant="caption">
                        {formErrors.category}
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
                      {formErrors.image || "Image is required"}
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
                    error={!!formErrors.description}
                    helperText={formErrors.description}
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
                      disabled={formLoading}
                      fullWidth={isMobile}
                      sx={{ minWidth: { sm: "120px" } }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={formLoading}
                      fullWidth={isMobile}
                      sx={{ minWidth: { sm: "120px" } }}
                      startIcon={
                        formLoading ? <CircularProgress size={20} /> : <AddIcon />
                      }
                    >
                      {formLoading ? (editProduct ? "Updating..." : "Adding...") : (editProduct ? "Update Product" : "Add Product")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductListPage;