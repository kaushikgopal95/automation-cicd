
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Gift } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive our latest updates and special offers",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-900 to-gray-900" data-testid="newsletter-section">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-600/20 p-3 rounded-full">
              <Mail className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-100 mb-4" data-testid="newsletter-title">
            Stay in the Loop
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest plant care tips, new product launches, and exclusive offers 
            delivered straight to your inbox.
          </p>

          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4 text-green-400">
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span className="text-sm">10% off your first order</span>
              </div>
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span className="text-sm">Plant care guides</span>
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span className="text-sm">Early access to sales</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto" data-testid="newsletter-form">
            <div className="flex space-x-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                required
                data-testid="newsletter-email"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                data-testid="newsletter-submit"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
