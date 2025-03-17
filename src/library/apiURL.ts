export default function apiURLFetcher(): string {
  let apiURL: string = window.location.origin;
  // if (document.getElementById("env")?.hasAttribute("dev")) {
  //   apiURL = "http://localhost:3000";
  // }
  return apiURL;
}
