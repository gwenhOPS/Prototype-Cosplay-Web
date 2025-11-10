import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full mt-auto bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 to-gray-900 text-gray-400'
          : 'from-gray-100 to-gray-200 text-gray-600'
      } shadow-inner`}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`}
            >
              Rental Cosplay
            </h3>
            <p className="text-sm">
              Transformasi dirimu menjadi karakter favorit dengan kostum
              berkualitas tinggi. Kami menyediakan berbagai pilihan kostum untuk
              berbagai acara.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`}
            >
              Menu Utama
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/produk"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Katalog Kostum
                </Link>
              </li>
              <li>
                <Link
                  to="/keranjang"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Keranjang
                </Link>
              </li>
              <li>
                <Link
                  to="/transaksi"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Riwayat Transaksi
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Akun Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`}
            >
              Informasi
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Cara Pemesanan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${
                    isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                  } transition-colors`}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`}
            >
              Kontak Kami
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone
                  size={16}
                  className={isDark ? 'text-pink-400' : 'text-pink-600'}
                />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail
                  size={16}
                  className={isDark ? 'text-pink-400' : 'text-pink-600'}
                />
                <span>info@rentalcosplay.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin
                  size={16}
                  className={isDark ? 'text-pink-400' : 'text-pink-600'}
                />
                <span>Jl. Anime No. 123, Surabaya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-10 pt-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-300'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Rental Cosplay. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                Terms
              </a>
              <a
                href="#"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                Privacy
              </a>
              <a
                href="#"
                className={`${
                  isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
                } transition-colors`}
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
