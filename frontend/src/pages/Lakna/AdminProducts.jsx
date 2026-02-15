import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('');

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

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, certificationFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/products?page=${page}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (certificationFilter) url += `&ecocertification=${certificationFilter}`;

      const response = await axios.get(url);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (err) {
      setError('Failed to fetch products');
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.ecocertification) {
      setError('All fields are required');
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'manufacturerInfo') {
          data.append(key, formData[key]);
        } else {
          data.append(key, JSON.stringify(formData.manufacturerInfo));
        }
      });

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, data);
        alert('Product updated successfully');
      } else {
        await axios.post('/api/products', data);
        alert('Product created successfully');
      }

      setShowForm(false);
      setEditingId(null);
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
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
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
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1>Product Management</h1>
        <button className="btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({
            title: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            ecocertification: '',
            image: '',
            manufacturerInfo: { name: '', location: '' },
          });
        }}>
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
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
                accept="image/*"
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
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
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
                <th>Category</th>
                <th>Certification</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Eco-Impact Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
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
    </div>
  );
};

export default AdminProducts;
