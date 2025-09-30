import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const stripePromise = loadStripe('your-publishable-key-here');

const PaymentForm = ({ orderTotal, cartItems, pickupTime, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const functions = getFunctions();
      const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
      
      // Create payment intent
      const { data } = await createPaymentIntent({
        amount: orderTotal,
        currency: 'usd'
      });

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: auth.currentUser.displayName || 'Customer',
          },
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Payment successful - create order
        await createOrder(result.paymentIntent.id);
        onPaymentSuccess(result.paymentIntent.id);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (paymentIntentId) => {
    const orderData = {
      userId: auth.currentUser.uid,
      items: cartItems,
      total: orderTotal,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentIntentId: paymentIntentId,
      pickupTime: pickupTime,
      createdAt: new Date(),
      estimatedReadyTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    };

    const orderRef = await addDoc(collection(db, 'orders'), orderData);
    return orderRef.id;
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $R{orderTotal}`}
      </button>
    </form>
  );
};

const Payment = ({ orderTotal, cartItems, pickupTime, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        orderTotal={orderTotal}
        cartItems={cartItems}
        pickupTime={pickupTime}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
};

export default Payment;