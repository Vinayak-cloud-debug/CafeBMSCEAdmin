

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function AdminPage() {
  const { userData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gender, setGender] = useState("");
  const [orders, setOrders] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const fname = localStorage.getItem("FullName");
      const mailId = localStorage.getItem("EmailId");
      const gend = localStorage.getItem("Gender");
      setFullName(fname);
      setEmailId(mailId);
      setGender(gend);
      setIsLoading(false);
    }, 3000);
  }, [userData]);

  const email = localStorage.getItem("EmailId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`, {
          email: email
        });

        console.log(res.data)
        setOrders(res.data);
        // const initialStatuses = {};
        // res.data.forEach(order => {
        //   initialStatuses[order._id] = order.status;
        // });
        // setEditedStatuses(initialStatuses);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, [location.pathname]);

  const handleStatusChange = (orderId, newStatus) => {
    setEditedStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const updateAllStatuses = async () => {
    const updates = Object.entries(editedStatuses).filter(([id, status]) => {
      const order = orders.find(o => o._id === id);
      return order && order.status !== status;
    });

    try {
      await Promise.all(updates.map(([orderId, newStatus]) =>
        axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
          orderId,
          newStatus
        })
      ));

      const updatedOrders = orders.map(order => ({
        ...order,
        status: editedStatuses[order._id] || order.status
      }));
      setOrders(updatedOrders);

      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Failed to update some status.");
    }
  };

  if (isLoading || !fullName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800">AdminPage</h2>

      {orders.map((user, index) => (
        <div key={user._id} className="bg-white rounded-2xl shadow-xl mt-10 p-8 w-full max-w-3xl">
          
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <User size={60} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-semibold">Email:</span> {user.username}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Gender:</span> {user.gender}
            </p>
            
          </div>

          {/* Orders Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders</h2>

            {user.orders.length === 0 ? (
              <p className="text-gray-500 text-center">No orders found.</p>
            ) : (
              <>
                {user.orders.map((order, idx) => (
                  <div key={order._id || idx} className="border rounded-lg shadow-sm p-4 mb-6 bg-gray-50 hover:shadow-md transition">
                    <p className="text-lg font-semibold text-red-600">Order #{idx + 1}</p>
                    <p className="text-sm text-gray-700">Order ID: <span className="text-gray-600">{order._id}</span></p>
                    <p className="text-sm text-gray-700">Ordered on: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
                    <p className="text-sm text-gray-700">Current Status: <span className="capitalize text-blue-600">{order.status}</span></p>
                    <p className="text-sm text-gray-800 mt-1 font-medium">Total: ₹{order.totalAmount}</p>

                    {/* Status Dropdown */}
                    <div className="mt-2">
                      <label className="text-sm font-medium text-gray-700 mr-2">Change Status:</label>
                      <select
                        value={editedStatuses[order._id] || order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-1 rounded border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex items-center justify-between text-sm bg-white p-2 rounded shadow">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            {item.imgUrl && (
                              <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md border"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="text-center mt-8">
        <button
          onClick={updateAllStatuses}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-shadow hover:shadow-lg"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}

