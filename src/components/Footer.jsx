export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-center py-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Rental Cosplay. All rights reserved.
      </p>
    </footer>
  );
}
