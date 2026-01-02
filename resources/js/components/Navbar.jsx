/**
 * Navbar Component
 * - Transparent background on hero, solid on scroll
 * - Responsive hamburger menu for mobile
 * - Menu: Beranda, Tentang, Peta, Fitur, Kontak
 * - Auth buttons: Masuk, Daftar
 */
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Peta', href: '#peta' },
    { name: 'Fitur', href: '#fitur' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#beranda" className="flex items-center space-x-2">
            <div className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-green-600' : 'text-white'
              }`}>
              🌾 AgriMatch
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-500 ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="login"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isScrolled
                ? 'text-gray-700 hover:text-green-600'
                : 'text-white hover:text-green-300'
                }`}
            >
              Masuk
            </a>
            <a href="register" className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/25 hover:shadow-green-600/40">
              Daftar
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 py-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <a
              href="login"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors text-center"
            >
              Masuk
            </a>
            <a
              href="register"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Daftar
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
