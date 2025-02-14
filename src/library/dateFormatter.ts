/**
 * dateFormatter: Formats created_at from database to 
 * a standardized format for HTML
 * @param {string} created_at
 * @returns {string} date
 */
export default function dateFormatter(created_at: string): string {
  const date = new Date(created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
}
