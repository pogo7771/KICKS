import React, { useState } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    X,
    Image as ImageIcon,
    Tag,
    Layers,
    User as UserIcon,
    AlertCircle,
    Activity
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import '../../css/admin/AdminProducts.css';

const AdminProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct, formatPrice, settings } = useStore();
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        stock: 24,
        category: 'Running',
        gender: 'Men',
        rating: 4.5,
        description: '',
        images: {
            primary: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
            secondary: ''
        }
    });

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                price: product.price || '',
                stock: product.stock || 24,
                category: product.category || 'Running',
                gender: product.gender || 'Men',
                rating: product.rating || 4.5,
                description: product.description || '',
                images: product.images || {
                    primary: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
                    secondary: ''
                }
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                brand: '',
                price: '',
                stock: 24,
                category: 'Running',
                gender: 'Men',
                rating: 4.5,
                description: '',
                images: {
                    primary: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
                    secondary: ''
                }
            });
        }
        setShowModal(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    images: { ...formData.images, primary: reader.result }
                });
                setIsUploading(false);
                showNotification('Image uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        };

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct._id || editingProduct.id, productData);
        } else {
            result = await addProduct(productData);
        }

        if (result.success) {
            setShowModal(false);
            showNotification(`Product ${editingProduct ? 'updated' : 'added'} successfully!`, 'success');
        } else {
            showNotification(result.message || "Operation failed", 'error');
        }
    };

    return (
        <div className="admin-products-container">
            <div className="page-header">
                <div>
                    <h1>Products Catalog</h1>
                    <p>Manage inventory, prices and product details</p>
                </div>
                <button className="add-product-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>New Product</span>
                </button>
            </div>

            <div className="content-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, brand or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Inventory</th>
                                <th>Price</th>
                                <th>Classification</th>
                                <th>ID Reference</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id || product.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img src={product.images?.primary} alt={product.name} />
                                            <div>
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-brand">{product.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className={`smaller d-flex align-items-center gap-1 ${(product.stock || 24) < 10 ? 'text-danger fw-bold' : 'text-success'}`}>
                                                {(product.stock || 24) < 10 ? <><AlertCircle size={12} /> Low Stock</> : 'In Stock'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-primary">{formatPrice(product.price || 0)}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="badge bg-light text-dark border w-fit">{product.category}</span>
                                            <span className="badge bg-secondary-subtle text-secondary w-fit">{product.gender}</span>
                                        </div>
                                    </td>
                                    <td><code className="id-badge">#{(product._id || product.id).slice(-6).toUpperCase()}</code></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" onClick={() => handleOpenModal(product)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this product?')) {
                                                    const res = await deleteProduct(product._id || product.id);
                                                    if (res.success) {
                                                        showNotification('Product deleted successfully', 'info');
                                                    } else {
                                                        showNotification('Failed to delete product', 'error');
                                                    }
                                                }
                                            }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <div className="modal-header">
                            <div>
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-secondary smaller mb-0">Complete the information below to {editingProduct ? 'update' : 'create'} the product.</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="image-preview-container mb-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <div className="d-flex flex-column gap-2">
                                    <label className="mb-0">Primary Image Preview</label>
                                    {formData.images.primary ? (
                                        <img src={formData.images.primary} className="preview-img" alt="Preview" />
                                    ) : (
                                        <div className="preview-placeholder"><ImageIcon size={32} /></div>
                                    )}
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-center gap-3">
                                    <div className="form-group mb-0">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="mb-0">Primary Image URL</label>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 smaller text-primary text-decoration-none fw-bold"
                                                onClick={() => fileInputRef.current.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? 'Uploading...' : 'Or Upload File'}
                                            </button>
                                        </div>
                                        <input
                                            type="url"
                                            className="bg-white"
                                            value={formData.images.primary}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                images: { ...formData.images, primary: e.target.value }
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-0">
                                        <label>Secondary Image URL (Optional)</label>
                                        <input
                                            type="url"
                                            className="bg-white"
                                            value={formData.images.secondary}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                images: { ...formData.images, secondary: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label><Tag size={14} className="me-1" />Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Price ({settings?.currency?.split(' ')?.[1] || '₹'})</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label><Layers size={14} className="me-1" />Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Running</option>
                                        <option>Casual</option>
                                        <option>Basketball</option>
                                        <option>Lifestyle</option>
                                        <option>Classic</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label><UserIcon size={14} className="me-1" />Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Unisex</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label>Product Description</label>
                                <textarea
                                    className="modal-textarea"
                                    rows="4"
                                    placeholder="Describe the shoe's history, technology, and fit..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="submit-btn d-flex align-items-center gap-2">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default AdminProducts;
