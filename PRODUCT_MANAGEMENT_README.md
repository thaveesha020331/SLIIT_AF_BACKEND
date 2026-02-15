// Product Management API - Implementation Guide

# Eco-Friendly Product Management System

## Overview

A comprehensive product management system designed for eco-friendly and sustainable products. The system includes admin capabilities for managing products and user features for browsing, filtering, and reviewing eco-friendly items with detailed environmental impact scores.

## Features

### Admin Features
- **Product Management**
  - Create new products with detailed information
  - Edit existing product information
  - Delete products from the catalog
  - Upload and manage product images
  - View product analytics and eco-impact data

### User Features
- **Product Browsing**
  - View all available eco-friendly products
  - Filter by category, certification, and price range
  - Search for specific products
  - View detailed product information
  - Check eco-impact scores and sustainability ratings

- **Reviews & Ratings**
  - Add reviews to products
  - Rate products (1-5 stars)
  - View customer reviews
  - See average product ratings

### System Features
- **Eco-Impact Scoring**
  - Carbon footprint calculation
  - Sustainability rating (0-100%)
  - Water usage estimation
  - Recyclability score
  - Third-party API integration for real environmental data

- **Product Categories**
  - Reusable
  - Organic
  - Handmade
  - Biodegradable
  - Sustainable
  - Eco-friendly

- **Eco-Certifications**
  - FSC (Forest Stewardship Council)
  - USDA Organic
  - Fair Trade
  - Carbon Neutral
  - B Corp
  - Cradle to Cradle
  - EU Ecolabel
  - Green Seal

## API Endpoints

### Product CRUD Operations

