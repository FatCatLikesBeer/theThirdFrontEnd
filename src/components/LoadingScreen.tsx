import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const timeoutLength = 3000;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, timeoutLength);

    return () => clearTimeout(timeout);
  }, []);

  if (!loading) { return null }

  return (
    <div className="loading-screen">
      <div className="spinner">what</div>
      <p>Loading...</p>
    </div>
  );
}
