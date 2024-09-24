import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newAccountAction } from "../redux/actions/newAccountAction";
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content"; // Para integrar React con SweetAlert2

const MySwal = withReactContent(Swal); // Crear una instancia de SweetAlert con soporte para React

function NewAccountForm() {
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountType) {
      setError("Please select an account type.");
      return;
    }

    // Mostrar el SweetAlert con la confirmación de la solicitud
    MySwal.fire({
      title: "Confirm Account Request",
      text: `You are about to create a new ${accountType}. Do you want to proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, se despacha la acción para crear la cuenta
        dispatch(newAccountAction(accountType))
          .then(() => {
            // Mostrar mensaje de éxito y redirigir a /accounts
            MySwal.fire("Success", "Account created successfully!", "success");
            navigate("/accounts");
          })
          .catch((err) => {
            // Mostrar mensaje de error si la creación de la cuenta falla
            MySwal.fire("Error", "Failed to create account. Please try again.", "error");
          });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white rounded shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Request New Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          >
            <option value="" disabled>
              Select an account type
            </option>
            <option value="Checking">Checking Account</option>
            <option value="Savings">Savings Account</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Request Account
        </button>
      </form>
    </div>
  );
}

export default NewAccountForm;
