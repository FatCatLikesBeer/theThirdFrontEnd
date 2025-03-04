import { useRef, useImperativeHandle, useState, useContext } from "react";
import CircleCheck from "./icons/CircleCheck";
import CircleX from "./icons/CircleX";

export interface ToastHandle {
  showToast: (message: string, success: boolean) => void;
}

import ToastContext from "../context/ToastContext";

export default function Toast() {
  const toastRef = useContext(ToastContext);
  const [message, setMessage] = useState<null | string>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(toastRef, () => {
    return {
      /**
       * showToast
       * @argument {string} message - Message to display
       * @argument {boolean} success - Show a success or error message
       */
      showToast: function(message: string, success: boolean) {
        setIsSuccess(success);
        setMessage(message);
        setTimeout(() => {
          setMessage(null);
        }, 7000);
      }
    }
  }, []);

  if (!message) return null;

  if (isSuccess) {
    return (
      <div ref={divRef} className="toast toast-success">
        <p><CircleCheck callBack={() => { setMessage(null) }} />{"  "}{message}</p>
      </div>
    );
  } else {
    return (
      <div ref={divRef} className="toast toast-error">
        <p><CircleX callBack={() => { setMessage(null) }} />{"  "}{message}</p>
      </div>
    );
  }

}
