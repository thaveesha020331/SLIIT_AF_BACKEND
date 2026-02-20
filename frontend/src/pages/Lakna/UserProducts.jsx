import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Tudakshana/authService';
import './UserProducts.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = API_URL.replace(/\/api\/?$/, '');

const UserProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Reusable', 'Organic', 'Handmade', 'Biodegradable', 'Sustainable', 'Ecofriendly'];
  const certifications = ['FSC', 'USDA Organic', 'Fair Trade', 'Carbon Neutral', 'B Corp', 'Cradle to Cradle', 'EU Ecolabel', 'Green Seal'];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, certificationFilter, priceRange, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/products?page=${page}&limit=12`;

      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (certificationFilter) url += `&ecocertification=${certificationFilter}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (priceRange.min > 0) url += `&minPrice=${priceRange.min}`;
      if (priceRange.max) url += `&maxPrice=${priceRange.max}`;

      const response = await api.get(url, { timeout: 5000 });
      if (response.data?.data && response.data?.pagination) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.pages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      setProducts([]);
      setTotalPages(1);
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
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

  const getProductImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('blob:') ||
      imagePath.startsWith('data:')
    ) {
      return imagePath;
    }

    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/${imagePath}`;
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
                <img src={getProductImageSrc(selectedProduct.image)} alt={selectedProduct.title} />
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

                  <button type="button" className="btn-add-review">
                    View Reviews
                  </button>

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
                  <img src={getProductImageSrc(product.image)} alt={product.title} />
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
