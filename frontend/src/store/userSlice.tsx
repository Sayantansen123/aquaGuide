import { createSlice } from "@reduxjs/toolkit";
import { disconnectPrivateSocket } from "@/socket/privateInstance";
import { socket } from "@/socket/index";

const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    tokenExpiry: localStorage.getItem("tokenExpiry") || 0,
    name: localStorage.getItem("name") || null,
    email: localStorage.getItem("email") || null,
    isLoggedIn: localStorage.getItem("isLoggedIn") || null,
    userid: localStorage.getItem("userid") || null,
    role: localStorage.getItem("role") || "user",
    id: localStorage.getItem("id") || null,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
      localStorage.setItem("firstName", action.payload);
    },

    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },

    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
      localStorage.setItem("isLoggedIn", action.payload);
    },

    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem("email", action.payload);
    },

    setId: (state, action) => {
      state.id = action.payload;
      localStorage.setItem("id", action.payload);
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },
    setTokenExpiry: (state, action) => {
      state.tokenExpiry = action.payload;
      localStorage.setItem("tokenExpiry", action.payload);
    },

    setAuthData: (state, action) => {
      const {
        accessToken,
        refreshToken,
        tokenExpiry,
        name,
        email,
        userid,
        role,
        id,
      } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenExpiry = tokenExpiry;
      state.name = name;
      state.userid = userid;
      state.role = role;
      state.email = email;
      state.id = id;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userid", userid);
      localStorage.setItem("role", role);

      localStorage.setItem("tokenExpiry", tokenExpiry);
      localStorage.setItem("name", name);
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("email", email);
      localStorage.setItem("id", id);
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.name = null;
      state.email = null;
      state.userid = null;
      state.isLoggedIn = null;
      state.role = null;
      state.id = null;
      localStorage.clear();
      
      // Disconnect sockets on logout
      disconnectPrivateSocket();
      if (socket.connected) {
        socket.disconnect();
      }
    },
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setTokenExpiry,
  setAuthData,
  setRole,
  logout,
  setIsLoggedIn,
  setId,
} = userSlice.actions;

export default userSlice.reducer;
