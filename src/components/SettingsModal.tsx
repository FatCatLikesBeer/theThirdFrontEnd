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
  const [avatarFile, setAvatarFile] = useState<FileList>();
  const [avatarURL, setAvatarURL] = useState<string>("");
  const closeButtonRef = useRef<SVGSVGElement | null>(null);
  const editAvatarRef = useContext(EditAvatarModalContext) as React.RefObject<HTMLDialogElement>;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useContext(ToastContext);

  // Image Input Event Listeners
  useEffect(() => {
    function handleChange(this: HTMLInputElement) {
      const fileList = this.files as FileList;
      const providedAvatar = URL.createObjectURL(fileList[0]);
      setAvatarFile(fileList);
      setAvatarURL(providedAvatar);
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

      const sendFile = await fetch(String(signedURLJSON.data), {
        cache: "reload",
        method: "PUT",
        body: avatarFile[0],
        headers: { "Content-Type": avatarFile[0].type }
      });
      console.log("sendFile", sendFile);
      if (!sendFile.ok) {
        throw new Error("Upload Error")
      } else {
        toastRef?.current?.showToast("Avatar Updated!", true);
        editAvatarRef.current.close("avatar_updated");
      }
    } catch (err: Error) {
      toastRef?.current?.showToast(err.message, false);
    }
  }

  async function handleDefault() {
    try {
      const avatarDefault = await fetch(apiURL + "/api/users?avatar=default", {
        method: "PUT",
        credentials: "include",
      });
      console.log(avatarDefault);
      if (avatarDefault.ok) {
        editAvatarRef.current.close("avatar_default");
        toastRef?.current?.showToast("Avatar Default!", true);
      }
    } catch (err: Error) {
      console.error(err);
      toastRef?.current?.showToast(err.message, false);
    }
  }

  return (
    <dialog ref={editAvatarRef} className="auth-modal-container">
      <div className="flex-space-between flex-column">
        <CloseIcon ref={closeButtonRef} />
        {avatarURL
          ?
          <img className="user-avatar avatar-detail" src={avatarURL} />
          :
          <h2 className="trash-modal-title">Upload New Avatar</h2>
        }
        <input ref={imageInputRef} accept="image/*" type="file" max="1" />
        <button type="button" className="modal-button" style={{ marginTop: "1rem" }} onClick={handleSubmit}>Submit</button>
        <button type="button" className="modal-button button-red" style={{ marginTop: "8px" }} onClick={handleDefault}>Use Default</button>
      </div>
    </dialog>
  );
}
