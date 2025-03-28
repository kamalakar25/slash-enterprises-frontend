import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import USPSection from "./components/USPSection";
import ProductShowcase from "./components/ProductShowcase";
import CustomerReviews from "./components/CustomerReviews";
import LeadCaptureForm from "./components/LeadCaptureForm";
import BenefitsSection from "./components/BenefitsSection";
import StatisticalEvidence from "./components/StatisticalEvidence";
import Footer from "./components/Footer";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC6",
    },
    background: {
      default: "#003366",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E1E1E1",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function MobileCoverLandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container-fluid p-0">
        <Header />
        <HeroSection />
        <USPSection />
        <ProductShowcase />
        <CustomerReviews />
        {/* <LeadCaptureForm /> */}
        <BenefitsSection />
        <StatisticalEvidence />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default MobileCoverLandingPage;
