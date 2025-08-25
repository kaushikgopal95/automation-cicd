
import { Leaf, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800" data-testid="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="PlantBot Logo" 
                className="h-6 w-6 object-contain"
              />
              <span className="text-xl font-bold text-gray-100">PlantBot</span>
            </div>
            <p className="text-sm text-gray-400">
              Bringing nature into your home with premium plants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Shop All</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Plant Care</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 mb-3">Contact</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>📞 +91-8147325107</p>
              <p>📧 kaushik.gopal95@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-gray-400">
              © 2024 PlantBot. Learning project.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-xs text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-gray-400 hover:text-green-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
