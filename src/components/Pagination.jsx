export default function Pagination({ page, setPage, total }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>
      <span>Page {page} / {total}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === total}
        className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
