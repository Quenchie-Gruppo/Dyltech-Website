import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Button from '@material-ui/core/Button';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { makeStyles } from '@material-ui/core/styles';
import Search from './Search';
import { prices } from './fixedPrices';
import Copyright from './Copyright';
import Carousel from 'react-bootstrap/Carousel'; // Added carousel for slideshow

const useStyles = makeStyles((theme) => ({
  btn: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 20px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    transition: '0.3s ease',
    '&:hover': {
      background: '#FF8E53',
      transform: 'scale(1.05)',
    },
  },
  filterContainer: {
    marginBottom: '20px',
  },
  filterTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  productCard: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  loadMoreBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    width: '100%',
  },
}));

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const classes = useStyles();

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Button onClick={loadMore} variant='contained' className={classes.loadMoreBtn}>
          Load More Products
        </Button>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }

    loadFilteredResults(newFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <Layout
      title='Shop Page'
      description='Browse our collection of amazing products'
      className='container-fluid'
    >
      {/* Slideshow Section */}
      <Carousel>
        <Carousel.Item>
          <img
            className='d-block w-100'
            src='https://via.placeholder.com/1500x500?text=Shop+Our+New+Collection'
            alt='First slide'
          />

          {/* <img
            className='d-block w-100'
            src='https://images.pexels.com/photos/5625010/pexels-photo-5625010.jpeg?auto=compress&cs=tinysrgb&w=600'
            alt='First slide'
          /> */}
          <Carousel.Caption>
            <h3>New Arrivals</h3>
            <p>Explore the latest products in our collection.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100'
            src='https://via.placeholder.com/1500x500?text=Special+Discounts'
            alt='Second slide'
          />
          <Carousel.Caption>
            <h3>Special Discounts</h3>
            <p>Get exclusive discounts on selected items.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Search Section */}
      <Search />

      <div className='row'>
        {/* Filters Section */}
        <div className='col-md-3 filterContainer'>
          <h4 className={classes.filterTitle}>Filter by Categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, 'category')}
            />
          </ul>

          <h4 className={classes.filterTitle}>Filter by Price Range</h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, 'price')}
            />
          </div>
        </div>

        {/* Product Display Section */}
        <div className='col-md-9'>
          <h2 className='mb-2'>Products</h2>
          <div className='row'>
            {filteredResults.map((product, i) => (
              <div key={i} className='col-xl-4 col-lg-6 col-md-12 col-sm-12'>
                <Card product={product} className={classes.productCard} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
      <Copyright />
    </Layout>
  );
};

export default Shop;
