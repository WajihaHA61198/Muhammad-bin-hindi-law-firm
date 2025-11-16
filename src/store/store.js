import { configureStore } from "@reduxjs/toolkit";
// import navigationReducer from './slices/navigationSlice';
// import heroReducer from './slices/heroSlice';
// import teamReducer from './slices/teamSlice';
// import testimonialsReducer from './slices/testimonialsSlice';
import servicesReducer from "./servicesSlice"; // ADD THIS

export const store = configureStore({
  reducer: {
    // navigation: navigationReducer,
    // hero: heroReducer,
    // team: teamReducer,
    // testimonials: testimonialsReducer,
    services: servicesReducer, // ADD THIS
  },
});

export default store;
