

// import React, { useState, useEffect } from 'react';
// import { User, Lock, Eye, EyeOff } from 'lucide-react';
// import { useAuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// export default function AdminPage() {
//   const { userData } = useAuthContext();
//   const [isLoading, setIsLoading] = useState(true);
//   const [fullName, setFullName] = useState("");
//   const [emailId, setEmailId] = useState("");
//   const [gender, setGender] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [editedStatuses, setEditedStatuses] = useState({});
//   const [isUpdating, setIsUpdating] = useState(false);
  
//   // Password protection states
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [isCheckingPassword, setIsCheckingPassword] = useState(false);

//   const ADMIN_PASSWORD = "BullMarket@12";
//   const location = useLocation();

//   useEffect(() => {
//     setTimeout(() => {
//       const fname = localStorage.getItem("FullName");
//       const mailId = localStorage.getItem("EmailId");
//       const gend = localStorage.getItem("Gender");
//       setFullName(fname);
//       setEmailId(mailId);
//       setGender(gend);
//       setIsLoading(false);
//     }, 3000);
//   }, [userData]);

//   const email = localStorage.getItem("EmailId");

//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchOrders = async () => {
//         try {
//           const res = await axios.get(`http://localhost:9001/api/fetchUserOrders`);
//           console.log(res.data);
//           setOrders(res.data);
          
//           // Initialize editedStatuses with current order statuses
//           const initialStatuses = {};
//           res.data.forEach(user => {
//             user.orders.forEach(order => {
//               initialStatuses[order._id] = order.status;
//             });
//           });
//           setEditedStatuses(initialStatuses);
//         } catch (err) {
//           console.error("Failed to fetch orders:", err);
//           alert("Failed to fetch orders. Please try again.");
//         }
//       };
//       fetchOrders();
//     }
//   }, [location.pathname, isAuthenticated]);

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     setIsCheckingPassword(true);
//     setPasswordError("");

//     // Simulate a small delay for better UX
//     setTimeout(() => {
//       if (password === ADMIN_PASSWORD) {
//         setIsAuthenticated(true);
//         setPassword(""); // Clear password from state for security
//       } else {
//         setPasswordError("Incorrect password. Please try again.");
//         setPassword("");
//       }
//       setIsCheckingPassword(false);
//     }, 1000);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setPassword("");
//     setPasswordError("");
//     setOrders([]);
//     setEditedStatuses({});
//   };

//   const handleStatusChange = (orderId, newStatus) => {
//     setEditedStatuses(prev => ({
//       ...prev,
//       [orderId]: newStatus
//     }));
//   };

//   const updateAllStatuses = async () => {
//     // Find all orders that have been changed
//     const updates = [];
    
//     orders.forEach(user => {
//       user.orders.forEach(order => {
//         if (editedStatuses[order._id] && editedStatuses[order._id] !== order.status) {
//           updates.push({
//             orders:order,
//             fullName: user.fullName,
//             email: user.username,
//             orderId: order._id,
//             newStatus: editedStatuses[order._id]
//           });
//         }
//       });
//     });

//     if (updates.length === 0) {
//       alert("No changes to save.");
//       return;
//     }

//     setIsUpdating(true);
    
//     try {
//       // Update each order status
//       const updatePromises = updates.map(({orders, fullName, email, orderId, newStatus }) =>
        
//         axios.put(`http://localhost:9001/api/updateOrderStatus`, {
//           orders,
//           fullName,
//           email,
//           orderId,
//           status: newStatus
//         })
//       );

//       await Promise.all(updatePromises);

//       // Update local state to reflect changes
//       const updatedOrders = orders.map(user => ({
//         ...user,
//         orders: user.orders.map(order => ({
//           ...order,
//           status: editedStatuses[order._id] || order.status
//         }))
//       }));
      
//       setOrders(updatedOrders);
//       alert(`Successfully updated ${updates.length} order status(es)!`);
      
//     } catch (error) {
//       console.error("Error updating statuses:", error);
//       alert("Failed to update order status. Please try again.");
      
