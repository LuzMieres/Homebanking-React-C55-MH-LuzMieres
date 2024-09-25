// passwordActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const changePasswordAction = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      const response = await axios.post(
        "https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/auth/current/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    // try {
    //   const response = await axios.post(
    //     "https://localhost:8080/api/auth/current/change-password",
    //     { currentPassword, newPassword },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
      
      return response.data; // Mensaje de éxito
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      return rejectWithValue(
        error.response ? error.response.data : "Unknown error"
      );
    }
  }
);