#### Create Product (Admin)
\`\`\`
POST /api/products
Content-Type: multipart/form-data

Body:
{
  "title": "Eco Bottle",
  "description": "Sustainable reusable water bottle",
  "price": 29.99,
  "stock": 100,
  "category": "Reusable",
  "ecocertification": "Carbon Neutral",
  "image": [file],
  "manufacturerInfo": {
    "name": "EcoCompany",
    "location": "USA"
  }
}

Response: 201 Created
{
  "status": "success",
  "message": "Product created successfully",
  "data": { product object }
}
\`\`\`

#### Get All Products
\`\`\`
GET /api/products?page=1&limit=10&category=Reusable&ecocertification=Carbon Neutral&minPrice=0&maxPrice=100&search=bottle

Query Parameters:
- page: Page number (default: 1)
- limit: Products per page (default: 10)
- category: Filter by category
- ecocertification: Filter by certification
- minPrice: Minimum price filter
- maxPrice: Maximum price filter
- search: Text search in title and description
- sort: Sort field (default: -createdAt)

Response: 200 OK
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": [ products array ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
\`\`\`

#### Get Product by ID
\`\`\`
GET /api/products/:id

Response: 200 OK
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": { product object }
}
\`\`\`

#### Update Product (Admin)
\`\`\`
PUT /api/products/:id
Content-Type: multipart/form-data

Body: (Same as Create, all fields optional)

Response: 200 OK
{
  "status": "success",
  "message": "Product updated successfully",
  "data": { updated product object }
}
\`\`\`

#### Delete Product (Admin)
\`\`\`
DELETE /api/products/:id

Response: 200 OK
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": { deleted product object }
}
\`\`\`

### Category Endpoints

#### Get Products by Category
\`\`\`
GET /api/products/category/:category?page=1&limit=10

Response: 200 OK (Same pagination format as GET /api/products)
\`\`\`

### Certification Endpoints

#### Get Products by Certification
\`\`\`
GET /api/products/certification/:certification?page=1&limit=10

Response: 200 OK (Same pagination format as GET /api/products)
\`\`\`

### Review Endpoints

#### Add Review to Product (User)
\`\`\`
POST /api/products/:id/reviews

Body:
{
  "rating": 5,
  "comment": "Great product!"
}

Validation:
- rating: Required, integer between 1-5
- comment: Optional, max 500 characters

Response: 201 Created
{
  "status": "success",
  "message": "Review added successfully",
  "data": { updated product object }
}
\`\`\`

## Product Data Structure

### Product Object
\`\`\`javascript
{
  "_id": ObjectId,
  "title": String (required, 3-100 chars),
  "description": String (required, 10-1000 chars),
  "price": Number (required, > 0),
  "stock": Number (required, >= 0),
  "category": String (required, enum: Reusable|Organic|Handmade|Biodegradable|Sustainable|Ecofriendly),
  "image": String (required, URL),
  "imagePath": String (internal path),
  "ecocertification": String (required, enum: FSC|USDA Organic|Fair Trade|Carbon Neutral|B Corp|Cradle to Cradle|EU Ecolabel|Green Seal),
  "ecoImpactScore": {
    "carbonFootprint": Number (kg CO2e),
    "sustainabilityRating": Number (0-100%),
    "waterUsage": Number (liters),
    "recyclabilityScore": Number (0-100%)
  },
  "manufacturerInfo": {
    "name": String,
    "location": String,
    "certifications": [String]
  },
  "reviews": [
    {
      "userId": ObjectId,
      "rating": Number (1-5),
      "comment": String,
      "createdAt": Date
    }
  ],
  "isActive": Boolean (default: true),
  "createdBy": ObjectId,
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

## Validation Rules

### Price Validation
- Must be a number
- Must be greater than 0
- Cannot be null or undefined

### Stock Validation
- Must be a non-negative integer
- Minimum value: 0
- No maximum limit

### Eco-Certification Validation
- Must be one of the predefined certifications
- Case-sensitive
- Required field

### Category Validation
- Must be one of the predefined categories
- Case-sensitive
- Required field

### Review Validation
- Rating must be an integer between 1 and 5
- Comment is optional but max 500 characters if provided
- UserId required for authentication

## Third-Party API Integration

### Carbon Intensity API
- **Purpose**: Fetch real carbon intensity data for eco-impact calculations
- **Endpoint**: https://api.carbonintensity.org/intensity
- **Response Time**: ~5 seconds timeout
- **Fallback**: Uses baseline calculations if API unavailable

### Integration Details
1. **Real-time Data Fetching**
   - Calls Carbon Intensity API for actual carbon intensity values
   - Adjusts product carbon footprint based on real data

2. **Fallback Strategy**
   - If API unavailable, uses baseline carbon footprint calculations
   - Continues operation without interruption
   - Logs warning for monitoring

3. **Caching Considerations**
   - Consider implementing cache for frequently calculated products
   - Reduces API calls and improves response time
   - TTL: 24 hours recommended

## Image Upload Handling

### Upload Configuration
- **Max File Size**: 5 MB
- **Allowed Formats**: JPEG, PNG, GIF, WebP
- **Storage Location**: /uploads/products/
- **Filename Format**: product-[timestamp]-[random].ext

### Image Operations
1. **Upload**: Store image with unique filename
2. **Validation**: Check file type and size
3. **Deletion**: Remove image when product deleted
4. **Retrieval**: Serve from /uploads/products/ path

## Frontend Components

### Admin Pages
- **AdminProducts.jsx**
  - Product listing with filters
  - Add/Edit/Delete product forms
  - Eco-impact score display
  - Image upload handling

### User Pages
- **UserProducts.jsx**
  - Product browsing and search
  - Filter by category, certification, price
  - Product detail modal
  - Review submission
  - Eco-impact visualization

## Authentication & Authorization

### Currently Commented Out (Implement as needed)
1. **Admin Authentication**
   - Use `adminAuth` middleware for admin routes
   - Protect POST, PUT, DELETE operations

2. **User Authentication**
   - Use `auth` middleware for user routes
   - Required for review submissions

3. **Example Implementation**
\`\`\`javascript
// Models
router.post('/', adminAuth, upload.single('image'), createProduct);
router.put('/:id', adminAuth, upload.single('image'), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.post('/:id/reviews', auth, addReview);
\`\`\`

## Testing

### Test Files
1. **validators.test.js**: Input validation testing
2. **ecoImpactService.test.js**: Eco-impact calculation testing
3. **productController.test.js**: Controller logic and filtering tests

### Run Tests
\`\`\`bash
npm test
\`\`\`

## Error Handling

### Standard Error Responses
\`\`\`javascript
// Validation Error (400)
{
  "status": "error",
  "message": "Validation failed",
  "errors": { field: "error message" }
}

// Not Found Error (404)
{
  "status": "error",
  "message": "Product not found"
}

// Server Error (500)
{
  "status": "error",
  "message": "Failed to [operation]",
  "error": "error message"
}
\`\`\`

## Performance Considerations

1. **Database Indexes**
   - category + isActive
   - title and description (text search)
   - ecocertification

2. **Pagination**
   - Default page size: 10
   - Configurable per request
   - Always use pagination for large datasets

3. **Query Optimization**
   - Use projection to limit returned fields
   - Implement caching for frequently accessed products
   - Consider implementing Redis for performance

## File Structure

\`\`\`
models/Lakna/
├── Product.js

controllers/Lakna/
├── productController.js

routes/Lakna/
├── productRoutes.js

services/Lakna/
├── ecoImpactService.js
├── imageUploadService.js

utills/Lakna/
├── validators.js
├── helpers.js

frontend/src/pages/Lakna/
├── AdminProducts.jsx
├── AdminProducts.css
├── UserProducts.jsx
├── UserProducts.css

tests/Lakna/
├── validators.test.js
├── ecoImpactService.test.js
├── productController.test.js
\`\`\`

## Environment Variables Required

\`\`\`
MONGODB_URI=mongodb://localhost:27017/sliit_af_db
# Optional: Carbon Intensity API configuration
CARBON_API_TIMEOUT=5000
\`\`\`

## Future Enhancements

1. **Advanced Analytics**
   - Product performance metrics
   - User behavior tracking
   - Eco-impact trends

2. **Recommendations**
   - ML-based product recommendations
   - Similar product suggestions
   - Eco-impact matching

3. **Integration Expansion**
   - More third-party environmental APIs
   - Payment gateway integration
   - Email notifications

4. **Mobile App**
   - React Native mobile application
   - Offline functionality
   - Push notifications

5. **Admin Dashboard**
   - Sales analytics
   - User analytics
   - Product performance reports

## Support & Documentation

- API Documentation: See endpoints above
- Component Documentation: JSDoc comments in source code
- Test Coverage: Run test suite for validation

## License

[Your License Here]
