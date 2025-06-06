
import axios from 'axios';
import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserCart } from '../redux/actions';
import { CheckCircle } from 'lucide-react';

function OrderDetails() {
  const navigate = useNavigate();
  const [orderPlaced,setOrderPlaced] = useState(false);

  const dispatch = useDispatch();

  const { userCart } = useSelector((state) => ({
    userCart: state.userCart,
  }))

  ;

  const itemTotal = userCart.reduce((sum, item) => sum + item.qty * item.Price, 0);

  // Static or dynamic charges
  const restaurantCharge = 7;
  const platformFee = 5;
  const packingFee = 4;

  const totalAmt = itemTotal + restaurantCharge + platformFee + packingFee;
const PlaceOrder = () => {
  const EmailId = localStorage.getItem("EmailId");
  const rawCart = userCart; // assuming this is an array of raw items from state

  // Add quantity and map to correct schema shape
  const items = rawCart.map(item => ({
    name: item.Name,           // match backend schema
    quantity: item.qty || 1, // set default quantity if not present
    price: item.Price,
    imgUrl: item.imgUrl
  }));


    const canteenName = sessionStorage.getItem('canteen')


  axios.post("https://cafebmscebackend.onrender.com/api/ConfirmOrderDetails",
    {cartData: items,email:EmailId,totalAmount:totalAmt,canteenName:canteenName}, {
    headers: { "Content-Type": "application/json" }
  })
    .then(res => {
      
      if (res.data.msg === "Order Confirmed") {
        setOrderPlaced(true)
        dispatch(setUserCart([]))
        setTimeout(() => navigate('/home'), 3000); // redirect after 4 seconds

      } else {
        alert("Didnt Place Your Order");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Order Failed");
    });
};

  const canteenName = sessionStorage.getItem('canteen')



  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">


      {orderPlaced && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
          <CheckCircle className="text-green-500 animate-bounce" size={100} />
          <h2 className="text-3xl font-bold mt-4 text-gray-800">Order Placed Successfully!</h2>
          <p className="text-gray-600 mt-2">Redirecting to homepage...</p>
        </div>
      )}


      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🧾 Order Summary</h2>
        <h2 className="text-xl font-normal mb-4 text-gray-800">  Restaurant:{canteenName}</h2>

        {userCart.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row justify-between items-center border-b py-4"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <img
                src={item.imgUrl}
                alt={item.Name}
                className="w-16 h-16 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="text-lg font-medium">{item.Name}</h3>
                <p className="text-sm text-gray-600">{item.Description}</p>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              <p className="text-base font-semibold text-gray-800">
                ₹{item.qty * item.Price}
              </p>
            </div>
          </div>
        ))}

        {/* Charges Breakdown */}
        <div className="mt-6 text-right text-gray-800 space-y-2 text-base sm:text-lg">
          <div className="flex justify-between">
            <span>Item Total</span>
            <span>₹{itemTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Restaurant Charges</span>
            <span>₹{restaurantCharge}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Packing Charges</span>
            <span>₹{packingFee}</span>
          </div>
          <div className="flex justify-between font-bold text-green-700 text-lg pt-2 border-t">
            <span>Total</span>
            <span>₹{totalAmt}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-6">
        <button
          onClick={() => navigate('/home')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition"
        >
          🏠 Back to Home
        </button>

        <button
          onClick={PlaceOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default OrderDetails;

