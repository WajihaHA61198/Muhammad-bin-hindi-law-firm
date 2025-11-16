// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getServices, getServiceBySlug } from '@/lib/strapi';

// export const fetchServices = createAsyncThunk(
//   'services/fetchServices',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await getServices();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchServiceBySlug = createAsyncThunk(
//   'services/fetchServiceBySlug',
//   async (slug, { rejectWithValue }) => {
//     try {
//       const data = await getServiceBySlug(slug);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const servicesSlice = createSlice({
//   name: 'services',
//   initialState: {
//     items: [],
//     currentService: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearCurrentService: (state) => {
//       state.currentService = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchServices.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchServices.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchServices.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchServiceBySlug.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchServiceBySlug.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentService = action.payload;
//       })
//       .addCase(fetchServiceBySlug.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearCurrentService } = servicesSlice.actions;
// export default servicesSlice.reducer;
