export default function LoadingSpinner() {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
