import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await ordersAPI.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await ordersAPI.getMy();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchSellerOrders = createAsyncThunk('orders/fetchSeller', async (_, { rejectWithValue }) => {
  try {
    const res = await ordersAPI.getSeller();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await ordersAPI.getOne(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await ordersAPI.updateStatus(id, status);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update order');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.current = payload;
        state.list = [payload, ...state.list];
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.list = payload;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, { payload }) => {
        state.list = payload;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, { payload }) => {
        state.current = payload;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        state.list = state.list.map((o) => (o._id === payload._id ? payload : o));
        state.current = payload;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('orders/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.startsWith('orders/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => { state.loading = false; }
      )
      .addMatcher(
        (action) => action.type.startsWith('orders/') && action.type.endsWith('/rejected'),
        (state, { payload }) => { state.error = payload; }
      );
  },
});

export const { clearCurrent } = ordersSlice.actions;
export default ordersSlice.reducer;
