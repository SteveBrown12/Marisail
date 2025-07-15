import { Router } from "express";
import homeRouter from "./routes/home.js";
import advertBerthRouter from "./routes/Berth_Advert.js";
import advertEngineRouter from "./routes/Engine_Advert.js";
import advertTrailerRouter from "./routes/Trailer_Advert.js";
import searchEngineRouter from "./routes/Engine_Search.js";
import searchTrailerRouter from "./routes/Trailer_Search.js";
import searchBerthRouter from "./routes/Berth_Search.js";
import searchCharterRouter from "./routes/Charter_Search.js";
import searchTransportRouter from "./routes/Transport_Search.js";
import advertCharterRouter from "./routes/Charter_Advert.js";
import advertTransportRouter from "./routes/Transport_Advert.js";
import handler from "./routes/upload-media.js";
import authRouter from "./routes/auth.js";
import genericSearchRouter from "./routes/Generic_Search.js";
import genericAdvertRouter from "./routes/Generic_Advert.js";

const router = Router();

// Use the homeRouter for requests to /api/home
router.use("/home", homeRouter);

// auth router
router.use("/auth", authRouter);

router.use("/advert_berth", advertBerthRouter);

router.use("/advert_engine", advertEngineRouter);

router.use("/trailers", advertTrailerRouter);

router.use("/search_engine", searchEngineRouter);

router.use("/search_trailer", searchTrailerRouter);

router.use("/search_berth", searchBerthRouter);

router.use("/search_charter", searchCharterRouter);

router.use("/search_transport", searchTransportRouter);

router.use("/advert_charter", advertCharterRouter);

router.use("/advert_transport", advertTransportRouter);

router.use("/upload-media", handler); // upload-media upload

router.use("/generic_search", genericSearchRouter);
router.use("/generic_advert", genericAdvertRouter);

// Export the router
export default router;
