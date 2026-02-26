import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await productsAPI.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await productsAPI.getOne(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
  }
});

export const fetchMyProducts = createAsyncThunk('products/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await productsAPI.getMy();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await productsAPI.create(formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await productsAPI.update(id, formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productsAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    current: null,
    myProducts: [],
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
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.list = payload;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, { payload }) => {
        state.current = payload;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, { payload }) => {
        state.myProducts = payload;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.myProducts = [payload, ...state.myProducts];
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.myProducts = state.myProducts.map((p) => (p._id === payload._id ? payload : p));
        state.current = payload;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.myProducts = state.myProducts.filter((p) => p._id !== payload);
        if (state.current?._id === payload) state.current = null;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.startsWith('products/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => { state.loading = false; }
      )
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/rejected'),
        (state, { payload }) => { state.error = payload; }
      );
  },
});

export const { clearCurrent } = productsSlice.actions;
export default productsSlice.reducer;
