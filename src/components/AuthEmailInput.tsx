import { z } from "zod";
import { useState } from "react";

const emailSchema = z.string().email();
const apiURL = String(import.meta.env.VITE_API_URL) + "/api/auth";

/**
 * AuthEmailInput
 */
export default function AuthEmailInput() {
  const [email, setEmail] = useState<string>("");
  const [emailInputHasBeenFocused, setEmailInputHasBeenFocused] = useState(false);
  const emailValidation = emailSchema.safeParse(email);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleClick() {
    const formattedURL = apiURLFormatter(email);
    console.log(formattedURL);
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
        <p className="auth-form-label auth-form-error">Email invalid</p>
        :
        <p className="auth-form-label auth-form-error"></p>
      }
      <button
        className="create-post-submit-button"
        type="button"
        disabled={!emailValidation.success}
        onClick={handleClick}>Submit</button>
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
