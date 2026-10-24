import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/appData';
import { FiSearch, FiSliders, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import './Menu.css';

export default function Menu() {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filteredProducts = useMemo(() => {
    return state.products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBestseller = onlyBestsellers ? product.bestseller : true;

        return matchesCategory && matchesSearch && matchesBestseller;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          const priceA = a.discount ? a.price - (a.price * a.discount) / 100 : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount) / 100 : b.price;
          return priceA - priceB;
        }
        if (sortBy === 'price-high') {
          const priceA = a.discount ? a.price - (a.price * a.discount) / 100 : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount) / 100 : b.price;
          return priceB - priceA;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [state.products, selectedCategory, searchQuery, sortBy, onlyBestsellers]);

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="modern-menu-page">
      {/* HEADER BANNER */}
      <div className="menu-hero-header">
        <div className="container">
          <span className="section-subtitle">Artisanal Catalog</span>
          <h1 className="section-title">Our Menu</h1>
          <p className="section-desc">Freshly made. Always delicious.</p>
        </div>
      </div>

      <div className="container menu-content-wrap">
        {/* CONTROLS BAR: SEARCH, SORT, FILTER */}
        <div className="menu-controls-bar glass-card">
          <div className="menu-search-input-box">
            <FiSearch className="search-ico" />
            <input
              type="text"
              placeholder="Search chai, cold coffee, burger, sandwich, fries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
              id="menu-search-input"
            />
          </div>

          <div className="menu-controls-right">
            <label className="bestseller-checkbox-label">
              <input
                type="checkbox"
                checked={onlyBestsellers}
                onChange={(e) => setOnlyBestsellers(e.target.checked)}
              />
              <span>★ Bestsellers</span>
            </label>

            <div className="sort-dropdown-wrap">
              <FiSliders className="sort-ico" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
                id="menu-sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS PILL RAIL */}
        <div className="menu-category-scroll-rail">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`cat-rail-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span className="cat-pill-icon">{cat.icon}</span>
              <span className="cat-pill-name">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid-modern menu-catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="menu-empty-results glass-card">
            <div className="empty-ico">🔍</div>
            <h3>No delicacies found</h3>
            <p>Try searching with another keyword or explore other categories.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyBestsellers(false);
              }}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* FLOATING CART BAR */}
      {cartItemCount > 0 && (
        <div className="floating-cart-bar">
          <div className="container floating-cart-container glass-card">
            <div className="floating-cart-info">
              <span className="cart-chip">
                <FiShoppingCart /> {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="cart-total-text">
                Subtotal: <strong>₹{state.cartTotal}</strong>
              </span>
            </div>
            <Link to="/cart" className="btn btn-primary btn-sm floating-checkout-btn">
              <span>View Cart & Checkout</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
