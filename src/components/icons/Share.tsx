export default function Share({
  size = 16,
  callBack = () => { },
}: {
  size?: number;
  callBack?: () => void,
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16" onClick={callBack} style={{ verticalAlign: "-4px" }}>
      <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
    </svg>
  );
}
