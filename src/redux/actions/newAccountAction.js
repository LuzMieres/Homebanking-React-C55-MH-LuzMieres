// src/redux/actions/newAccountAction.js
import axios from 'axios';
import { loadCurrentUserAction } from './loadCurrentUserAction';

// Acción para crear una nueva cuenta
export const newAccountAction = (accountType) => async (dispatch) => {
  try {
    // Realizar la solicitud POST para crear una nueva cuenta
    await axios.post('http://localhost:8080/api/clients/current/accounts', { type: accountType }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Incluir el token en el encabezado para la autenticación
      }
    });

    // Despachar la acción para cargar nuevamente los datos del cliente y reflejar la nueva cuenta
    dispatch(loadCurrentUserAction());
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};
