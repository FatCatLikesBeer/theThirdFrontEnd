import { useState, useContext } from "react";
import { z } from "zod";

import AuthModalContext from "../../context/AuthModalContext";
import AuthContext from "../../context/AuthContext";

const apiURL = String(import.meta.env.VITE_API_URL) + "/api/auth";

const tokenSchema = z.string().length(6);

/**
 * SignUpToken
 * @description confirms email & token for signup,
 * set auth for app and local storage
 */
export default function SignupToken({ email }: { email: string }) {
  const { setUUID } = useContext(AuthContext);
  const [confirmHasBeenClicked, setConfirmHasBeenClicked] = useState<boolean>(false);
  const [disableConfirmButton, setDisableConfirmButton] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [tokenInputHasBeenFocused, setTokenInputHasBeenFocused] = useState<boolean>(false);
  const tokenValidation = tokenSchema.safeParse(token);
  const [authFormError, setAuthFormError] = useState("Invalid Token");
  const [forceError, setForceError] = useState(false);
  const modalRef = useContext(AuthModalContext);

  function handleConfirmButton() {
    setConfirmHasBeenClicked(true);
    setTimeout(() => {
      setConfirmHasBeenClicked(false);
      setDisableConfirmButton(true);
    }, 2000);
    const apiURL = apiURLFormatter(email, token);
    const method = "GET";
    fetch(apiURL, { method: method, credentials: "include" })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong 😩");
        }
      })
      .then(json => {
        if (json.success) {
          localStorage.setItem("uuid", json.data.uuid);
          setUUID(json.data.uuid);
          window.location.href = "/settings";
        } else {
          throw new Error(json.message);
        }
      })
      .catch((err) => {
        setForceError(true);
        setAuthFormError(err.message);
        setConfirmHasBeenClicked(false);
        setDisableConfirmButton(true);
      })
      .finally(() => {
        setTimeout(() => {
          modalRef?.current?.close();
        });
      });
    ;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { setToken(e.target.value) }

  return (
    <>
      <h3 className="auth-form-title">Signup Token</h3>
      <p className="auth-form-description">Please check your email for a registration token.</p>
      <p className="auth-form-label">Token:</p>
      <input
        type="text"
        className="auth-form-input"
        value={token}
        placeholder="123456"
        onChange={handleChange}
        onBlur={() => { setTokenInputHasBeenFocused(true) }}
        onFocus={() => { setTokenInputHasBeenFocused(false) }}
      />
      {(tokenInputHasBeenFocused && !tokenValidation.success) || forceError
        ?
        <p className="auth-form-label auth-form-error">{authFormError}</p>
        :
        <p className="auth-form-label auth-form-error"></p>
      }
      <button
        className="create-post-submit-button"
        type="button"
        disabled={!tokenValidation.success || disableConfirmButton}
        onClick={handleConfirmButton}>{
          confirmHasBeenClicked
            ?
            <div className="spinner" />
            :
            "Confirm"
        }</button>
    </>
  );
}

/**
  * apiURLFormatter
  * @argument {string} email - email to send to API
  * @argument {string} token - token to send to API
  */
function apiURLFormatter(email: string, token: string): string {
  const param = `/confirm?email=${email}&totp=${token}`;
  return encodeURI(`${apiURL}${param}`);
}
