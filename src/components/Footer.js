import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Box, Grid, Link, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#080b43',
        color: 'text.primary',
        py: 6,
        px: 4,
        mt: 4,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent='center' // Center the content
        alignItems='center'
        direction={{ xs: 'column', md: 'row' }} // Stack in column on mobile, row on tablet and desktop
      >
        {/* Brand Section */}
        <Grid item xs={12} md={4}>
          <motion.div
          // initial={{ opacity: 0, x: -50 }}
          // whileInView={{ opacity: 1, x: 0 }}
          // transition={{ duration: 0.8 }}
          // viewport={{ once: true }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                color: '#29c077',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Slash Enterprises
            </Typography>
            <Typography
              variant='body2'
              sx={{ lineHeight: 1.8, textAlign: 'center' }}
            >
              Elevating device protection since 2025.
            </Typography>
          </motion.div>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} md={4}>
          <motion.div
          // initial={{ opacity: 0, y: 50 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.8 }}
          // viewport={{ once: true }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                color: '#29c077',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant='body2'
              sx={{ lineHeight: 1.8, textAlign: 'center' }}
            >
              <br />
              Phone:{' '}
              <Link color='inherit'>
                +91 98765 78765
              </Link>
            </Typography>
          </motion.div>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} md={4}>
          <motion.div
          // initial={{ opacity: 0, x: 50 }}
          // whileInView={{ opacity: 1, x: 0 }}
          // transition={{ duration: 0.8 }}
          // viewport={{ once: true }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                color: '#29c077',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Follow Us
            </Typography>
            <Box
              sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}
            >
              <Link
                href='https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F'
                color='inherit'
                target='_blank'
                sx={{
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <Facebook fontSize='large' />
              </Link>
              <Link
                href='https://www.instagram.com/?hl=en'
                target='_blank'
                color='inherit'
                sx={{
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <Instagram fontSize='large' />
              </Link>
              <Link
                href='https://x.com/?lang=en&mx=2'
                target='_blank'
                color='inherit'
                sx={{
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <Twitter fontSize='large' />
              </Link>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Footer Links */}
      <Box mt={4} textAlign='center'>
        <motion.div
        // initial={{ opacity: 0, y: 30 }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.8 }}
        // viewport={{ once: true }}
        >
          <Typography variant='body2'>
            © {new Date().getFullYear()}{' '}
            <Typography
              component='span'
              sx={{ fontWeight: 'bold', color: '#03dac6' }}
            >
              Slash Enterprises
            </Typography>
            . All rights reserved.
          </Typography>
          {/* <Typography variant='body2' sx={{ mt: 1 }}>
            <Link href='#' color='inherit' underline='hover'>
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href='#' color='inherit' underline='hover'>
              Terms of Service
            </Link>
          </Typography> */}
        </motion.div>
      </Box>
    </Box>
  );
}

export default Footer;
