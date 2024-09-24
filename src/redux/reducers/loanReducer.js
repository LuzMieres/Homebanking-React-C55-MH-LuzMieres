import { createReducer } from "@reduxjs/toolkit";
import { requestNewLoanAction } from '../actions/loanActions';

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
      state.loans.push(action.payload); // Agrega el nuevo préstamo a la lista de préstamos
      state.status = "success";
    })
    .addCase(requestNewLoanAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload; // Maneja los errores
    });
});

export default loanReducer;
