import React, { useState, useEffect } from 'react';
import { Image, Pencil, User } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function MyProfile() {
  const { userData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName,setFullName] = useState("")
  const [emailId,setEmailId] = useState("")
  const [gender,setGender] = useState("")

  const location  = useLocation()


  // Simulate data fetching with useEffect
  useEffect(() => {
    // If userData is available immediately from context
   
    setTimeout(()=>{
        
        const fname = localStorage.getItem("FullName")
        const mailId = localStorage.getItem("EmailId")
        const gend = localStorage.getItem("Gender")
        setFullName(fname)
        setEmailId(mailId)
        setGender(gend)


        setIsLoading(false);

    },3000)

  }, [userData]); // Re-run effect when userData changes

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("EmailId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`)
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location.pathname]);
  

  
  // Show loading while data is being fetched
  if (isLoading || !fullName ) {
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
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
    
    {/* Profile Section */}
    <div className="flex flex-col items-center text-center mb-8">
      <div className="flex justify-center items-center mb-4">
        <User size={60} className="text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{fullName}</h2>
      <p className="text-gray-600 text-sm mt-1"><span className="font-semibold">Email:</span> {emailId}</p>
      <p className="text-gray-600 text-sm"><span className="font-semibold">Gender:</span> {gender}</p>
      <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition-shadow hover:shadow-lg">
        Edit Profile
      </button>
    </div>

    {/* Orders Section */}
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={order._id} className="border rounded-lg shadow-sm p-4 mb-6 bg-gray-50 hover:shadow-md transition">
            <div className="mb-2">
              <p className="text-lg font-semibold text-red-600">Order #{idx + 1}</p>
              <p className="text-sm text-gray-700">Order ID: <span className="text-gray-600">{order._id}</span></p>
              <p className="text-sm text-gray-700">Ordered on: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
              <p className="text-sm text-gray-700">Status: <span className="capitalize text-blue-600">{order.status}</span></p>
              <p className="text-sm font-bold text-gray-700">Restaurant: <span className="text-gray-600">{order.canteenName}</span></p>
              <p className="text-sm text-gray-800 mt-1 font-medium">Total: ₹{order.totalAmount}</p>
            </div>
            
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
        ))
      )}
    </div>
  </div>
</div>

  );
}
