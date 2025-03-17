export default function apiURLFetcher(): string {
  let apiURL: string = `https://${window.location.host}`;
  return apiURL;
}
