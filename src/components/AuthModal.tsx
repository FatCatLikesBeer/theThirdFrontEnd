import { useEffect, useRef, useContext, useState } from "react";
import CloseIcon from "./icons/CloseIcon";
import AuthEmailInput from "./authFlow/AuthEmailInput";
import LoginToken from "./authFlow/LoginToken.tsx";
import SignupConfirmation from "./authFlow/SignupConfirmation.tsx";

import AuthModalContext from "../context/AuthModalContext";

/**
 * AuthModal
 */
export default function AuthModal() {
  const [isUser, setIsUser] = useState<null | boolean>(null);
  const [userEmail, setUserEmail] = useState<null | string>(null);
  const modalRef = useContext(AuthModalContext) as React.RefObject<HTMLDialogElement>;
  const closeButtonRef = useRef<null | SVGSVGElement>(null);

  useEffect(() => {
    function handleClose() {
      modalRef?.current?.close();
    }

    function clearUser() {
      setIsUser(null);
    }

    closeButtonRef.current?.addEventListener('click', handleClose);
    modalRef?.current?.addEventListener("close", clearUser);
    return (() => {
      closeButtonRef.current?.removeEventListener('click', handleClose);
      modalRef?.current?.removeEventListener("close", clearUser);
    });
  }, []);

  return (
    <dialog ref={modalRef} className="auth-modal-container">
      <CloseIcon size={20} ref={closeButtonRef} />
      <div className="auth-modal-content">
        {isUser === null
          ?
          <AuthEmailInput setIsUser={setIsUser} setUserEmail={setUserEmail} />
          :
          isUser === true
            ?
            <LoginToken email={userEmail as string} />
            :
            <SignupConfirmation email={userEmail as string} />
        }
      </div>
    </dialog>
  );
}
