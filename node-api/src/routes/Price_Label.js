import { Router } from 'express';
import {
  calculate_Price_Label,
  handle_Error_Response,
} from '../utils/Common_Utils.js';

const price_Check_Router = Router();

price_Check_Router.post('/:service_name', async (req, res) => {
  try {
    res.json({ ok: true, label: await calculate_Price_Label(req.body) });
  } catch (error) {
    handle_Error_Response(res, `Price check failed: ${error.message}`);
  }
});

export default price_Check_Router;
