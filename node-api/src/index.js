

import { Router } from "express";
import homeRouter from "./routes/home.js";

import handler from "./routes/upload-media.js";


import search_router from "./routes/Generic_Search.js";
import advert_router from "./routes/Generic_Advert.js";
import sponsor_router from "./routes/Sponsor.js";
import transport_Router from "./routes/Transport_Specific.js";
import authRouter from "./routes/auth.js";
import emailTestRouter from "./routes/email-test.js";
import smsTestRouter from "./routes/sms-test.js";
import paymentRouter from "./routes/payment.js";
import exchangeRateRouter from "./routes/exchange-rate.js";

import price_Check_Router from "./routes/Price_Label.js";
import contact_router from "./routes/contact.js";

const router = Router();

// Use the homeRouter for requests to /api/home

router.use("/home", homeRouter);

// auth router

router.use("/auth", authRouter);

// email test routes (for development/testing)
router.use("/email-test", emailTestRouter);

// SMS test routes (for development/testing)
router.use("/sms-test", smsTestRouter);

router.use("/search", search_router);
router.use("/advert", advert_router);
router.use('/price-check', price_Check_Router)

router.use("/payment", paymentRouter);
router.use("/exchange-rate", exchangeRateRouter);

router.use("/upload-media", handler);
router.use("/transport", transport_Router);
router.use("/sponsor", sponsor_router);
router.use("/contact", contact_router);

export default router;
