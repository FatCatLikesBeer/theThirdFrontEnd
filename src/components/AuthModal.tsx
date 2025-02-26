import { useEffect, useRef } from "react";
import CloseIcon from "./icons/CloseIcon";
import AuthEmailInput from "./AuthEmailInput";

export default function AuthModal({
  modalRef,
}: {
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const closeButtonRef = useRef<null | SVGSVGElement>(null);

  useEffect(() => {
    function handleClose() {
      modalRef?.current?.close();
    }

    closeButtonRef.current?.addEventListener('click', handleClose);
    return (() => {
      closeButtonRef.current?.removeEventListener('click', handleClose);
    });
  }, []);

  return (
    <dialog ref={modalRef} className="auth-modal-container">
      <CloseIcon size={20} ref={closeButtonRef} />
      <div className="auth-modal-content">
        <AuthEmailInput modalRef={modalRef} />
      </div>
    </dialog>
  );
}
