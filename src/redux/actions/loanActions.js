import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const requestNewLoanAction = createAsyncThunk(
    "loans/requestNewLoan",
    async ({ loanName, amount, payments, destinationAccountNumber }, { rejectWithValue }) => {  // Usar los nombres correctos
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token available");
      }
  
      try {
        // Confirmación de solicitud
        const result = await Swal.fire({
          title: 'Confirm Loan Request',
          text: `You are about to request a ${loanName} loan for $${amount} with ${payments} payments, using account: ${destinationAccountNumber}.`,
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
          loanName,  // Enviar como loanName
          amount,
          payments,
          destinationAccountNumber,  // Enviar como destinationAccountNumber
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // const response = await axios.post(" https://localhost:8080/api/loans/apply", {
        //   loanName,  // Enviar como loanName
        //   amount,
        //   payments,
        //   destinationAccountNumber,  // Enviar como destinationAccountNumber
        // }, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
       
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
  