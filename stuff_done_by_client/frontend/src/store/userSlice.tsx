import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: string | number | null;
  name: string | null;
  email: string | null;
  isLoggedIn: string | null;
  userid: string | null;
  role: string | null;
  authModalOpen: boolean;
  authModalView: "login" | "register";
}

const initialState: UserState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  tokenExpiry: localStorage.getItem("tokenExpiry") || 0,
  name: localStorage.getItem("name") || null,
  email: localStorage.getItem("email") || null,
  isLoggedIn: localStorage.getItem("isLoggedIn") || null,
  userid: localStorage.getItem("userid") || null,
  role: localStorage.getItem("role") || "guest", // Default to guest
  authModalOpen: false,
  authModalView: "login",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
      if (action.payload) localStorage.setItem("role", action.payload);
    },

    setIsLoggedIn: (state, action: PayloadAction<string | null>) => {
      state.isLoggedIn = action.payload;
      if (action.payload) localStorage.setItem("isLoggedIn", action.payload);
    },

    setAuthData: (state, action: PayloadAction<any>) => {
      const {
        accessToken,
        refreshToken,
        tokenExpiry,
        name,
        email,
        userid,
        role,
      } = action.payload;

      // Update State
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenExpiry = tokenExpiry;
      state.name = name;
      state.userid = userid;
      state.role = role;
      state.email = email;
      state.isLoggedIn = "true";

      // Sync LocalStorage
      localStorage.setItem("accessToken", accessToken || "");
      localStorage.setItem("refreshToken", refreshToken || "");
      localStorage.setItem("userid", userid || "");
      localStorage.setItem("role", role || "user");
      localStorage.setItem("tokenExpiry", tokenExpiry?.toString() || "");
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("isLoggedIn", "true");
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.name = null;
      state.email = null;
      state.userid = null;
      state.isLoggedIn = null;
      state.role = "guest";
      localStorage.clear();
    },

    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },

    setAuthModalView: (state, action: PayloadAction<"login" | "register">) => {
      state.authModalView = action.payload;
    },
    
    // Adding these back to ensure Navbar.tsx doesn't break
    setName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
      if (action.payload) localStorage.setItem("name", action.payload);
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
      if (action.payload) localStorage.setItem("email", action.payload);
    }
  },
});

// Explicitly exporting all actions required by App.tsx and Navbar.tsx
export const {
  setAuthData,
  setRole,
  logout,
  setIsLoggedIn,
  setAuthModalOpen,
  setAuthModalView,
  setName,
  setEmail
} = userSlice.actions;

export default userSlice.reducer;