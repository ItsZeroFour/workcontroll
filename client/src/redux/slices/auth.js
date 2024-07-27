import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchRegister = createAsyncThunk(
  "/auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/user/register", params);
    return data;
  }
);

export const fetchLogin = createAsyncThunk(
  "/auth/fetchLogin",
  async (params) => {
    const { data } = await axios.post("/user/login", params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk("/auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/user/me");
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
      .addCase(fetchRegister.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchRegister.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* LOGIN */
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* AUTHME */
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const authReducer = authSlice.reducer;

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const isLoading = (state) => state.auth.status;

export const { logout } = authSlice.actions;