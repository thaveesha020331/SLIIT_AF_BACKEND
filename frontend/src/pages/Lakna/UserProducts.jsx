import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import api from '../../services/Tudakshana/authService';
import { cartAPI } from '../../services/Thaveesha';
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

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('az');

  const categories = ['Reusable', 'Organic', 'Handmade', 'Biodegradable', 'Sustainable', 'Ecofriendly'];
  const certifications = ['FSC', 'USDA Organic', 'Fair Trade', 'Carbon Neutral', 'B Corp', 'Cradle to Cradle', 'EU Ecolabel', 'Green Seal'];

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/products?page=${page}&limit=12`;
      if (searchQuery) url += `&search=${searchQuery}`;

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
      await cartAPI.addToCart(productId, quantity);
      navigate('/cart');
    } catch (err) {
      if (err.response?.status === 401) return;
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getEcoRatingColor = (rating) => {
    if (rating >= 80) return '#10b981';
    if (rating >= 60) return '#f59e0b';
    if (rating >= 40) return '#f97316';
    return '#ef4444';
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

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => (
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    ));
  };

  const handleCertificationToggle = (certification) => {
    setSelectedCertifications((prev) => (
      prev.includes(certification)
        ? prev.filter((item) => item !== certification)
        : [...prev, certification]
    ));
  };

  const displayedProducts = useMemo(() => {
    const categoryFiltered = products.filter((product) => {
      if (!selectedCategories.length) return true;
      return selectedCategories.includes(product.category);
    });

    const certificationFiltered = categoryFiltered.filter((product) => {
      if (!selectedCertifications.length) return true;
      return selectedCertifications.includes(product.ecocertification);
    });

    return [...certificationFiltered].sort((first, second) => {
      if (sortBy === 'za') {
        return String(second.title || '').localeCompare(String(first.title || ''));
      }
      if (sortBy === 'price-low') {
        return Number(first.price || 0) - Number(second.price || 0);
      }
      if (sortBy === 'price-high') {
        return Number(second.price || 0) - Number(first.price || 0);
      }
      return String(first.title || '').localeCompare(String(second.title || ''));
    });
  }, [products, selectedCategories, selectedCertifications, sortBy]);

  return (
    <section className="mt-0 px-4 md:px-8 pt-2 pb-12">
      <div className="user-products-container">
        <div className="products-header">
          <h1>Eco-Friendly Products</h1>
          <p>Discover sustainable and environmentally conscious products</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>

              <div className="product-detail-grid">
                <div className="product-detail-image">
                  <img src={getProductImageSrc(selectedProduct.image)} alt={selectedProduct.title} />
                </div>

                <div className="product-detail-info">
                  <h2>{selectedProduct.title}</h2>

                  <div className="product-meta">
                    <span className="badge badge-category">{selectedProduct.category}</span>
                    <span className="badge badge-cert">{selectedProduct.ecocertification}</span>
                  </div>

                  <p className="product-description">{selectedProduct.description}</p>

                  <div className="product-pricing">
                    <div className="price">${selectedProduct.price.toFixed(2)}</div>
                    <div className={`stock ${selectedProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>

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

                  <div style={{ marginBottom: 20 }}>
                    <button
                      className="btn-view-details"
                      style={{ padding: '12px 24px' }}
                      onClick={() => handleAddToCart(selectedProduct._id)}
                    >
                      Add to cart
                    </button>
                  </div>

                  {selectedProduct.manufacturerInfo && (
                    <div className="manufacturer-info">
                      <h3>Manufacturer</h3>
                      {selectedProduct.manufacturerInfo.name && <p><strong>Name:</strong> {selectedProduct.manufacturerInfo.name}</p>}
                      {selectedProduct.manufacturerInfo.location && <p><strong>Location:</strong> {selectedProduct.manufacturerInfo.location}</p>}
                    </div>
                  )}

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

        <div className="products-layout">
          <aside className="filters-sidebar">
            <h3>Filters</h3>

            <div className="sidebar-filter-group">
              <h4>Category</h4>
              {categories.map((category) => (
                <label key={category} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            <div className="sidebar-filter-group">
              <h4>Certification</h4>
              {certifications.map((certification) => (
                <label key={certification} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={selectedCertifications.includes(certification)}
                    onChange={() => handleCertificationToggle(certification)}
                  />
                  <span>{certification}</span>
                </label>
              ))}
            </div>
          </aside>

          <div className="products-main-content">
            <div className="top-controls-row">
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

              <div className="sort-controls">
                <label htmlFor="sortBy">Sort by</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                  <option value="price-low">Price low</option>
                  <option value="price-high">Price high</option>
                </select>
              </div>

              <div className="product-count">Products: {displayedProducts.length}</div>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <>
                <div className="products-grid">
                  {displayedProducts.map((product) => (
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

                        <div className="product-card-actions">
                          <button
                            className="btn-view-details btn-view-details-wide"
                            onClick={() => setSelectedProduct(product)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn-cart-icon"
                            onClick={() => handleAddToCart(product._id)}
                            aria-label="Add to cart"
                            title="Add to cart"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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
        </div>
      </div>
    </section>
  );
};

export default UserProducts;
