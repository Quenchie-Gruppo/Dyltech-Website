import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CardM from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import WhatsAppIcon from '@material-ui/icons/WhatsApp'; // Import WhatsApp icon

import { addItem, updateItem, removeItem } from './cartHelpers';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2), // Added margin for better spacing
  },
  cardContent: {
    flexGrow: 1,
  },
  productDescription: {
    height: '100px',
    overflow: 'hidden', // Hide overflow for better truncation
    textOverflow: 'ellipsis', // Add ellipsis for overflow text
    whiteSpace: 'nowrap', // Prevent wrapping
  },
  stockBadgeInStock: {
    backgroundColor: '#28a745', // Green for in-stock
    color: '#fff',
    padding: '5px',
    borderRadius: '5px',
  },
  stockBadgeOutOfStock: {
    backgroundColor: '#dc3545', // Red for out-of-stock
    color: '#fff',
    padding: '5px',
    borderRadius: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between', // Space buttons evenly
    marginTop: theme.spacing(1), // Reduced margin above buttons
  },
  inquiryButton: {
    marginLeft: theme.spacing(1), // Add spacing between buttons
  },
}));

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  
  const classes = useStyles();

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link href={`/product/${product._id}`} className='mr-2'>
          <Button variant='contained' color='primary'>
            View Product
          </Button>
        </Link>
      )
    );
  };

  const addToCart = () => {
    addItem(product, setRedirect(true));
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <Button onClick={addToCart} variant='outlined' color='secondary'>
          Add to cart
        </Button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className={classes.stockBadgeInStock}>In Stock</span>
    ) : (
      <span className={classes.stockBadgeOutOfStock}>Out of Stock</span>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div className='mt-2'>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>Adjust Quantity</span>
            </div>
            <input
              type='number'
              className='form-control'
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <Button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          variant='contained'
          color='secondary'
          startIcon={<DeleteIcon />}
        >
          Remove Product
        </Button>
      )
    );
  };

   const handleWhatsAppInquiry = () => {
     const message = `Hello! I am interested in the product ${product.name}. Can you provide more details?`;
     const phoneNumber = "+254759944689"; // WhatsApp number
     window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
   };

   return (
     <Container className={classes.cardGrid} maxWidth='md'>
       <CssBaseline />
       <Grid container spacing={2}>
         <Grid item xs={12} sm={12} md={12}>
           <CardM className={classes.card}>
             {shouldRedirect(redirect)}
             <ShowImage item={product} url='product' />
             <CardContent className={classes.cardContent}>
               <Typography gutterBottom variant='h5' component='h2'>
                 {product.name}
               </Typography>
               <Typography className={classes.productDescription}>
                 {product.description.substring(0,100)}...
               </Typography>
               <p className='black-10'>Price: Ksh {product.price}</p>
               <p className='black-9'>
                 Category: {product.category && product.category.name}{' '}
               </p>{' '}
               <p className='black-8'>
                 Added on {moment(product.createdAt).fromNow()}{' '}
               </p>
               {showStock(product.quantity)}
               <br></br>
               {/* Button Group with Reduced Spacing */}
               <div className={classes.buttonGroup}>
                 {showViewButton(showViewProductButton)}
                 {showAddToCartBtn(showAddToCartButton)}
                 {showRemoveButton(showRemoveProductButton)}
                 {/* WhatsApp Inquiry Button */}
                 <Button 
                   onClick={handleWhatsAppInquiry} 
                   variant="outlined" 
                   color="primary" 
                   startIcon={<WhatsAppIcon />}
                   className={classes.inquiryButton}
                 >
                   {/* Inquiry on WhatsApp */}
                 </Button>
               </div>
               {showCartUpdateOptions(cartUpdate)}
             </CardContent>
           </CardM>
         </Grid>
       </Grid>
     </Container>
   );
};

export default Card;