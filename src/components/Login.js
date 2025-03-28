// src/components/Login.js
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address, Ex:example@example.com")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { login } = useAuth(); //resetInactivityTimeout
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setGlobalError] = useState("");

  // If user is already logged in, redirect to home

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setGlobalError("");

      const user = await login(data.email, data.password);

      // Reset inactivity timeout after successful login
      // resetInactivityTimeout();

      // Check user role and navigate accordingly
      if (user.role === "admin") {
        // navigate("/admin");
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setGlobalError(err.message || "Login failed. Please try again.");

      // Set field-specific errors if they exist
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: err.response.data.errors[key],
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <AuthLayout>

      <motion.div initial="hidden" animate="visible" variants={formAnimation}>
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          align="center"
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            mt: 1,
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              height: 56,
              borderRadius: 2,
              fontSize: "1rem",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Link
              href="/forgot-password"
              variant="body2"
              sx={{ mb: isMobile ? 1 : 0 }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot password?
            </Link>
            <Link
              href="/signup"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </motion.div>
   
    </AuthLayout>
  );
};

export default Login;
