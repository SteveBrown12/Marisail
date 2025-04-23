import React from 'react'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StripeBtn = () => {
    const handleStripe  = async ()=>{
        try {
            console.log("handle stripe")
      
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