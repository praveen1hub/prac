export default function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
    </div>
  );
}