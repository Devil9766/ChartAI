import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import api from "./api";

export default function AdminDashboard() {
    const [admin, setAdmin] = useState("");
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user", password: "" });

    const openAddForm = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "user", password: "" });
    setShowForm(true);
    };

    const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setShowForm(true);
    };

    const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "user", password: "" });
    };


    useEffect(() => {
        const fetchAdminData = async () => {
        try {
            const profileRes = await api.get("/profile");
            setAdmin(profileRes.data.name);

            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);

            const usersRes = await api.get("/admin/users");
            setUsers(usersRes.data);
        } catch (err) {
            setError("Error fetching admin data");
            console.error(err);
        }
        };
        fetchAdminData();
    }, []);

    const handleBlockUser = async (userId) => {
        try {
        await api.post(`/admin/block/${userId}`);
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, blocked: true } : u));
        } catch (err) {
        alert("Failed to block user");
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await api.post(`/admin/unblock/${userId}`);
            setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, blocked: false } : u));
        } catch (err) {
            alert("Failed to unblock user");
        }
        };

        const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async () => {
            try {
                if (editingUser) {
                const { name, email, role } = formData;
                await api.put(`/admin/users/${editingUser.id}`, { name, email, role });
                setUsers((prev) =>
                    prev.map((u) => (u.id === editingUser.id ? { ...u, name, email, role } : u))
                );
                } else {
                const res = await api.post("/admin/users", formData);
                setUsers((prev) => [...prev, res.data]);
                }
                setShowForm(false);
            } catch (err) {
                alert("Failed to save user");
                console.error(err);
            }
            };


        const handleDeleteUser = async (userId) => {
            if (!window.confirm("Are you sure you want to delete this user?")) return;

            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            } catch (err) {
                alert("Failed to delete user");
                console.error(err);
            }
            };

    return (
        <div className="admin-dashboard">
            <h1>Welcome Admin {admin} 🛡️</h1>

            <div className="admin-widgets">
                <div className="count-block"><p>Total Users:</p><p className="count">{stats.user_count}</p></div>
                <div className="count-block"><p>Total Files:</p><p className="count">{stats.file_count}</p></div>
                <div className="count-block"><p>Total Reports:</p><p className="count">{stats.report_count}</p></div>
                <div className="count-block"><p>Visualizations:</p><p className="count">{stats.visualization_count}</p></div>
            </div>

            <div className="admin-user-section">
                <h3>Manage Users 👥</h3>
                {users.length === 0 && <p>No users found.</p>}
                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                    <button onClick={openAddForm} className="add-btn">➕ Add User</button>
                </div>

                <table className="admin-user-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.blocked ? "Blocked" : "Active"}</td>
                        <td>
                            <button onClick={() => openEditForm(u)} className="edit-btn">Edit</button>
                            {u.blocked ? (
                                <button onClick={() => handleUnblockUser(u.id)} className="unblock-btn">Unblock</button>
                            ) : (
                                <button onClick={() => handleBlockUser(u.id)} className="block-btn">Block</button>
                            )}
                            <button onClick={() => handleDeleteUser(u.id)} className="delete-btn">🗑️</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                    <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {!editingUser && (
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password || ""}
                            onChange={handleChange}
                        />
                    )}

                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={handleSubmit} className="save-btn">Save</button>
                        <button onClick={closeForm} className="cancel-btn">Cancel</button>
                    </div>
                    </div>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