//       // Revert editedStatuses to original values on error
//       const revertedStatuses = {};
//       orders.forEach(user => {
//         user.orders.forEach(order => {
//           revertedStatuses[order._id] = order.status;
//         });
//       });
//       setEditedStatuses(revertedStatuses);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Loading screen
//   if (isLoading || !fullName) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-lg font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // Password protection screen
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
//         <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//           <div className="flex flex-col items-center text-center mb-8">
//             <div className="flex justify-center items-center mb-4 p-4 bg-red-100 rounded-full">
//               <Lock size={40} className="text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
//             <p className="text-gray-600 text-sm">
//               Please enter the admin password to access the panel
//             </p>
//           </div>

//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter admin password"
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 required
//                 disabled={isCheckingPassword}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 disabled={isCheckingPassword}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {passwordError && (
//               <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                 {passwordError}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isCheckingPassword || !password.trim()}
//               className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
//                 isCheckingPassword || !password.trim()
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-red-600 hover:bg-red-700 active:scale-95'
//               } text-white`}
//             >
//               {isCheckingPassword ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
//                   Verifying...
//                 </>
//               ) : (
//                 'Access Admin Panel'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-xs text-gray-500">
//               Authorized personnel only
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main admin panel (only shown after authentication)
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
//       <div className="w-full max-w-4xl mb-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800">Admin Panel - Order Management</h2>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div className="text-center text-gray-500">
//           <p>No orders found.</p>
//         </div>
//       ) : (
//         orders.map((user, index) => (
//           <div key={user._id} className="bg-white rounded-2xl shadow-xl mt-10 p-8 w-full max-w-3xl">

//             {/* Profile Section */}
//             <div className="flex flex-col items-center text-center mb-8">
//               <div className="flex justify-center items-center mb-4">
//                 <User size={60} className="text-red-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
//               <p className="text-gray-600 text-sm mt-1">
//                 <span className="font-semibold">Email:</span> {user.username}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 <span className="font-semibold">Gender:</span> {user.gender}
//               </p>
//             </div>

//             {/* Orders Section */}
//             <div className="mt-10">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders ({user.orders.length})</h2>

//               {user.orders.length === 0 ? (
//                 <p className="text-gray-500 text-center">No orders found for this user.</p>
//               ) : (
//                 <>
//                   {user.orders.map((order, idx) => (
//                     <div key={order._id || idx} className="border rounded-lg shadow-sm p-4 mb-6 bg-gray-50 hover:shadow-md transition">
//                       <p className="text-lg font-semibold text-red-600">Order #{idx + 1}</p>
//                       <p className="text-sm text-gray-700">Order ID: <span className="text-gray-600 font-mono">{order._id}</span></p>
//                       <p className="text-sm text-gray-700">Ordered on: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
//                       <p className="text-sm text-gray-700">
//                         Current Status: 
//                         <span className={`capitalize ml-1 px-2 py-1 rounded text-xs font-medium ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-800 mt-1 font-medium">Total: ₹{order.totalAmount}</p>

//                       {/* Status Dropdown */}
//                       <div className="mt-3">
//                         <label className="text-sm font-medium text-gray-700 mr-2">Change Status:</label>
//                         <select
//                           value={editedStatuses[order._id] || order.status}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="px-3 py-2 rounded border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                           disabled={isUpdating}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="shipped">Shipped</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                         {editedStatuses[order._id] !== order.status && (
//                           <span className="ml-2 text-xs text-orange-600 font-medium">
//                             * Modified
//                           </span>
//                         )}
//                       </div>

