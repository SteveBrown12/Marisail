

import { Router } from "express";
import homeRouter from "./routes/home.js";

import handler from "./routes/upload-media.js";



import search_router from "./routes/Generic_Search.js"; 
import advert_router from "./routes/Generic_Advert.js"; 
import sponsor_router from "./routes/Sponsor.js";
import authRouter from "./routes/auth.js";

const router = Router();

// Use the homeRouter for requests to /api/home

router.use("/home", homeRouter);

// auth router

router.use("/auth", authRouter);


router.use("/search", search_router); 
router.use("/advert", advert_router); 


router.use("/upload-media", handler);

router.use("/sponsor", sponsor_router);

export default router;
