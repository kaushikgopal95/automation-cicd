import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About PlantBot</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Bringing nature's beauty into your home with carefully selected plants and handcrafted pottery.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2023, PlantBot began as a small passion project with a simple mission: to make indoor gardening accessible to everyone.
              What started as a local plant shop has grown into a community of plant lovers who believe in the power of nature to transform spaces and lives.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We carefully select each plant in our collection, ensuring they're healthy, vibrant, and ready to thrive in your home. 
              Our team of plant experts is always here to provide guidance and support for both new and experienced plant parents.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8 space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-gray-300">
                To inspire and enable people to connect with nature through beautiful, high-quality plants and thoughtful design.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Source sustainable and ethically grown plants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Provide expert advice and care instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Create beautiful, long-lasting plant arrangements</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8 space-y-4">
              <h2 className="text-2xl font-bold">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-400">Sustainability</h3>
                  <p className="text-gray-400 text-sm">We're committed to eco-friendly practices and responsible sourcing.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Quality</h3>
                  <p className="text-gray-400 text-sm">Every plant is hand-selected for health and beauty.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Community</h3>
                  <p className="text-gray-400 text-sm">Building connections through shared love of plants.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Visit Us</h2>
            <p className="text-gray-300 mb-6">Come see our selection in person and meet our team of plant enthusiasts.</p>
            <div className="grid md:grid-cols-3 gap-6 text-gray-400 text-sm">
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Location</h3>
                <p>123 Green Street<br />Plant City, PC 12345</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Hours</h3>
                <p>Mon-Fri: 10am - 7pm<br />Sat-Sun: 9am - 8pm</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Contact</h3>
                <p>hello@plantbot.com<br />(555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
