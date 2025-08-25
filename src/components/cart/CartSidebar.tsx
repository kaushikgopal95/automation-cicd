
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./CartItem";
import { ShoppingBag, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0);

  const handleCheckout = () => {
    if (!user || cartItems.length === 0) return;
    
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-gray-900 border-gray-800 text-gray-100 w-full sm:max-w-lg h-full flex flex-col pb-8" data-testid="cart-sidebar">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-gray-100 flex items-center space-x-2" data-testid="cart-title">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart ({cartItems.length})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 mt-6 min-h-0">
          {!user ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Please sign in to view your cart</p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Your cart is empty</p>
                <p className="text-gray-500 text-sm">Add some beautiful plants to get started!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable Area with Proper Height Management */}
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto pr-2 space-y-4" 
                     style={{
                       scrollbarWidth: 'thin',
                       scrollbarColor: '#4B5563 #1F2937'
                     }}>
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Checkout Section - Always Visible with Proper Spacing */}
              <div className="border-t border-gray-800 pt-4 space-y-4 mt-4 flex-shrink-0 pb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-400" data-testid="cart-total">${totalAmount.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-base font-semibold"
                  data-testid="checkout-btn"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
