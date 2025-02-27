import { useState, useContext } from "react";

import AuthModalContext from "../../context/AuthModalContext";
import SignupToken from "./SignupToken";

const apiURL = String(import.meta.env.VITE_API_URL) + "/api/auth";

export default function SignupConfirmation({ email }: { email: string }) {
  const [disableConfirmButton, setDisableConfirmButton] = useState<boolean>(false);
  const [confirmHasBeenClicked, setConfirmHasBeenClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const modalRef = useContext(AuthModalContext);

  function handleConfirmation() {
    const apiURL = apiURLFormatter(email);
    setConfirmHasBeenClicked(true);
    const method = "POST";
    fetch(apiURL, { method: method })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          setError("Unknown error occoured 😩");
        }
      })
      .then(json => {
        if (json.success) {
          setConfirmation(true);
        } else {
          setConfirmHasBeenClicked(false);
          setError(json.message);
          setDisableConfirmButton(true);
        }
        console.log("Signup email confirmation", json);
      });
  }

  function handleCancel() {
    modalRef?.current.close();
  }

  return (
    <div className="auth-login-signup-container">
      {confirmation
        ?
        <SignupToken email={email} />
        :
        <>
          <h3 className="auth-form-title">Signup</h3>
          <p className="auth-form-text-content">Would you like to signup with the following email?</p>
          <div className="auth-form-email-display-container">
            <h3 className="auth-form-email-display">{email}</h3>
          </div>
          <p className="auth-form-label auth-form-error">{error}</p>
          <button
            disabled={disableConfirmButton}
            className="create-post-submit-button"
            type="button"
            onClick={handleConfirmation}>{
              confirmHasBeenClicked
                ?
                <div className="spinner" />
                :
                "Confirm"
            }</button>
          <div style={{ textAlign: "center" }}>
            <button className="auth-form-cancel-button" onClick={handleCancel}>CANCEL</button>
          </div>
        </>
      }
    </div>
  );
}

/**
  * apiURLFormatter
  * @argument {string} email - email to send to API
  */
function apiURLFormatter(email: string): string {
  const param = `?email=${email}`;
  return encodeURI(`${apiURL}${param}`);
}
