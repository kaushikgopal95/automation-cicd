import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  LogOut,
  Package,
  Calendar,
  DollarSign,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url?: string;
  };
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-yellow-900';
      case 'processing':
        return 'bg-blue-500 text-blue-900';
      case 'shipped':
        return 'bg-purple-500 text-purple-900';
      case 'delivered':
        return 'bg-green-500 text-green-900';
      case 'cancelled':
        return 'bg-red-500 text-red-900';
      default:
        return 'bg-gray-500 text-gray-900';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
            
            <h1 className="text-xl font-semibold">Profile</h1>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center gap-2 hover:bg-gray-800 text-red-400 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-green-600">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-green-600">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <p className="text-gray-100">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">User ID</label>
                      <p className="text-gray-100 text-sm font-mono">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Member Since</label>
                      <p className="text-gray-100">{formatDate(user.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Last Sign In</label>
                      <p className="text-gray-100">{formatDate(user.last_sign_in_at || user.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">Order History</CardTitle>
                  <p className="text-gray-400">Track your plant orders and delivery status</p>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">No orders yet</p>
                      <p className="text-gray-500 text-sm">Start shopping to see your order history here!</p>
                      <Button onClick={() => navigate('/')} className="mt-4">
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: Order) => (
                        <div key={order.id} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-100">
                                Order #{order.id.slice(0, 8)}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(order.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${order.total_amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            {order.order_items?.map((item: OrderItem) => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-700 rounded overflow-hidden">
                                    {item.products?.image_url ? (
                                      <img 
                                        src={item.products.image_url} 
                                        alt={item.products.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                        <span className="text-xs text-gray-400">-</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-sm">{item.products?.name}</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Shipping Address */}
                          {order.shipping_address && (
                            <div className="border-t border-gray-700 pt-4">
                              <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Shipping Address
                              </h4>
                              <p className="text-sm text-gray-300">
                                {order.shipping_address.street}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                                {order.shipping_address.country}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

