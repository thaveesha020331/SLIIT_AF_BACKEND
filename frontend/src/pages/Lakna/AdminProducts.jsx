import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './AdminProducts.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = API_URL.replace(/\/api\/?$/, '');

const AdminProducts = ({ mode = 'both' }) => {
  const [searchParams] = useSearchParams();
  const isAddMode = mode === 'add';
  const isListMode = mode === 'list';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(isAddMode);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('');
  const canShowForm = mode === 'both' || isAddMode || (isListMode && editingId !== null);
  const canShowList = mode === 'both' || isListMode;

  const categories = ['Reusable', 'Organic', 'Handmade', 'Biodegradable', 'Sustainable', 'Ecofriendly'];
  const certifications = ['FSC', 'USDA Organic', 'Fair Trade', 'Carbon Neutral', 'B Corp', 'Cradle to Cradle', 'EU Ecolabel', 'Green Seal'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    ecocertification: '',
    image: '',
    manufacturerInfo: {
      name: '',
      location: '',
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      ecocertification: '',
      image: '',
      manufacturerInfo: {
        name: '',
        location: '',
      },
    });
  };

  useEffect(() => {
    if (mode !== 'both') {
      setShowForm(isAddMode);
      return;
    }

    const view = searchParams.get('view');
    if (view === 'add') {
      setShowForm(true);
      resetForm();
      return;
    }

    if (view === 'list') {
      setShowForm(false);
    }
  }, [searchParams, mode, isAddMode]);

  // Fetch products
  useEffect(() => {
    if (!canShowList) {
      return;
    }
    fetchProducts();
  }, [page, categoryFilter, certificationFilter, canShowList]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/products?page=${page}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (certificationFilter) url += `&ecocertification=${certificationFilter}`;

      const response = await axios.get(url);
      const productList = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data?.products)
          ? response.data.products
          : [];

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (err) {
      setError('Failed to fetch products');
      setProducts([]);
      setFilteredProducts([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('manufacturerInfo.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        manufacturerInfo: {
          ...formData.manufacturerInfo,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const priceValue = Number(formData.price);
    const stockValue = Number(formData.stock);

    if (!trimmedTitle || !trimmedDescription || formData.price === '' || formData.stock === '' || !formData.category || !formData.ecocertification) {
      setError('All required fields must be filled');
      return;
    }

    if (trimmedTitle.length < 3) {
      setError('Title must be at least 3 characters long');
      return;
    }

    if (trimmedDescription.length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (Number.isNaN(stockValue) || stockValue < 0) {
      setError('Stock cannot be negative');
      return;
    }

    if (!editingId && !selectedFile) {
      setError('Please select a product image');
      return;
    }

    try {
      setError(null);

      if (editingId) {
        if (selectedFile) {
          const data = new FormData();
          Object.keys(formData).forEach((key) => {
            if (key === 'manufacturerInfo') {
              data.append(key, JSON.stringify(formData.manufacturerInfo));
            } else if (key === 'image') {
              data.append('image', selectedFile);
            } else {
              data.append(key, formData[key]);
            }
          });
          await axios.put(`${API_URL}/products/${editingId}`, data);
        } else {
          await axios.put(`${API_URL}/products/${editingId}`, {
            ...formData,
            manufacturerInfo: formData.manufacturerInfo,
            image: formData.image,
          });
        }
        alert('Product updated successfully');
      } else {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === 'manufacturerInfo') {
            data.append(key, JSON.stringify(formData.manufacturerInfo));
          } else if (key === 'image') {
            if (selectedFile) {
              data.append('image', selectedFile);
            } else if (formData.image && !formData.image.startsWith('blob:')) {
              data.append('image', formData.image);
            }
          } else {
            data.append(key, formData[key]);
          }
        });
        await axios.post(`${API_URL}/products`, data);
        alert('Product created successfully');
      }

      setShowForm(false);
      if (isAddMode) {
        setShowForm(true);
      }
      resetForm();
      if (canShowList) {
        fetchProducts();
      }
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && typeof backendErrors === 'object') {
        const firstValidationError = Object.values(backendErrors)[0];
        setError(firstValidationError || 'Validation failed');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save product');
      }
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      ecocertification: product.ecocertification,
      image: product.image,
      manufacturerInfo: product.manufacturerInfo || { name: '', location: '' },
    });
    setSelectedFile(null);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const getProductImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
      return imagePath;
    }

    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/${imagePath}`;
  };

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1>Product Management</h1>
        {mode === 'both' && (
          <button className="btn-primary" onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}>
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {canShowForm && showForm && (
        <div className="product-form-container">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (&gt; 0) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock (≥ 0) *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Eco-Certification *</label>
                <select
                  name="ecocertification"
                  value={formData.ecocertification}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select certification</option>
                  {certifications.map((cert) => (
                    <option key={cert} value={cert}>
                      {cert}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Product Image *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                required={!editingId}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="image-preview"
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Manufacturer Name</label>
                <input
                  type="text"
                  name="manufacturerInfo.name"
                  value={formData.manufacturerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>

              <div className="form-group">
                <label>Manufacturer Location</label>
                <input
                  type="text"
                  name="manufacturerInfo.location"
                  value={formData.manufacturerInfo.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (isAddMode) {
                    resetForm();
                    setShowForm(true);
                    return;
                  }

                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {canShowList && (
        <>
          <div className="filters-section">
            <div className="filter-group">
              <label>Filter by Category:</label>
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
              <label>Filter by Certification:</label>
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
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Certification</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Eco-Impact Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(filteredProducts) ? filteredProducts : []).map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={getProductImageSrc(product.image)}
                            alt={product.title}
                            className="table-product-image"
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td>{product.category}</td>
                      <td>{product.ecocertification}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="eco-score">
                          <div className="sustainability-rating">
                            {product.ecoImpactScore?.sustainabilityRating || 0}%
                          </div>
                          <small>CO2: {product.ecoImpactScore?.carbonFootprint || 0} kg</small>
                        </div>
                      </td>
                      <td className="actions">
                        <button className="btn-edit" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
