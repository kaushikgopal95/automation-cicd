
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    products: {
      id: string;
      name: string;
      price: number;
      image_url?: string;
      sku: string;
    } | null;
  };
}

export const CartItem = ({ item }: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', item.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update item quantity",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
      
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: "Could not remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!item.products) return null;

  return (
    <div className="flex space-x-4 p-4 bg-gray-800 rounded-lg" data-testid={`cart-item-${item.products.sku}`}>
      <img
        src={item.products.image_url || "/placeholder.svg"}
        alt={item.products.name}
        className="w-16 h-16 object-cover rounded"
        data-testid="cart-item-image"
      />
      
      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-gray-100" data-testid="cart-item-name">
          {item.products.name}
        </h3>
        <p className="text-green-400 font-semibold" data-testid="cart-item-price">
          ${item.products.price}
        </p>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="h-8 w-8 p-0 border-gray-600"
            data-testid="decrease-quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="min-w-[2rem] text-center" data-testid="cart-item-quantity">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.quantity + 1)}
            disabled={isUpdating}
            className="h-8 w-8 p-0 border-gray-600"
            data-testid="increase-quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col justify-between items-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={removeItem}
          disabled={isUpdating}
          className="text-red-400 hover:text-red-300 p-2"
          data-testid="remove-item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <p className="font-semibold text-gray-100" data-testid="cart-item-total">
          ${(item.products.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
