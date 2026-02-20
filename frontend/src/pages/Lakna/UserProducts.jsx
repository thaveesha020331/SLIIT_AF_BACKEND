import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/Tudakshana/authService';
import './UserProducts.css';

const UserProducts = () => {
  const navigate = useNavigate();
  // Dummy products data
  const dummyProducts = [
    {
      _id: '1',
      title: 'Eco-Friendly Bamboo Water Bottle',
      description: 'Sustainable bamboo water bottle made from 100% natural materials. Perfect for daily hydration with zero plastic waste. The bottle is lightweight, durable, and keeps drinks at the right temperature.',
      price: 29.99,
      stock: 45,
      category: 'Reusable',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de099?w=400&h=400&fit=crop',
      ecocertification: 'Carbon Neutral',
      ecoImpactScore: {
        carbonFootprint: 0.25,
        sustainabilityRating: 88,
        waterUsage: 50,
        recyclabilityScore: 95,
      },
      manufacturerInfo: { name: 'EcoBottle Co.', location: 'Costa Rica' },
      reviews: [
        { rating: 5, comment: 'Great quality and eco-friendly!' },
        { rating: 4, comment: 'Perfect for outdoor activities' },
      ],
    },
    {
      _id: '2',
      title: 'Organic Cotton T-Shirt',
      description: 'Soft and comfortable organic cotton t-shirt. Made without synthetic pesticides or chemicals. Perfect for everyday wear. Available in multiple colors and sizes.',
      price: 34.99,
      stock: 120,
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      ecocertification: 'USDA Organic',
      ecoImpactScore: {
        carbonFootprint: 0.45,
        sustainabilityRating: 82,
        waterUsage: 200,
        recyclabilityScore: 85,
      },
      manufacturerInfo: { name: 'Organic Wear Ltd.', location: 'India' },
      reviews: [
        { rating: 5, comment: 'Very comfortable and ethical' },
      ],
    },
    {
      _id: '3',
      title: 'Handmade Natural Soap Bar',
      description: 'Cold-pressed natural soap made with organic oils and essential oils. Gentle on skin and environmentally friendly. No synthetic chemicals or artificial fragrances.',
      price: 12.99,
      stock: 200,
      category: 'Handmade',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7214e?w=400&h=400&fit=crop',
      ecocertification: 'Fair Trade',
      ecoImpactScore: {
        carbonFootprint: 0.15,
        sustainabilityRating: 78,
        waterUsage: 30,
        recyclabilityScore: 100,
      },
      manufacturerInfo: { name: 'Nature\'s Care', location: 'Nepal' },
      reviews: [
        { rating: 5, comment: 'Amazing for sensitive skin' },
        { rating: 5, comment: 'Great lather and natural scent' },
      ],
    },
    {
      _id: '4',
      title: 'Biodegradable Phone Case',
      description: 'Fully biodegradable phone case made from plant-based materials. Protective yet eco-conscious. Decomposes naturally within 2 years without harming the environment.',
      price: 19.99,
      stock: 75,
      category: 'Biodegradable',
      image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
      ecocertification: 'Cradle to Cradle',
      ecoImpactScore: {
        carbonFootprint: 0.35,
        sustainabilityRating: 90,
        waterUsage: 60,
        recyclabilityScore: 98,
      },
      manufacturerInfo: { name: 'GreenCase Tech', location: 'Germany' },
      reviews: [
        { rating: 4, comment: 'Good protection and eco-friendly' },
      ],
    },
    {
      _id: '5',
      title: 'Sustainable Bamboo Cutting Board',
      description: 'Beautiful and durable bamboo cutting board. Naturally antimicrobial and sustainable. Perfect for food preparation. No harmful chemicals or treatments.',
      price: 24.99,
      stock: 55,
      category: 'Sustainable',
      image: 'https://images.unsplash.com/photo-1594947226116-6695a104fbf5?w=400&h=400&fit=crop',
      ecocertification: 'FSC',
      ecoImpactScore: {
        carbonFootprint: 0.30,
        sustainabilityRating: 85,
        waterUsage: 40,
        recyclabilityScore: 92,
      },
      manufacturerInfo: { name: 'Bamboo Kitchen', location: 'Vietnam' },
      reviews: [
        { rating: 5, comment: 'High quality and sustainable' },
      ],
    },
    {
      _id: '6',
      title: 'Eco-Friendly Reusable Shopping Bag',
      description: 'Durable canvas shopping bag made from organic cotton. Replaces hundreds of plastic bags. Strong handles and spacious design perfect for groceries and daily shopping.',
      price: 16.99,
      stock: 150,
      category: 'Reusable',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
      ecocertification: 'Carbon Neutral',
      ecoImpactScore: {
        carbonFootprint: 0.20,
        sustainabilityRating: 92,
        waterUsage: 55,
        recyclabilityScore: 96,
      },
      manufacturerInfo: { name: 'EcoCarry', location: 'Bangladesh' },
      reviews: [
        { rating: 5, comment: 'Perfect for eliminating plastic bags' },
        { rating: 5, comment: 'Very sturdy and stylish' },
      ],
    },
    {
      _id: '7',
      title: 'Organic Green Tea Blend',
      description: 'Premium organic green tea blend with natural herbs. No pesticides or artificial additives. Freshly sourced from sustainable farms. Perfect for daily wellness.',
      price: 18.99,
      stock: 80,
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1597318150589-4e7e8ca7a0ea?w=400&h=400&fit=crop',
      ecocertification: 'USDA Organic',
      ecoImpactScore: {
        carbonFootprint: 0.40,
        sustainabilityRating: 84,
        waterUsage: 150,
        recyclabilityScore: 88,
      },
      manufacturerInfo: { name: 'Pure Leaf Tea', location: 'Sri Lanka' },
      reviews: [
        { rating: 5, comment: 'Great taste and organic' },
      ],
    },
    {
      _id: '8',
      title: 'Handcrafted Wooden Utensil Set',
      description: 'Beautifully handcrafted wooden utensils made by local artisans. Perfect alternative to plastic utensils. Includes fork, spoon, and knife in a portable pouch.',
      price: 21.99,
      stock: 60,
      category: 'Handmade',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
      ecocertification: 'Fair Trade',
      ecoImpactScore: {
        carbonFootprint: 0.25,
        sustainabilityRating: 80,
        waterUsage: 35,
        recyclabilityScore: 90,
      },
      manufacturerInfo: { name: 'Artisan Crafts', location: 'Thailand' },
      reviews: [
        { rating: 5, comment: 'Beautiful and eco-conscious' },
      ],
    },
  ];

  const [products, setProducts] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Reusable', 'Organic', 'Handmade', 'Biodegradable', 'Sustainable', 'Ecofriendly'];
  const certifications = ['FSC', 'USDA Organic', 'Fair Trade', 'Carbon Neutral', 'B Corp', 'Cradle to Cradle', 'EU Ecolabel', 'Green Seal'];

  // Initialize with dummy data
  useEffect(() => {
    setTotalPages(1);
  }, []);

  // Fetch products with fallback to dummy data
  useEffect(() => {
    filterAndDisplayProducts();
  }, [page, categoryFilter, certificationFilter, priceRange, searchQuery]);

  const filterAndDisplayProducts = () => {
    setLoading(true);
    setError(null);

    try {
      // Filter dummy products based on current filters
      let filtered = [...dummyProducts];

      if (categoryFilter) {
        filtered = filtered.filter((p) => p.category === categoryFilter);
      }

      if (certificationFilter) {
        filtered = filtered.filter((p) => p.ecocertification === certificationFilter);
      }

      if (priceRange.max) {
        filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      // Apply pagination
      const limit = 12;
      const totalPages = Math.ceil(filtered.length / limit);
      const start = (page - 1) * limit;
      const paginatedProducts = filtered.slice(start, start + limit);

      setProducts(paginatedProducts);
      setTotalPages(totalPages);

      // Also try to fetch from API if available
      tryFetchFromAPI();
    } catch (err) {
      setError('Error filtering products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tryFetchFromAPI = async () => {
    try {
      let url = `/products?page=${page}&limit=12`;

      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (certificationFilter) url += `&ecocertification=${certificationFilter}`;
      if (searchQuery) url += `&search=${searchQuery}`;

      const response = await api.get(url, { timeout: 5000 });
      if (response.data?.data && response.data?.pagination) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.pages || 1);
      }
    } catch (err) {
      // Silently fail - use dummy data as fallback
      console.log('API not available, using dummy data');
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      navigate('/cart');
    } catch (err) {
      if (err.response?.status === 401) return; // auth interceptor handles redirect
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!reviewData.rating) {
      setError('Please select a rating');
      return;
    }

    try {
      await axios.post(`/api/products/${selectedProduct._id}/reviews`, reviewData);
      alert('Review added successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      // Refresh product details
      const response = await axios.get(`/api/products/${selectedProduct._id}`);
      setSelectedProduct(response.data.data);
    } catch (err) {
      setError('Failed to add review');
      console.error(err);
    }
  };

  const getEcoRatingColor = (rating) => {
    if (rating >= 80) return '#10b981'; // Green
    if (rating >= 60) return '#f59e0b'; // Yellow
    if (rating >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getEcoRatingLabel = (rating) => {
    if (rating >= 80) return 'Excellent';
    if (rating >= 60) return 'Good';
    if (rating >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="user-products-container">
      {/* Header */}
      <div className="products-header">
        <h1>Eco-Friendly Products</h1>
        <p>Discover sustainable and environmentally conscious products</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>

            <div className="product-detail-grid">
              {/* Image */}
              <div className="product-detail-image">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>

              {/* Details */}
              <div className="product-detail-info">
                <h2>{selectedProduct.title}</h2>

                <div className="product-meta">
                  <span className="badge badge-category">{selectedProduct.category}</span>
                  <span className="badge badge-cert">{selectedProduct.ecocertification}</span>
                </div>

                <p className="product-description">{selectedProduct.description}</p>

                {/* Pricing and Stock */}
                <div className="product-pricing">
                  <div className="price">${selectedProduct.price.toFixed(2)}</div>
                  <div className={`stock ${selectedProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                  </div>
                </div>

                {/* Eco-Impact Score */}
                <div className="eco-impact-section">
                  <h3>Eco-Impact Score</h3>
                  <div className="eco-metrics">
                    <div className="eco-metric">
                      <div className="metric-circle" style={{ borderColor: getEcoRatingColor(selectedProduct.ecoImpactScore?.sustainabilityRating || 0) }}>
                        <div className="metric-value">{selectedProduct.ecoImpactScore?.sustainabilityRating || 0}%</div>
                      </div>
                      <div className="metric-label">Sustainability</div>
                      <div className="metric-subtext">{getEcoRatingLabel(selectedProduct.ecoImpactScore?.sustainabilityRating || 0)}</div>
                    </div>

                    <div className="eco-metric">
                      <div className="metric-value">{selectedProduct.ecoImpactScore?.carbonFootprint || 0}</div>
                      <div className="metric-label">Carbon Footprint</div>
                      <div className="metric-subtext">kg CO2e</div>
                    </div>

                    <div className="eco-metric">
                      <div className="metric-value">{selectedProduct.ecoImpactScore?.waterUsage || 0}</div>
                      <div className="metric-label">Water Usage</div>
                      <div className="metric-subtext">liters</div>
                    </div>

                    <div className="eco-metric">
                      <div className="metric-circle" style={{ borderColor: getEcoRatingColor(selectedProduct.ecoImpactScore?.recyclabilityScore || 0) }}>
                        <div className="metric-value">{selectedProduct.ecoImpactScore?.recyclabilityScore || 0}%</div>
                      </div>
                      <div className="metric-label">Recyclability</div>
                    </div>
                  </div>
                </div>

                {/* Add to cart in modal */}
                <div style={{ marginBottom: 20 }}>
                  <button
                    className="btn-view-details"
                    style={{ padding: '12px 24px' }}
                    onClick={() => handleAddToCart(selectedProduct._id)}
                  >
                    Add to cart
                  </button>
                </div>

                {/* Manufacturer Info */}
                {selectedProduct.manufacturerInfo && (
                  <div className="manufacturer-info">
                    <h3>Manufacturer</h3>
                    {selectedProduct.manufacturerInfo.name && <p><strong>Name:</strong> {selectedProduct.manufacturerInfo.name}</p>}
                    {selectedProduct.manufacturerInfo.location && <p><strong>Location:</strong> {selectedProduct.manufacturerInfo.location}</p>}
                  </div>
                )}

                {/* Reviews */}
                <div className="reviews-section">
                  <h3>Customer Reviews ({selectedProduct.reviews?.length || 0})</h3>

                  {!showReviewForm ? (
                    <button className="btn-add-review" onClick={() => setShowReviewForm(true)}>
                      Add a Review
                    </button>
                  ) : (
                    <form onSubmit={handleAddReview} className="review-form">
                      <div className="form-group">
                        <label>Rating *</label>
                        <select
                          value={reviewData.rating}
                          onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                          required
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Comment</label>
                        <textarea
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          placeholder="Share your thoughts..."
                          rows="3"
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Submit Review</button>
                        <button type="button" className="btn-secondary" onClick={() => setShowReviewForm(false)}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="reviews-list">
                    {selectedProduct.reviews && selectedProduct.reviews.map((review, idx) => (
                      <div key={idx} className="review-item">
                        <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select value={categoryFilter} onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Certification</label>
            <select value={certificationFilter} onChange={(e) => {
              setCertificationFilter(e.target.value);
              setPage(1);
            }}>
              <option value="">All Certifications</option>
              {certifications.map((cert) => (
                <option key={cert} value={cert}>
                  {cert}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({ ...priceRange, max: parseInt(e.target.value) });
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  <div className="product-badges">
                    <span className="badge badge-category">{product.category}</span>
                    <span className="badge badge-cert">{product.ecocertification}</span>
                  </div>
                </div>

                <div className="product-card-content">
                  <h3>{product.title}</h3>

                  <div className="eco-score-small">
                    <div className="sustainability-score">
                      <div className="score-circle" style={{ borderColor: getEcoRatingColor(product.ecoImpactScore?.sustainabilityRating || 0) }}>
                        {product.ecoImpactScore?.sustainabilityRating || 0}%
                      </div>
                      <span>Eco Rating</span>
                    </div>
                  </div>

                  <div className="product-footer">
                    <div className="price">${product.price.toFixed(2)}</div>
                    <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      className="btn-view-details"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-view-details"
                      style={{ background: '#65a30d', color: 'white' }}
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-pagination"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span className="page-info">Page {page} of {totalPages}</span>

              <button
                className="btn-pagination"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProducts;
