


// import React, { useState, useEffect } from 'react';
// import { User } from 'lucide-react';
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
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`);
//         console.log(res.data);
//         setOrders(res.data);
        
//         // Initialize editedStatuses with current order statuses
//         const initialStatuses = {};
//         res.data.forEach(user => {
//           user.orders.forEach(order => {
//             initialStatuses[order._id] = order.status;
//           });
//         });
//         setEditedStatuses(initialStatuses);
//       } catch (err) {
//         console.error("Failed to fetch orders:", err);
//         alert("Failed to fetch orders. Please try again.");
//       }
//     };
//     fetchOrders();
//   }, [location.pathname]);

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
//             fullName:user.fullName,
//             email:user.username,
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
//       const updatePromises = updates.map(({ fullName,email,orderId, newStatus }) =>

       
//         axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
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

//   return (
//    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel - Order Management</h2>

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
import { User, Lock, Eye, EyeOff } from 'lucide-react';
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

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setPassword(""); // Clear password from state for security
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
  };

  const handleStatusChange = (orderId, newStatus) => {
    setEditedStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const updateAllStatuses = async () => {
    // Find all orders that have been changed
    const updates = [];
    
    orders.forEach(user => {
      user.orders.forEach(order => {
        if (editedStatuses[order._id] && editedStatuses[order._id] !== order.status) {
          updates.push({
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
      // Update each order status
      const updatePromises = updates.map(({ fullName, email, orderId, newStatus }) =>
        axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
          fullName:fullName,
          email:email,
          orderId:orderId,
          status: newStatus
        })
      );

      await Promise.all(updatePromises);

      // Update local state to reflect changes
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
      
      // Revert editedStatuses to original values on error
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

  // Main admin panel (only shown after authentication)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Admin Panel - Order Management</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No orders found.</p>
        </div>
      ) : (
        orders.map((user, index) => (
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders ({user.orders.length})</h2>

              {user.orders.length === 0 ? (
                <p className="text-gray-500 text-center">No orders found for this user.</p>
              ) : (
                <>
                  {user.orders.map((order, idx) => (
                    <div key={order._id || idx} className="border rounded-lg shadow-sm p-4 mb-6 bg-gray-50 hover:shadow-md transition">
                      <p className="text-lg font-semibold text-red-600">Order #{idx + 1}</p>
                      <p className="text-sm text-gray-700">Order ID: <span className="text-gray-600 font-mono">{order._id}</span></p>
                      <p className="text-sm text-gray-700">Ordered on: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
                      <p className="text-sm text-gray-700">
                        Current Status: 
                        <span className={`capitalize ml-1 px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-800 mt-1 font-medium">Total: ₹{order.totalAmount}</p>

                      {/* Status Dropdown */}
                      <div className="mt-3">
                        <label className="text-sm font-medium text-gray-700 mr-2">Change Status:</label>
                        <select
                          value={editedStatuses[order._id] || order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-2 rounded border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          disabled={isUpdating}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {editedStatuses[order._id] !== order.status && (
                          <span className="ml-2 text-xs text-orange-600 font-medium">
                            * Modified
                          </span>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Items:</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex items-center justify-between text-sm bg-white p-3 rounded shadow">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                                <p className="text-gray-600 text-xs font-medium">Subtotal: ₹{item.quantity * item.price}</p>
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
        ))
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={updateAllStatuses}
          disabled={isUpdating}
          className={`w-40 h-12 font-semibold rounded-full flex items-center justify-center shadow-lg transition duration-200 ${
            isUpdating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 active:scale-95'
          } text-white`}
          aria-label="Save all order status changes"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </button>
      </div>
    </div>
  );
}
