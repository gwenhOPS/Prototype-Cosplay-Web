import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      placeholder="Cari data..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
    />
  );
}
