import React, { useState } from 'react';
import {
    Users,
    Search,
    Mail,
    Calendar,
    MoreVertical,
    UserCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import '../../css/admin/AdminOrders.css'; // Reusing table styles

const AdminCustomers = () => {
    const { customers } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = (customers || []).filter(customer =>
        (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-orders-container">
            <div className="page-header">
                <div>
                    <h1>Customers</h1>
                    <p>Manage and view your registered users</p>
                </div>
            </div>

            <div className="content-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Registered On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer._id || customer.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-light p-2 rounded-circle">
                                                <UserCircle size={24} className="text-primary" />
                                            </div>
                                            <strong>{customer.name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <Mail size={16} className="text-secondary" />
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={16} className="text-secondary" />
                                            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge rounded-pill bg-success-subtle text-success px-3">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-link text-dark p-0">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-5">
                        <Users size={48} className="text-secondary opacity-25 mb-3" />
                        <p className="text-secondary">No customers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
