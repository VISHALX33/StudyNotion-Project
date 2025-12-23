import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { studentEndpoints } from "../services/apis";
import { resetCart } from "../redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { FiShoppingCart, FiCreditCard } from "react-icons/fi";

const Checkout = () => {
  const { cart, total } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Get course IDs
      const courses = cart.map((course) => course._id);

      // Initiate payment
      console.log("Initiating payment for courses:", courses);
      const orderResponse = await apiConnector(
        "POST",
        studentEndpoints.COURSE_PAYMENT_API,
        { courses },
        { Authorization: `Bearer ${token}` }
      );

      console.log("Order response:", orderResponse);
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.data.amount,
        currency: orderResponse.data.data.currency,
        name: "StudyNotion",
        description: "Course Purchase",
        order_id: orderResponse.data.data.id,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await apiConnector(
              "POST",
              studentEndpoints.COURSE_VERIFY_API,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courses,
              },
              { Authorization: `Bearer ${token}` }
            );

            if (!verifyResponse.data.success) {
              throw new Error(verifyResponse.data.message);
            }

            // Send success email
            await apiConnector(
              "POST",
              studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API,
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: orderResponse.data.data.amount,
              },
              { Authorization: `Bearer ${token}` }
            );

            toast.success("Payment Successful! Courses enrolled.");
            dispatch(resetCart());
            navigate("/dashboard/enrolled-courses");
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: "#f97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Could not initiate payment";
      toast.error(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg border border-dark-200 p-12 text-center">
            <FiShoppingCart className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-700 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/catalog")}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border text-black border-dark-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cart.map((course) => (
                    <div key={course._id} className="flex gap-4 pb-4 border-b border-dark-200">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{course.courseName}</h3>
                        <p className="text-sm text-black">
                          By {course.instructor?.firstName} {course.instructor?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">₹{course.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border text-black border-dark-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-black mb-4">Payment Details</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-black">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t border-dark-200 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-lg font-bold text-black">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold disabled:opacity-50"
                >
                  <FiCreditCard />
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>

                <p className="text-xs text-black text-center mt-4">
                  By completing your purchase, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
