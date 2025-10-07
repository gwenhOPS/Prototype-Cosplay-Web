export default function Footer() {
  return (
    <footer
      className="bg-gray-200 dark:bg-gray-800 py-3 px-4 text-sm text-gray-600 dark:text-gray-400"
      style={{ position: 'fixed', left: 0, bottom: 0, borderTopRightRadius: '1rem', zIndex: 50 }}
    >
      © {new Date().getFullYear()} Rental Cosplay. All rights reserved.
    </footer>
  );
}
