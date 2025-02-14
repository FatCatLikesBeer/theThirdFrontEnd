const baseURL = "http://my-bucket.mooo.com:9000/the-third/";
const avatarDefault = `${baseURL}avatar.jpg`;

/**
 * Formats 'avatar' data string to URL for display in HTML
 * or returns the default avatar.
 * @param {string | null} avatar - data from server
 * @returns {string} - a url to an avatar
 */
export default function avatarFormatter(avatar: string | null): string {
  let avatarLocation: string;
  if (avatar != null) {
    avatarLocation = `${baseURL}${avatar}.jpg`;
  } else {
    avatarLocation = avatarDefault;
  }
  return avatarLocation;
}

