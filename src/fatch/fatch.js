import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchData = createAsyncThunk(
    "/data/fetchData", 
    async ({ method, endpoint, data = null, headers = {} }, { rejectWithValue }) => {
        try {
            let response;
            switch (method) {
                case "GET":
                    response = await axios.get(endpoint, { headers });
                    break;
                case "POST":
                    response = await axios.post(endpoint, data, { headers });
                    break;
                case "PUT":
                    response = await axios.put(endpoint, data, { headers });
                    break;
                case "DELETE":
                    response = await axios.delete(endpoint, { headers });
                    break;
                default:
                    throw new Error("Unsupported method");
            }
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
