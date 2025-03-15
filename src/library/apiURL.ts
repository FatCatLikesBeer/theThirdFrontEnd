export default function apiURLFetcher(): "" | "http://localhost:3000" {
  let apiURL: "" | "http://localhost:3000" = "";
  if (document.getElementById("env")?.hasAttribute("dev")) {
    apiURL = "http://localhost:3000";
  }
  return apiURL;
}
