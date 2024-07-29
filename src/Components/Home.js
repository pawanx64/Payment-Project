import React, { useState, useEffect } from 'react';
import LoginForm from './Login';
import SignUpForm from './SignUp';
import { auth, signOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-stripe-public-key');

export const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Reset state if user is not logged in
        setCoupon('');
        setAmount(0);
        setPaymentMethod('');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLoginClick = () => setShowLogin(true);
  const handleSignUpClick = () => setShowSignUp(true);
  const handleCloseForms = () => setShowLogin(false);
  const handleCloseForms2 = () => setShowSignUp(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset state on logout
      setCoupon('');
      setAmount(0);
      setPaymentMethod('');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleCouponApply = () => {
    if (coupon === 'edu24') {
      setAmount(100); // Set the amount for the coupon
    } else {
      alert('Invalid coupon code');
    }
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">EdTech Product</h1>
        <div>
          {user ? (
            <>
              <span className="mr-4">Logged in as: {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 flex-grow">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Empower Your Learning{' '}
            <span className="text-blue-600">With Our EdTech Solutions</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Join our community and unlock the potential within you. Learn at your own pace with our tailored courses.
          </p>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded">
            Get Started
          </button>
        </section>

        {/* Payment Section */}
        {user && (
          <section className="text-center bg-gray-100 p-4 md:p-8 rounded">
            <h3 className="text-2xl font-bold mb-4">Secure Your Spot</h3>
            <p className="text-gray-600 mb-4">
              Choose your payment method and enter any coupon codes you have.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center mb-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="p-2 border border-gray-300 rounded-l w-full md:w-1/2"
              />
              <button
                onClick={handleCouponApply}
                className="bg-blue-600 text-white px-6 py-2 rounded-r w-full md:w-auto mt-2 md:mt-0 md:ml-2"
              >
                Apply Coupon
              </button>
            </div>

            {amount > 0 && (
              <div>
                <h4 className="text-xl font-bold mb-4">Amount: ${amount}</h4>
                <button
                  onClick={() => handlePayment('paypal')}
                  className="bg-blue-600 text-white px-6 py-2 rounded w-full md:w-auto mt-2"
                >
                  Pay with PayPal
                </button>
                <button
                  onClick={() => handlePayment('stripe')}
                  className="bg-green-600 text-white px-6 py-2 rounded w-full md:w-auto mt-2"
                >
                  Pay with Stripe
                </button>
              </div>
            )}
          </section>
        )}

        {/* Conditional Rendering for Payment Gateways */}
        {paymentMethod === 'paypal' && (
          <section className="p-4">
            <PayPalScriptProvider options={{ 'client-id': 'your-paypal-client-id' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: amount,
                      },
                    }],
                  });
                }}
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  alert('Payment successful');
                }}
                onError={(err) => {
                  alert('Payment failed: ' + err.message);
                }}
              />
            </PayPalScriptProvider>
          </section>
        )}

        {paymentMethod === 'stripe' && (
          <section className="p-4">
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} />
            </Elements>
          </section>
        )}
      </main>

      {/* Conditional Rendering of Login and Sign-Up Forms */}
      {showLogin && <LoginForm onClose={handleCloseForms} />}
      {showSignUp && <SignUpForm onClose={handleCloseForms2} />}
    </div>
  );
};

// Example Stripe Checkout Form Component
const CheckoutForm = ({ amount }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await stripePromise.redirectToCheckout({
      lineItems: [{ price: 'your-stripe-price-id', quantity: 1 }],
      mode: 'payment',
      successUrl: window.location.origin,
      cancelUrl: window.location.origin,
    });

    if (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <h4 className="text-xl font-bold mb-4">Amount: ${amount}</h4>
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Pay with Stripe
      </button>
    </form>
  );
};
