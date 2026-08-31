import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Account from "./pages/Account";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ShippingPolicy from "./pages/ShippingPolicy";
import Returns from "./pages/Returns";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminCustomers from "./pages/admin/Customers";
import AdminPayments from "./pages/admin/Payments";
import AdminContent from "./pages/admin/Content";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Storefront */}
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/account" element={<Account />} />

          {/* Info pages */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
