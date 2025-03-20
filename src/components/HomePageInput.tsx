import { useState, useRef, ChangeEvent, useEffect, useContext } from "react";
import imageCompression from "browser-image-compression";

import ImagePlaceHolder from "./icons/ImagePlaceHolder";

import ToastContext from "../context/ToastContext";
import PostListDataContext from "../context/PostListDataContext";
import AuthContext from "../context/AuthContext";

import writingPrompt from "../library/writingPrompt";
import apiURLFetcher from "../library/apiURL";

const textLimit = 400;
const postUrl = apiURLFetcher();

export default function HomePageInput() {
  const [clicked, setClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("text");
  const [mediaData, setMediaData] = useState<{ url: string; postUUID: string } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const setPosts = useContext(PostListDataContext) as React.Dispatch<React.SetStateAction<PostListData[] | null>>;
  const [inputValue, setInputValue] = useState("");
  const [prompt] = useState(writingPrompt());
  const divRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const textLimitRef = useRef<null | HTMLParagraphElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useContext(ToastContext);
  const { uuid } = useContext(AuthContext);

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value)
  }

  function handleClick() {
    setClicked(true);
    if (selectedOption === "image") {
      if (!image || image.size === 0) {
        alert("File is empty!");
        return;
      } else {
        console.log(image.type);
      }
      (async function() {
        try {

          // Send to bucket
          const compressedImage = await imageCompression(image, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
          const upload = await fetch(mediaData?.url as string, {
            cache: "reload",
            method: "PUT",
            body: compressedImage,
            headers: { "Content-Type": image.type }
          });
          console.log(upload);
          if (!upload.ok) { throw new Error("Could not upload image, Contractor Error: [CE16836]") }

          // Send to backed
          const queries = {
            post: "You should see an image instead of this text",
            postUUID: mediaData?.postUUID,
            contentType: "image",
          }
          const fetchDestination = encodeURI(`${postUrl}/api/posts?post=${queries.post}&postUUID=${queries.postUUID}&contentType=${queries.contentType}`);
          const r = await fetch(fetchDestination, { credentials: "include", method: "POST" });
          const j = await r.json();
          if (!r.ok) { throw new Error("Could not post image, request error [HPI16836]") }
          if (!j.success) { throw new Error(j.message) }

          // Success!
          toastRef?.current?.showToast("Image uploaded", true);
          setImage(null);

          setPosts((prevValue) => {
            if (null != prevValue) {
              const newValue = [...prevValue];
              newValue.unshift({ ...j.data as PostListData });
              return newValue;
            } else {
              const newValue: PostListData[] = [];
              newValue.push({ ...j.data as PostListData });
              return newValue
            }
          });
        } catch (err: unknown) {
          if (err instanceof Error) { toastRef?.current?.showToast(err.message, false) }
          console.error(err);
        } finally {
          setClicked(false);
        }
      })();
    } else {
      const fetchDestination = `${postUrl}/api/posts?post=${inputValue}`;
      fetch(fetchDestination, {
        method: "POST",
        credentials: "include"
      })
        .then(r => {
          if (r.ok) {
            return r.json();
          } else {
            throw new Error("");
          }
        })
        .then((j: APIResponse<PostListData>) => {
          if (j.success) {
            setInputValue("");
            setPosts((prevValue) => {
              toastRef?.current?.showToast("Post posted!", true);
              if (null != prevValue) {
                const newValue = [...prevValue];
                newValue.unshift({ ...j.data as PostListData });
                return newValue;
              } else {
                const newValue: PostListData[] = [];
                newValue.push({ ...j.data as PostListData });
                return newValue
              }
            });
          } else {
            throw new Error(j.message);
          }
        })
        .catch((err: Error) => {
          toastRef?.current?.showToast(err.message, false);
        })
        .finally(() => {
          setClicked(false);
        });
    }
  }

  useEffect(() => {
    const textWarning = textLimit - 50;
    const textAlert = textLimit - 10;
    if ((inputValue.length >= textWarning) && (inputValue.length < textAlert)) {
      textLimitRef.current?.classList.add("yellow");
    } else if (inputValue.length >= textAlert) {
      textLimitRef.current?.classList.remove("yellow");
      textLimitRef.current?.classList.add("red");
    } else {
      textLimitRef.current?.classList.remove("yellow");
      textLimitRef.current?.classList.remove("red");
    }
  }, [inputValue]);

  useEffect(() => {
    if (selectedOption === "image") {
      (async function() {
        try {
          const r = await fetch(`${postUrl}/api/posts/requestPresignedURL`, { credentials: "include" });
          const j: APIResponse<{ url: string; postUUID: string }> = await r.json();
          if (!r.ok) { throw new Error("Error with Images API") }
          if (!j.success) { throw new Error(j.message) }
          setMediaData({ ...j.data as { url: string; postUUID: string } });
        } catch (err: unknown) {
          console.error(err);
          if (err instanceof Error) {
            toastRef?.current?.showToast(err.message, false);
          }
        }
      })();
    }
  }, [selectedOption]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImage(selectedFile);
    }
  }

  function handlePlaceHolderClick() {
    imageInputRef?.current?.click();
  }

  return (
    <>
      {uuid
        ?
        <div ref={divRef} className="create-post-container">
          <p className="create-post-title">Share Something Cool!</p>
          <div className="create-post-input-container">
            <div>
              <select
                id="contentType"
                name="contentTypes"
                className="content-type"
                onChange={(e) => {
                  setImage(null);
                  setSelectedOption(e.target.value);
                }}
                style={{
                  marginBottom: "12px",
                }}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                {/* <option value="link">Link</option> */}
              </select>
            </div>
            <div className="content-area">
              {selectedOption === "image" ?
                <div className="input-image-placeholder">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {image ?
                    <img
                      src={URL.createObjectURL(image)}
                      style={{
                        marginTop: "12px",
                        marginBottom: "12px",
                        width: "100%",
                      }}
                    />
                    :
                    <ImagePlaceHolder callBack={handlePlaceHolderClick} />
                  }
                </div>
                :
                <>
                  <textarea
                    className="create-post-textarea-element"
                    ref={inputRef}
                    onChange={handleInput}
                    value={inputValue}
                    placeholder={prompt}
                  />
                  <p className="characters-remaining" ref={textLimitRef}>{inputValue.length} / {textLimit}</p>
                </>
              }
            </div>
            <button
              className="create-post-submit-button"
              onClick={handleClick}
              type="button"
              disabled={(textLimit <= inputValue.length) || ("image" === selectedOption && image === null)}
            >
              {clicked
                ?
                <div className="spinner" />
                :
                "Post"
              }
            </button>
          </div>
        </div>
        :
        ""
      }
    </>
  );
}

// TODO: When the text option gets selected, get postUUID from /api/posts/requestPresignedURL
// TODO: Backed needs to generate a compatable UUID
// TODO: Load {url: string; postUUID: string} and store for PUT request
