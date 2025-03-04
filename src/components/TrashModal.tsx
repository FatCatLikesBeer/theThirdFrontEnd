import { useContext } from "react";

import TrashModalContext from "../context/TrashModalContext";
import ToastContext from "../context/ToastContext";

export default function TrashModal() {
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;
  const toastRef = useContext(ToastContext);

  function handleCancel() {
    trashModalRef.current.close("canceled");
  }

  function handleDelete() {
    const returnValueJSON = JSON.parse(trashModalRef.current.returnValue);
    const apiURL = returnValueJSON.apiURL;
    const postUUID = returnValueJSON.postUUID;
    fetch(apiURL,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Request Error");
        }
      })
      .then((j: APIResponse<null>) => {
        if (j.success) {
          toastRef?.current?.showToast("Successfully Deleted!", true);
        } else {
          throw new Error(j.message);
        }
      })
      .catch((err: Error) => {
        toastRef?.current?.showToast(err.message, false);
      });
    trashModalRef.current.close(postUUID);
  }

  return (
    <dialog ref={trashModalRef} className="trash-modal">
      <p>Delete?</p>
      <div className="flex-space-between flex-row ">
        <button type="button" onClick={handleCancel} className="modal-button">Cancel</button>
        <button type="button" onClick={handleDelete} className="modal-button button-red">Delete</button>
      </div>
    </dialog>
  );
}
