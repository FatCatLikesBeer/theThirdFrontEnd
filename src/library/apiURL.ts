const dev = document.getElementById("env")?.hasAttribute("dev");

export default function apiURLFetcher(): string {
  let apiURL: string = `https://${window.location.host}`;
  if (true === dev) {
    console.log("DEV ENVIRONMENT");
    apiURL = "http://localhost:3000";
  }
  return apiURL;
}
