
import { Leaf, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800" data-testid="footer">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-gray-100">PlantCraft</span>
            </div>
            <p className="text-gray-400">
              Bringing nature into your home with premium plants and handcrafted decor.
            </p>
            {/* <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div> */}
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Shop All</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Indoor Plants</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Plant Care</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Handmade Crafts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Gift Cards</a></li>
            </ul>
          </div> */}

          {/* Customer Service */}
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Plant Care Guide</a></li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Get in Touch</h3>
            <div className="space-y-2 text-gray-400">
              <p>📞 +91-8147325107</p>
              <p>📧 kaushik.gopal95@gmail.com</p>
              {/* <p>📍 123 Green Street<br />Plant City, PC 12345</p> */}
              {/* <p className="text-sm">Mon-Fri: 9AM-6PM EST<br />Sat-Sun: 10AM-4PM EST</p> */}
            </div>
          </div>
        </div>

        {/* <div className="border-t border-gray-800 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PlantCraft. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
};
