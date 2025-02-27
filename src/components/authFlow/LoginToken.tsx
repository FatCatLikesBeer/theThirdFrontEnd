import { useEffect, useState, useContext } from "react";
import { z } from "zod";

import AuthModalContext from "../../context/AuthModalContext";
import AuthContext from "../../context/AuthContext";

const tokenSchema = z.string().length(6);
const apiURL = String(import.meta.env.VITE_API_URL) + "/api/auth";

/**
 * LoginToken
 * @description confirms email & token, sets auth to app and local storage
 */
export default function LoginToken({ email }: { email: string }) {
  const { setAuth } = useContext(AuthContext);
  const modalRef = useContext(AuthModalContext) as React.RefObject<HTMLDialogElement>;
  const [authFormError, setAuthFormError] = useState<string>("Invalid Token");
  const [token, setToken] = useState("");
  const [emailInputHasBeenFocused, setEmailInputHasBeenFocused] = useState(false);
  const [submitHasBeenClicked, setSubmitHasBeenClicked] = useState(false);
  const tokenValidation = tokenSchema.safeParse(token);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setToken(e.target.value);
  }

  async function handleClick() {
    setSubmitHasBeenClicked(true);
    const formattedURL = apiURLFormatter(email, token);
    fetch(formattedURL, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setAuthFormError("Server error 😩");
        }
      })
      .then((json) => {
        console.log(json);
        setAuth(json);
        localStorage.setItem("uuid", json.data.uuid);
        modalRef.current.close();
      });
  }

  useEffect(() => {
    function handleModalClose() { setToken("") }

    modalRef?.current?.addEventListener("close", handleModalClose);
    return (() => {
      modalRef?.current?.removeEventListener("close", handleModalClose);
    });
  }, []);

  return (
    <div className="auth-login-signup-container">
      <h3 className="auth-form-title">Login Token</h3>
      <p className="auth-form-description">Please check your email.</p>
      <p className="auth-form-label">Token:</p>
      <input
        type="text"
        className="auth-form-input"
        value={token}
        placeholder="123455"
        onChange={handleChange}
        onBlur={() => { setEmailInputHasBeenFocused(true) }}
        onFocus={() => { setEmailInputHasBeenFocused(false) }}
      />
      {emailInputHasBeenFocused && !tokenValidation.success
        ?
        <p className="auth-form-label auth-form-error">{authFormError}</p>
        :
        <p className="auth-form-label auth-form-error"></p>
      }
      <button
        className="create-post-submit-button"
        type="button"
        disabled={!tokenValidation.success}
        onClick={handleClick}>{
          submitHasBeenClicked
            ?
            <div className="spinner" />
            :
            "Submit"
        }</button>
    </div>
  );
}

/**
  * apiURLFormatter
  * @argument {string} token - email to send to API
  */
function apiURLFormatter(email: string, token: string): string {
  const param = `?email=${email}&totp=${token}`
  return encodeURI(`${apiURL}${param}`);
}


