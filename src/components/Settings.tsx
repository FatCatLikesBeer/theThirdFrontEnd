import React, { useEffect, useState, useContext } from "react";
import { z } from "zod";

import EditIcon from "./icons/EditIcon";
import CircleCheck from "./icons/CircleCheck";
import CircleX from "./icons/CircleX";

import ToastContext from "../context/ToastContext";
import EditAvatarModalContext from "../context/EditAvatarModalContext.ts";

import type { ToastHandle } from "./Toast";

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

const apiURL = String(import.meta.env.VITE_API_URL);

const handleSchema = z.string()
  .max(24, "16 Character Max")
  .min(3, "3 Character Min")
  .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and dashes allowed");

export default function Settings() {
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [handle, setHandle] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [editHandle, setEditHandle] = useState(false);
  const [editDisplay, setEditDisplay] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editLoc, setEditLoc] = useState(false);

  const toastRef = useContext(ToastContext);
  const settingsModalRef = useContext(EditAvatarModalContext) as React.RefObject<HTMLDialogElement>;

  useEffect(() => {
    const formattedAPIURL = apiURLFormatterGET();
    fetch(formattedAPIURL, {
      credentials: "include",
    })
      .then(response => {
        if (!response.ok) { throw new Error("Request Error") }
        return response.json();
      })
      .then(json => {
        if (!json.success) { throw new Error(json.message) }
        setUserData({ ...json.data });
        setHandle(json.data.handle);
        setDisplayName(json.data.display_name);
        setAbout(json.data.about);
        setLocation(json.data.location);
        return json.data;
      })
      .catch(err => {
        console.error("Settings page error");
        console.error(err);
      });
  }, []);

  // Onboarding
  useEffect(() => {
    if (null === localStorage.getItem("onboarded")) {
      localStorage.setItem("onboarded", "true");
      toastRef?.current?.showToast("Pick a cool handle", true);
    }
  }, []);

  function toggleState(stateFunc: React.Dispatch<React.SetStateAction<boolean>>) {
    function onClickCallBackFunction() { stateFunc(prevState => !prevState) }
    return onClickCallBackFunction;
  }

  function editAvatar() {
    settingsModalRef?.current.showModal();
  }

  return (
    <>
      {userData
        ?
        <div>
          <h1 className="page-title">Settings</h1>
          <img
            className="user-avatar avatar-detail pointer"
            onClick={editAvatar}
            src={avatarFormatter(userData.avatar || null)}
          />
          <p><EditIcon callBack={toggleState(setEditHandle)} />{"  "}
            Handle: @{editHandle
              ?
              <EditValue
                originalValue={userData.handle}
                queryName="handle"
                editValue={handle}
                setEditValue={setHandle}
                toggleEditState={toggleState(setEditHandle)}
                toastRef={toastRef}
                setUserData={setUserData}
              />
              :
              userData?.handle}
          </p>
          <p><EditIcon callBack={toggleState(setEditDisplay)} />{"  "}
            Display Name: {
              editDisplay
                ?
                <EditValue
                  originalValue={userData.display_name}
                  queryName="display_name"
                  editValue={displayName}
                  setEditValue={setDisplayName}
                  toggleEditState={toggleState(setEditDisplay)}
                  toastRef={toastRef}
                  setUserData={setUserData}
                />
                :
                userData?.display_name
            }</p>
          <p><EditIcon callBack={toggleState(setEditLoc)} />{"  "}
            Location: {
              editLoc
                ?
                <EditValue
                  originalValue={userData.location}
                  queryName="location"
                  editValue={location}
                  setEditValue={setLocation}
                  toggleEditState={toggleState(setEditLoc)}
                  toastRef={toastRef}
                  setUserData={setUserData}
                />
                :
                userData?.location
            } </p>
          <div><EditIcon callBack={toggleState(setEditAbout)} />{"  "}
            About: {
              editAbout
                ?
                <EditValue
                  originalValue={userData.about}
                  queryName="about"
                  editValue={about}
                  setEditValue={setAbout}
                  toggleEditState={toggleState(setEditAbout)}
                  textarea={true}
                  toastRef={toastRef}
                  setUserData={setUserData}
                />
                :
                userData?.about
            } </div>
          <p>Email: {userData?.email}</p>
          <p>Member since: {dateFormatter(userData?.created_at)}</p>
        </div>
        :
        ""
      }
    </>
  );
}

/**
 * EditValue component
 * @prop {string} inputValue - The value to be returned
 * @prop {Dispatch} setInputValue - The Dispatch func to set the state of value
 * @prop {void} toggleEditState - function to open & close input component
 * @prop {boolean} textarea - Return textarea instead of an input element
 * @description
 */
function EditValue({
  originalValue,
  queryName,
  editValue,
  setEditValue,
  toggleEditState,
  toastRef,
  textarea = false,
  setUserData,
}: {
  originalValue: string | undefined;
  queryName: string;
  editValue: string;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  toggleEditState: () => void;
  textarea?: boolean;
  toastRef: React.RefObject<ToastHandle | null> | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDetailData | null>>;
}) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEditValue(event.target.value);
  }

  function handleConfirm() {
    if ("handle" === queryName) {
      const handleParse = handleSchema.safeParse(editValue);
      if (!handleParse.success) {
        const errorMessage = JSON.parse(handleParse.error.message)[0].message;
        console.log(errorMessage);
        toastRef?.current?.showToast(errorMessage, false);
        return;
      }
    }

    const fetchURL = apiURLFormatterPUT(queryName, editValue);
    fetch(fetchURL, {
      method: "PUT",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Request error 😩");
        }
      })
      .then((json) => {
        if (json.success) {
          const firstLetter = queryName.slice(0, 1).toUpperCase();
          const capitalized = `${firstLetter}${queryName.slice(1)}`
          toastRef?.current?.showToast(`${capitalized} changed!`, true);
          setEditValue(json.data.result);

          setUserData((previousValue) => {
            const newData = { ...previousValue } as UserDetailData;
            newData[queryName] = json.data.result;
            return newData;
          });

          toggleEditState();
        } else {
          throw new Error(json.message);
        }
      })
      .catch((err: Error) => {
        toastRef?.current?.showToast(err.message, false);
        toggleEditState();
      });
  }

  function handleCancel() {
    setEditValue(originalValue || "");
    toggleEditState();
  }

  return (
    <>
      {textarea
        ?
        <>
          <div style={{ display: "inline" }}>
            <CircleCheck callBack={handleConfirm} />
            <CircleX callBack={handleCancel} />
          </div>
          <div>
            <textarea
              value={editValue}
              onChange={handleChange}
              className="settings-textarea"
            />
          </div>
        </>
        :
        <>
          <input
            type="text"
            value={editValue}
            onChange={handleChange}
            className="settings-input"
          />
          <CircleCheck callBack={handleConfirm} />
          <CircleX callBack={handleCancel} />
        </>
      }
    </>
  );
}

/**
  * apiURLFormatter
  */
function apiURLFormatterGET(): string {
  const param = `/api/users/self`;
  return encodeURI(`${apiURL}${param}`);
}

/**
  * apiURLFormatterPUT
  * @argument {string} queryName - query name to be modified
  * @argument {string} queryValue - query value to be inserted
  */
function apiURLFormatterPUT(queryName: string, queryValue: string): string {
  const param = `/api/users?${queryName}=${queryValue}`;
  return encodeURI(`${apiURL}${param}`);
}
