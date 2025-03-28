import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MobileCoverLandingPage from "./MobileCoverLandingPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import CategoryPage from "./components/CategoryPage";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          {/* Moved ForgotPassword back to public routes for consistency */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected User Routes */}
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <MobileCoverLandingPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <AuthenticatedRoute>
                <ProductDetail />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <AuthenticatedRoute>
                <CartPage />
              </AuthenticatedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                {/* Stable wrapper to prevent unnecessary unmounting */}
                <div>
                  <Routes>
                    <Route path="/" element={<AdminPanel />}>
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                    </Route>
                  </Routes>
                </div>
              </AdminRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;