import React from 'react'
import Stripe from 'stripe';
const STRIPE_API_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const stripe = Stripe(STRIPE_API_KEY )
const StripeBtn = () => {
    const handleStripe  = async ()=>{
        try {
            console.log("handle stripe")
       console.log(BACKEND_URL)
        const session = await fetch(`${BACKEND_URL}/stripe/checkout-session`  , {method : 'POST'})
        const res = await session.json()
        window.location.href = res.url 
        
       
        } catch (error) {
            console.log("error",error)
        }
        
    }
  return (
    <>
    <br />
    <button onClick={handleStripe} className="btn btn-primary">Check Stripe</button>
    </>
  )
}

export default StripeBtn