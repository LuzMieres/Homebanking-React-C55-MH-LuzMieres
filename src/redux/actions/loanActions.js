import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

// Acción para solicitar un nuevo préstamo
export const requestNewLoanAction = createAsyncThunk(
  "loans/requestNewLoan",
  async ({ loanName, amount, payments, destinationAccountNumber }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      // Confirmación de solicitud
      const result = await Swal.fire({
        title: 'Confirm Loan Request',
        text: `You are about to request a ${loanName} loan for $${new Intl.NumberFormat('es-AR').format(amount)} with ${payments} payments, using account: ${destinationAccountNumber}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        return rejectWithValue("Loan request cancelled by user.");
      }

      // Solicitar el préstamo
      const response = await axios.post("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/loans/apply", {
        loanName,
        amount,
        payments,
        destinationAccountNumber, // Asegúrate de que este campo sea enviado correctamente
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data; // Devuelve los datos del préstamo creado
    } catch (error) {
      // Si el backend regresa un error, se captura aquí
      console.error("Error en la solicitud de préstamo:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "There was a problem with the request."
      );
    }
  }
);


// Acción para cargar los préstamos del cliente
export const loadClientLoans = createAsyncThunk(
  "loans/loadClientLoans",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      const response = await axios.get("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/loans/client-loans", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Datos de los préstamos cargados:", response.data);
      return response.data; // Devuelve los préstamos del cliente
    } catch (error) {
      console.error("Error al cargar los préstamos del cliente:", error);
      return rejectWithValue(
        error.response ? error.response.data : "Unknown error"
      );
    }
  }
);