//                       {/* Order Items */}
//                       <div className="mt-4">
//                         <h4 className="text-sm font-semibold text-gray-700 mb-2">Items:</h4>
//                         <ul className="space-y-2">
//                           {order.items.map((item, i) => (
//                             <li key={i} className="flex items-center justify-between text-sm bg-white p-3 rounded shadow">
//                               <div>
//                                 <p className="font-medium">{item.name}</p>
//                                 <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
//                                 <p className="text-gray-600 text-xs font-medium">Subtotal: ₹{item.quantity * item.price}</p>
//                               </div>
//                               {item.imgUrl && (
//                                 <img
//                                   src={item.imgUrl}
//                                   alt={item.name}
//                                   className="w-12 h-12 object-cover rounded-md border"
//                                 />
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </div>
//           </div>
//         ))
//       )}

//       {/* Floating Save Button */}
//       <div className="fixed bottom-20 right-6 z-50">
//         <button
//           onClick={updateAllStatuses}
//           disabled={isUpdating}
//           className={`w-40 h-12 font-semibold rounded-full flex items-center justify-center shadow-lg transition duration-200 ${
//             isUpdating 
//               ? 'bg-gray-400 cursor-not-allowed' 
//               : 'bg-green-600 hover:bg-green-700 active:scale-95'
//           } text-white`}
//           aria-label="Save all order status changes"
//         >
//           {isUpdating ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//               Saving...
//             </>
//           ) : (
//             'Save All Changes'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password protection states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // Filtering and display states
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUsers, setExpandedUsers] = useState({});
  const [compactView, setCompactView] = useState(true);

  const ADMIN_PASSWORD = "BullMarket@12";
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
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`);
          console.log(res.data);
          setOrders(res.data);
          
          // Initialize editedStatuses with current order statuses
          const initialStatuses = {};
          res.data.forEach(user => {
            user.orders.forEach(order => {
              initialStatuses[order._id] = order.status;
            });
          });
          setEditedStatuses(initialStatuses);

          // Auto-expand users with orders
          const initialExpanded = {};
          res.data.forEach(user => {
            if (user.orders.length > 0) {
              initialExpanded[user._id] = true;
            }
          });
          setExpandedUsers(initialExpanded);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          alert("Failed to fetch orders. Please try again.");
        }
      };
      fetchOrders();
    }
  }, [location.pathname, isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsCheckingPassword(true);
    setPasswordError("");

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setPasswordError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsCheckingPassword(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setPasswordError("");
    setOrders([]);
    setEditedStatuses({});
    setExpandedUsers({});
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setEditedStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  // Filter orders based on status
  const getFilteredOrders = (userOrders) => {
    if (statusFilter === 'all') return userOrders;
    return userOrders.filter(order => order.status === statusFilter);
  };

  // Get order counts by status for a user
  const getOrderCounts = (userOrders) => {
    const counts = {
      all: userOrders.length,
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    userOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    return counts;
  };

  const updateAllStatuses = async () => {
    const updates = [];
    
    orders.forEach(user => {
      user.orders.forEach(order => {
        if (editedStatuses[order._id] && editedStatuses[order._id] !== order.status) {
          updates.push({
            orders: order,
            fullName: user.fullName,
            email: user.username,
            orderId: order._id,
            newStatus: editedStatuses[order._id]
          });
        }
      });
    });

    if (updates.length === 0) {
      alert("No changes to save.");
      return;
    }

    setIsUpdating(true);
    
    try {
      const updatePromises = updates.map(({orders, fullName, email, orderId, newStatus }) =>
        axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
          orders,
          fullName,
          email,
          orderId,
          status: newStatus
        })
      );

      await Promise.all(updatePromises);

      const updatedOrders = orders.map(user => ({
        ...user,
        orders: user.orders.map(order => ({
          ...order,
          status: editedStatuses[order._id] || order.status
        }))
      }));
      
      setOrders(updatedOrders);
      alert(`Successfully updated ${updates.length} order status(es)!`);
      
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Failed to update order status. Please try again.");
      
      const revertedStatuses = {};
      orders.forEach(user => {
        user.orders.forEach(order => {
          revertedStatuses[order._id] = order.status;
        });
      });
      setEditedStatuses(revertedStatuses);
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading screen
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

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex justify-center items-center mb-4 p-4 bg-red-100 rounded-full">
              <Lock size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
            <p className="text-gray-600 text-sm">
              Please enter the admin password to access the panel
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                disabled={isCheckingPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isCheckingPassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {passwordError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={isCheckingPassword || !password.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                isCheckingPassword || !password.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:scale-95'
              } text-white`}
            >
              {isCheckingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  Verifying...
                </>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel - Order Management</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Filter Controls */}
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => setCompactView(!compactView)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200"
              >
                {compactView ? 'Detailed View' : 'Compact View'}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 bg-white rounded-lg p-8">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((user) => {
              const filteredOrders = getFilteredOrders(user.orders);
              const orderCounts = getOrderCounts(user.orders);
              const isExpanded = expandedUsers[user._id];

              if (filteredOrders.length === 0 && statusFilter !== 'all') {
                return null; // Hide users with no orders matching filter
              }

              return (
                <div key={user._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* User Header */}
                  <div 
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => toggleUserExpansion(user._id)}
                  >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User size={32} className="text-red-600" />
                        <div>
                          <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                          <p className="text-sm text-gray-600">{user.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Order Status Summary */}
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Pending: {orderCounts.pending}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Shipped: {orderCounts.shipped}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            Delivered: {orderCounts.delivered}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                            Cancelled: {orderCounts.cancelled}
                          </span>
                        </div>
                        
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  {isExpanded && (
                    <div className="p-4">
                      {filteredOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No orders found for this status.</p>
                      ) : (
                        <div className="space-y-3">
                          {filteredOrders.map((order, idx) => (
                            <div key={order._id || idx} className={`border rounded-lg p-3 ${compactView ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                {/* Order Info */}
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="font-medium text-red-600">Order #{idx + 1}</span>
                                    <span className="text-xs text-gray-500 font-mono">{order._id}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                    {editedStatuses[order._id] !== order.status && (
                                      <span className="text-xs text-orange-600 font-medium">* Modified</span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span>₹{order.totalAmount}</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>{order.items.length} items</span>
                                  </div>
                                </div>

                                {/* Status Change */}
                                <div className="flex items-center gap-2">
                                  <select
                                    value={editedStatuses[order._id] || order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={isUpdating}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>

                              {/* Order Items (shown in detailed view) */}
                              {!compactView && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {order.items.map((item, i) => (
                                      <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                                        {item.imgUrl && (
                                          <img
                                            src={item.imgUrl}
                                            alt={item.name}
                                            className="w-8 h-8 object-cover rounded"
                                          />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">{item.name}</p>
                                          <p className="text-xs text-gray-500">
                                            {item.quantity} × ₹{item.price}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      {Object.keys(editedStatuses).some(orderId => 
        orders.some(user => 
          user.orders.some(order => 
            order._id === orderId && editedStatuses[orderId] !== order.status
          )
        )
      ) && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={updateAllStatuses}
            disabled={isUpdating}
            className={`px-6 py-3 font-semibold rounded-full flex items-center gap-2 shadow-lg transition duration-200 ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:scale-95'
            } text-white`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </div>
  );
}



// import React, { useState, useEffect } from 'react';
// import { User, Lock, Eye, EyeOff } from 'lucide-react';
// import { useAuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// export default function AdminPage() {
//   const { userData } = useAuthContext();
//   const [isLoading, setIsLoading] = useState(true);
//   const [fullName, setFullName] = useState("");
//   const [emailId, setEmailId] = useState("");
//   const [gender, setGender] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [editedStatuses, setEditedStatuses] = useState({});
//   const [isUpdating, setIsUpdating] = useState(false);
  
//   // Password protection states
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [isCheckingPassword, setIsCheckingPassword] = useState(false);

//   const ADMIN_PASSWORD = "BullMarket@12";
//   const location = useLocation();

//   useEffect(() => {
//     setTimeout(() => {
//       const fname = localStorage.getItem("FullName");
//       const mailId = localStorage.getItem("EmailId");
//       const gend = localStorage.getItem("Gender");
//       setFullName(fname);
//       setEmailId(mailId);
//       setGender(gend);
//       setIsLoading(false);
//     }, 3000);
//   }, [userData]);

//   const email = localStorage.getItem("EmailId");

//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchOrders = async () => {
//         try {
//           const res = await axios.get(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`);
//           console.log(res.data);
//           setOrders(res.data);
          
//           // Initialize editedStatuses with current order statuses
//           const initialStatuses = {};
//           res.data.forEach(user => {
//             user.orders.forEach(order => {
//               initialStatuses[order._id] = order.status;
//             });
//           });
//           setEditedStatuses(initialStatuses);
//         } catch (err) {
//           console.error("Failed to fetch orders:", err);
//           alert("Failed to fetch orders. Please try again.");
//         }
//       };
//       fetchOrders();
//     }
//   }, [location.pathname, isAuthenticated]);

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     setIsCheckingPassword(true);
//     setPasswordError("");

//     // Simulate a small delay for better UX
//     setTimeout(() => {
//       if (password === ADMIN_PASSWORD) {
//         setIsAuthenticated(true);
//         setPassword(""); // Clear password from state for security
//       } else {
//         setPasswordError("Incorrect password. Please try again.");
//         setPassword("");
//       }
//       setIsCheckingPassword(false);
//     }, 1000);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setPassword("");
//     setPasswordError("");
//     setOrders([]);
//     setEditedStatuses({});
//   };

//   const handleStatusChange = (orderId, newStatus) => {
//     setEditedStatuses(prev => ({
//       ...prev,
//       [orderId]: newStatus
//     }));
//   };

//   const updateAllStatuses = async () => {
//     // Find all orders that have been changed
//     const updates = [];
    
//     orders.forEach(user => {
//       user.orders.forEach(order => {
//         if (editedStatuses[order._id] && editedStatuses[order._id] !== order.status) {
//           updates.push({
//             fullName: user.fullName,
//             email: user.username,
//             orderId: order._id,
//             newStatus: editedStatuses[order._id]
//           });
//         }
//       });
//     });

//     if (updates.length === 0) {
//       alert("No changes to save.");
//       return;
//     }

//     setIsUpdating(true);
    
//     try {
//       // Update each order status
//       const updatePromises = updates.map(({ fullName, email, orderId, newStatus }) =>
//         axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
//           fullName:fullName,
//           email:email,
//           orderId:orderId,
//           status: newStatus
//         })
//       );

//       await Promise.all(updatePromises);

//       // Update local state to reflect changes
//       const updatedOrders = orders.map(user => ({
//         ...user,
//         orders: user.orders.map(order => ({
//           ...order,
//           status: editedStatuses[order._id] || order.status
//         }))
//       }));
      
//       setOrders(updatedOrders);
//       alert(`Successfully updated ${updates.length} order status(es)!`);
      
//     } catch (error) {
//       console.error("Error updating statuses:", error);
//       alert("Failed to update order status. Please try again.");
      
//       // Revert editedStatuses to original values on error
//       const revertedStatuses = {};
//       orders.forEach(user => {
//         user.orders.forEach(order => {
//           revertedStatuses[order._id] = order.status;
//         });
//       });
//       setEditedStatuses(revertedStatuses);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Loading screen
//   if (isLoading || !fullName) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-lg font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // Password protection screen
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
//         <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//           <div className="flex flex-col items-center text-center mb-8">
//             <div className="flex justify-center items-center mb-4 p-4 bg-red-100 rounded-full">
//               <Lock size={40} className="text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
//             <p className="text-gray-600 text-sm">
//               Please enter the admin password to access the panel
//             </p>
//           </div>

//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter admin password"
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 required
//                 disabled={isCheckingPassword}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 disabled={isCheckingPassword}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {passwordError && (
//               <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                 {passwordError}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isCheckingPassword || !password.trim()}
//               className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
//                 isCheckingPassword || !password.trim()
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-red-600 hover:bg-red-700 active:scale-95'
//               } text-white`}
//             >
//               {isCheckingPassword ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
//                   Verifying...
//                 </>
//               ) : (
//                 'Access Admin Panel'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-xs text-gray-500">
//               Authorized personnel only
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main admin panel (only shown after authentication)
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
//       <div className="w-full max-w-4xl mb-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800">Admin Panel - Order Management</h2>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div className="text-center text-gray-500">
//           <p>No orders found.</p>
//         </div>
//       ) : (
//         orders.map((user, index) => (
//           <div key={user._id} className="bg-white rounded-2xl shadow-xl mt-10 p-8 w-full max-w-3xl">

//             {/* Profile Section */}
//             <div className="flex flex-col items-center text-center mb-8">
//               <div className="flex justify-center items-center mb-4">
//                 <User size={60} className="text-red-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
//               <p className="text-gray-600 text-sm mt-1">
//                 <span className="font-semibold">Email:</span> {user.username}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 <span className="font-semibold">Gender:</span> {user.gender}
//               </p>
//             </div>

//             {/* Orders Section */}
//             <div className="mt-10">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders ({user.orders.length})</h2>

//               {user.orders.length === 0 ? (
//                 <p className="text-gray-500 text-center">No orders found for this user.</p>
//               ) : (
//                 <>
//                   {user.orders.map((order, idx) => (
//                     <div key={order._id || idx} className="border rounded-lg shadow-sm p-4 mb-6 bg-gray-50 hover:shadow-md transition">
//                       <p className="text-lg font-semibold text-red-600">Order #{idx + 1}</p>
//                       <p className="text-sm text-gray-700">Order ID: <span className="text-gray-600 font-mono">{order._id}</span></p>
//                       <p className="text-sm text-gray-700">Ordered on: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
//                       <p className="text-sm text-gray-700">
//                         Current Status: 
//                         <span className={`capitalize ml-1 px-2 py-1 rounded text-xs font-medium ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-800 mt-1 font-medium">Total: ₹{order.totalAmount}</p>

//                       {/* Status Dropdown */}
//                       <div className="mt-3">
//                         <label className="text-sm font-medium text-gray-700 mr-2">Change Status:</label>
//                         <select
//                           value={editedStatuses[order._id] || order.status}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="px-3 py-2 rounded border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                           disabled={isUpdating}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="shipped">Shipped</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                         {editedStatuses[order._id] !== order.status && (
//                           <span className="ml-2 text-xs text-orange-600 font-medium">
//                             * Modified
//                           </span>
//                         )}
//                       </div>

//                       {/* Order Items */}
//                       <div className="mt-4">
//                         <h4 className="text-sm font-semibold text-gray-700 mb-2">Items:</h4>
//                         <ul className="space-y-2">
//                           {order.items.map((item, i) => (
//                             <li key={i} className="flex items-center justify-between text-sm bg-white p-3 rounded shadow">
//                               <div>
//                                 <p className="font-medium">{item.name}</p>
//                                 <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
//                                 <p className="text-gray-600 text-xs font-medium">Subtotal: ₹{item.quantity * item.price}</p>
//                               </div>
//                               {item.imgUrl && (
//                                 <img
//                                   src={item.imgUrl}
//                                   alt={item.name}
//                                   className="w-12 h-12 object-cover rounded-md border"
//                                 />
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </div>
//           </div>
//         ))
//       )}

//       {/* Floating Save Button */}
//       <div className="fixed bottom-20 right-6 z-50">
//         <button
//           onClick={updateAllStatuses}
//           disabled={isUpdating}
//           className={`w-40 h-12 font-semibold rounded-full flex items-center justify-center shadow-lg transition duration-200 ${
//             isUpdating 
//               ? 'bg-gray-400 cursor-not-allowed' 
//               : 'bg-green-600 hover:bg-green-700 active:scale-95'
//           } text-white`}
//           aria-label="Save all order status changes"
//         >
//           {isUpdating ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//               Saving...
//             </>
//           ) : (
//             'Save All Changes'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
