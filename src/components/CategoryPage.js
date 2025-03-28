// CategoryPage.js
import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductShowcase from './ProductShowcase';
import Header from './Header';

function CategoryPage() {
  const { categoryName } = useParams();

  // Map URL-friendly category names back to original names
  const categoryMapping = {
    'new-arrivals': 'New Arrivals',
    'best-sellers': 'Best Sellers',
    collections: 'Collections',
    customized: 'Customized',
    iphone: 'iPhone',
    samsung: 'Samsung',
  };

  // Get the original category name or use the URL-friendly name if no mapping exists
  const category =
    categoryMapping[categoryName] ||
    categoryName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <>
    <Header />
    <Box sx={{ minHeight: '100vh', pt: 10 }}>
      <ProductShowcase category={category} />
    </Box>
    </>
    
  );
}

export default CategoryPage;
