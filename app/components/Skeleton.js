export default function Skeleton({ width, height, borderRadius = "4px" }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
    ></div>
  );
}