import { Router } from "express";
import homeRouter from "./routes/home.js";

import genericAdvertRouter from "./routes/generic_advert.js";
import genericSearchRouter from "./routes/generic_search.js"

import searchEngineRouter from "./routes/search_engine.js";
import searchTrailerRouter from "./routes/search_trailer.js";
import searchBerthRouter from "./routes/search_berth.js";
import searchShopRouter from "./routes/search_Shop.js";
import searchCharterRouter from "./routes/search_charter.js";
import searchTransportRouter from "./routes/search_transport.js";

const router = Router();

// Use the homeRouter for requests to /api/home
router.use("/home", homeRouter);

router.use("/advert_berth", genericAdvertRouter);

router.use("/advert_engine", genericAdvertRouter);

router.use("/trailers", genericAdvertRouter);

router.use("/advert_charter", genericAdvertRouter);

router.use("/advert_transport", genericAdvertRouter);

router.use("/advert_chandlery", genericAdvertRouter);

router.use("/advert_auction", genericAdvertRouter);

router.use("/search_engine", genericSearchRouter);

router.use("/search_trailer", searchTrailerRouter);

router.use("/search_berth", searchBerthRouter);

router.use("/search_Shop", searchShopRouter);

router.use("/search_charter", searchCharterRouter);

router.use("/search_transport", searchTransportRouter);

// Export the router
export default router;
