import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchCreateOrder = createAsyncThunk(
  "/order/fetchCreate",
  async (params) => {
    const { data } = await axios.post("/order/creare", params);
    return data;
  }
);

export const fetchUpdateOrder = createAsyncThunk(
  "/order/fetchUpdate",
  async (params) => {
    const { data } = await axios.patch("/order/update", params);
    console.log(params, data);
    return data;
  }
);

export const fetchGetOneOrder = createAsyncThunk(
  "/order/getOne",
  async (id) => {
    const { data } = await axios.get(`/order/get/${id}`);
    return data;
  }
);

export const fetchGetAllOrders = createAsyncThunk("/order/getAll", async () => {
  const { data } = await axios.get("/order/getAll");
  return data;
});

const initialState = {
  data: null,
  status: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* REGISTER */
    builder
      .addCase(fetchCreateOrder.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchCreateOrder.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchCreateOrder.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* LOGIN */
      .addCase(fetchUpdateOrder.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchUpdateOrder.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchUpdateOrder.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* AUTHME */
      .addCase(fetchGetOneOrder.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetOneOrder.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetOneOrder.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET ALL */
      .addCase(fetchGetAllOrders.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetAllOrders.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetAllOrders.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const orderReducer = authSlice.reducer;

export const isLoading = (state) => state.auth.status;
