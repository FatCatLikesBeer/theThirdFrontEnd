import { z } from "zod";
import { useState, useEffect, useContext } from "react";

import AuthContext from "../../context/AuthContext";
import AuthModalContext from "../../context/AuthModalContext";
import ToastContext from "../../context/ToastContext";

import apiURLFetcher from "../../library/apiURL";

const emailSchema = z.string().email();
const apiURL = apiURLFetcher() + "/api/auth";
const guestAPI = apiURLFetcher() + "/api/guest";

/**
 * AuthEmailInput
 */
export default function AuthEmailInput(
  {
    setIsUser, setUserEmail
  }: {
    setIsUser: React.Dispatch<React.SetStateAction<boolean | null>>;
    setUserEmail: React.Dispatch<React.SetStateAction<string | null>>
  }
) {
  const modalRef = useContext(AuthModalContext) as React.RefObject<HTMLDialogElement>;
  const [authFormError, setAuthFormError] = useState<string>("Invalid Email");
  const [email, setEmail] = useState<string>("");
  const [emailInputHasBeenFocused, setEmailInputHasBeenFocused] = useState(false);
  const [submitHasBeenClicked, setSubmitHasBeenClicked] = useState(false);
  const emailValidation = emailSchema.safeParse(email);
  const toast = useContext(ToastContext);
  const { setUUID } = useContext(AuthContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  async function handleClick() {
    setSubmitHasBeenClicked(true);
    const formattedURL = apiURLFormatter(email);
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
        const isUser = json.data.isUser;
        const message = json.data.message;
        setIsUser(isUser);
        setUserEmail(email);
        setAuthFormError(message);
      });
  }

  useEffect(() => {
    function handleModalClose() { setEmail("") }
    modalRef?.current?.addEventListener("close", handleModalClose);
    return (() => {
      modalRef?.current?.removeEventListener("close", handleModalClose);
    });
  }, []);

  async function signUpAsGuest() {
    try {
      const r = await fetch(guestAPI, { credentials: "include" });
      const j: APIResponse<{ uuid: string }> = await r.json();
      if (!r.ok) { throw new Error("Guest Signup Request Error") }
      if (!j.success) { throw new Error(j.message) }

      if (j.data != undefined) {
        setUUID(j.data.uuid);
        localStorage.setItem("uuid", j.data.uuid);
      }
      setEmail("");
      modalRef.current.close();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast?.current?.showToast(err.message, false);
      }
    }
  }

  return (
    <div className="auth-login-signup-container">
      <h3 className="auth-form-title">Login or Signup</h3>
      <p className="auth-form-label">Email:</p>
      <input
        type="text"
        className="auth-form-input"
        value={email}
        placeholder="example@email.com"
        onChange={handleChange}
        onBlur={() => { setEmailInputHasBeenFocused(true) }}
        onFocus={() => { setEmailInputHasBeenFocused(false) }}
      />
      {emailInputHasBeenFocused && !emailValidation.success
        ?
        <p className="auth-form-label auth-form-error">{authFormError}</p>
        :
        <p className="auth-form-label auth-form-error"></p>
      }
      <button
        className="create-post-submit-button"
        type="button"
        disabled={!emailValidation.success}
        onClick={handleClick}>{
          submitHasBeenClicked
            ?
            <div className="spinner" />
            :
            "Submit"
        }</button>
      <button
        className="create-post-submit-button"
        type="button"
        onClick={signUpAsGuest}
      >
        Try as Guest
      </button>
    </div>
  );
}

/**
  * apiURLFormatter
  * @argument {string} email - email to send to API
  */
function apiURLFormatter(email: string): string {
  const param = `?email=${email}`
  return encodeURI(`${apiURL}${param}`);
}
