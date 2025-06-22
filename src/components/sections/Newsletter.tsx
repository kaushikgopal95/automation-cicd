
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Leaf } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section id="newsletter" className="py-20 bg-green-900/20" data-testid="newsletter-section">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-green-600/30">
            <Leaf className="h-4 w-4" />
            <span>Stay Updated</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-100 mb-4" data-testid="newsletter-title">
            Get Plant Care Tips & Exclusive Offers
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join our community of plant lovers and receive expert care guides, new product updates, and special discounts.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-green-500"
              required
              data-testid="newsletter-email"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              data-testid="newsletter-submit"
            >
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
