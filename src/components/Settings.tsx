import { useEffect, useState, useRef } from "react";
import { z } from "zod";

import EditIcon from './icons/EditIcon';
import CircleCheck from "./icons/CircleCheck";
import CircleX from "./icons/CircleX";

import avatarFormatter from '../library/avatarFormatter';
import dateFormatter from '../library/dateFormatter';

const apiURL = String(import.meta.env.VITE_API_URL);
const forbiddenChars = `@#$%^&*()+=[]{}|:;"'<>,?/`;
const forbiddenCharsRegex = new RegExp(`^[^\\s${forbiddenChars}]+$`);
const handleSchema = z.string()
  .max(24, "16 Character Max")
  .min(3, "3 Character Min")
  .regex(forbiddenCharsRegex, "Invalid Characters");

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

  useEffect(() => {
    const formattedAPIURL = apiURLFormatter();
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
    if (!Boolean(Number(localStorage.getItem("onboarding")))) {
      // open Settings edit modal
      // you still need to create the modal, copy what you did with the auth modal
    }
  });

  function toggleState(stateFunc: React.Dispatch<React.SetStateAction<boolean>>) {
    function onClickCallBackFunction() { stateFunc(prevState => !prevState) }
    return onClickCallBackFunction;
  }

  return (
    <>
      {userData
        ?
        <div>
          <h1 className="page-title">Settings</h1>
          <img src={avatarFormatter(userData.avatar || null)} className='user-avatar avatar-detail' />
          <p><EditIcon callBack={toggleState(setEditHandle)} />{"  "}
            Handle: @{editHandle
              ?
              <EditValue
                inputValue={handle}
                setInputValue={setHandle}
                toggleEditState={toggleState(setEditHandle)}
              />
              :
              userData?.handle}
          </p>
          <p><EditIcon callBack={toggleState(setEditDisplay)} />{"  "}
            Display Name: {
              editDisplay
                ?
                <EditValue
                  inputValue={displayName}
                  setInputValue={setDisplayName}
                  toggleEditState={toggleState(setEditDisplay)}
                />
                :
                userData?.display_name
            }</p>
          <p><EditIcon callBack={toggleState(setEditLoc)} />{"  "}
            Location: {
              editLoc
                ?
                <EditValue
                  inputValue={location}
                  setInputValue={setLocation}
                  toggleEditState={toggleState(setEditLoc)}
                />
                :
                userData?.location
            } </p>
          <div><EditIcon callBack={toggleState(setEditAbout)} />{"  "}
            About: {
              editAbout
                ?
                <EditValue
                  inputValue={about}
                  setInputValue={setAbout}
                  toggleEditState={toggleState(setEditAbout)}
                  textarea={true}
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
  inputValue, setInputValue, toggleEditState, textarea = false,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  toggleEditState?: () => void;
  textarea?: boolean;
}) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setInputValue(event.target.value);
  }

  return (
    <>
      {textarea
        ?
        <>
          <div style={{ display: "inline" }}>
            <CircleCheck />
            <CircleX callBack={toggleEditState} />
          </div>
          <div>
            <textarea
              value={inputValue}
              onChange={handleChange}
              className="settings-textarea"
            />
          </div>
        </>
        :
        <>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="settings-input"
          />
          <CircleCheck />
          <CircleX callBack={toggleEditState} />
        </>
      }
    </>
  );
}

/**
  * apiURLFormatter
  */
function apiURLFormatter(): string {
  const param = `/api/users/self`;
  return encodeURI(`${apiURL}${param}`);
}
