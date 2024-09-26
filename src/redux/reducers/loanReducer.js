import { createReducer } from "@reduxjs/toolkit";
import { requestNewLoanAction, loadClientLoans } from '../actions/loanActions';
import { loadCurrentUserAction } from '../actions/loadCurrentUserAction';

const initialState = {
  loans: [], // Lista de préstamos del cliente
  status: "idle",
  error: null,
};

const loanReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requestNewLoanAction.pending, (state) => {
      state.status = "loading";
    })
    .addCase(requestNewLoanAction.fulfilled, (state, action) => {
      console.log("Nuevo préstamo creado:", action.payload);
      // Asegúrate de que los datos del préstamo estén correctos en la respuesta
      const newLoan = action.payload;
      state.loans.push(newLoan); // Agrega el nuevo préstamo a la lista de préstamos
      state.status = "succeeded"; 
    })
    .addCase(requestNewLoanAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload; // Maneja los errores
    })
    .addCase(loadClientLoans.pending, (state) => {
      state.status = "loading";
    })
    .addCase(loadClientLoans.fulfilled, (state, action) => {
      state.loans = action.payload; // Actualiza la lista de préstamos del cliente
      state.status = "succeeded";
    })
    .addCase(loadClientLoans.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
      // Cuando se carga el cliente, actualiza la lista de préstamos
      state.loans = action.payload.loans;
    });
});


export default loanReducer;
