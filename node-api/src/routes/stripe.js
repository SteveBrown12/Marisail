import { Router } from "express";
import stripe from "stripe"
import dotenv from "dotenv";
dotenv.config();
const stripeRouter = Router();

stripeRouter.post("/checkout-session", async (req, res) => {
try {
    
 console.log("in")
  if(!process.env.STRIPE_TEST_KEY){
    throw Error("No Stripe API Key")
  }  
 const session = await stripe(process.env.STRIPE_TEST_KEY).checkout.sessions.create({
   line_items : [{
     price_data : {
      currency : 'usd',
      product_data : {
        name : 'Test Product'
      },
      unit_amount : 1000
     },
     quantity : 1
   }], 
    payment_method_types:["card"],
    mode : 'payment',
    success_url : 'http://localhost:5173/payment-success',
    cancel_url :'http://localhost:5173/payment-error',

 })
 console.log(session)
  // return res.send({ clientSecret : session.id})
  // res.json(session)
  res.send({url : session.url})
} 
  catch (err) {
    return res.json({error : err})
  }
});
export default stripeRouter;
