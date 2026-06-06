import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🌊 Mirleft</h3>
            <p className="text-gray-400 mb-4">
              Discover the best travel experiences on Morocco's Atlantic coast.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/hotels" className="hover:text-white transition">
                  Hotels & Accommodations
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-white transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition">
                  Activities & Tours
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Places</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Mirleft Beach
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Surfing Spots
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Local Market
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Sahara Desert Tours
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Mirleft, Morocco</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+212 528-861-611</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@mirleft.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-800 p-8 rounded-lg mb-12">
          <h4 className="text-xl font-semibold mb-4">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-gray-400 mb-4">
            Get travel tips and special offers delivered to your inbox.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400 text-sm">
            <div>© 2026 Mirleft. All rights reserved.</div>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
            <div className="text-right">Discover. Explore. Experience.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
