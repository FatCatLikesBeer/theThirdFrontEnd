import {
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import CloseIcon from "./icons/CloseIcon";

import EditAvatarModalContext from "../context/EditAvatarModalContext.ts";
import ToastContext from "../context/ToastContext.tsx";

const apiURL = String(import.meta.env.VITE_API_URL);

export default function SettingsModal() {
  const [avatar, setAvatar] = useState("");
  const closeButtonRef = useRef<SVGSVGElement | null>(null);
  const editAvatarRef = useContext(EditAvatarModalContext) as React.RefObject<HTMLDialogElement>;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useContext(ToastContext);

  // Image Input Event Listeners
  useEffect(() => {
    function handleChange(this: HTMLInputElement) {
      const fileList = this.files;
      const providedAvatar = URL.createObjectURL(fileList[0]);
      setAvatar(providedAvatar);
    }

    imageInputRef.current?.addEventListener("change", handleChange);
    return () => {
      imageInputRef.current?.removeEventListener("change", handleChange);
    }
  }, []);

  // Close Button Event Listeners
  useEffect(() => {
    function handleClick() {
      editAvatarRef.current.close("canceled");
    }

    closeButtonRef.current?.addEventListener("click", handleClick);
    return () => { closeButtonRef.current?.removeEventListener("click", handleClick) }
  }, []);

  async function handleSubmit() {
    try {
      const signedURLRequest = await fetch(apiURL + "/api/auth/getSignedBucketURL", { credentials: "include" });
      if (!signedURLRequest.ok) { throw new Error("Request Error") }

      const signedURLJSON: APIResponse<string> = await signedURLRequest.json();
      if (!signedURLJSON.success) { throw new Error(signedURLJSON.message) }

      console.log(signedURLJSON.data);
    } catch (err: any) {
      toastRef?.current?.showToast(err.message, false);
    }

    // TODO: I'm currently able to fetch the signed URL form my endpoint. I now need to
    // TODO: write another fetch function to send "PUT" the user's avatar to the R2 bucket
    // TODO: and on success, send the update to the database, another fetch "PUT" to my API
  }

  return (
    <dialog ref={editAvatarRef} className="auth-modal-container">
      <div className="flex-space-between flex-column">
        <CloseIcon ref={closeButtonRef} />
        {avatar
          ?
          <img className="user-avatar avatar-detail" src={avatar} />
          :
          <h2 className="trash-modal-title">Upload New Avatar</h2>
        }
        <input ref={imageInputRef} type="file" />
        <button type="button" className="modal-button" style={{ marginTop: "1rem" }} onClick={handleSubmit}>Submit</button>
      </div>
    </dialog>
  );
}
