import { useState } from "react";
import { Package, User, MapPin, LogOut } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCustomerOrders } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

type Tab = "orders" | "profile" | "addresses";

export default function Account() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.includes("@")) {
      setLoginError("Please enter a valid email address");
      return;
    }
    const orders = getCustomerOrders(loginEmail);
    setEmail(loginEmail);
    setLoggedIn(true);
    setLoginError("");
    console.log("Customer logged in:", loginEmail, "Orders found:", orders.length);
  };

  const orders = loggedIn ? getCustomerOrders(email) : [];

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 py-16">
          <div className="max-w-md mx-auto px-4">
            <h1 className="font-display text-3xl font-light tracking-wide text-center mb-2">My Account</h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Enter your email to access your orders and account details.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                />
                {loginError && <p className="text-destructive text-xs mt-1">{loginError}</p>}
              </div>
              <button type="submit" className="btn-primary w-full py-3.5 text-xs">
                Access My Account
              </button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Don't have an account? <Link to="/shop" className="underline hover:text-foreground">Start shopping</Link> and your account will be created automatically at checkout.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
    { id: "orders", label: "Orders", Icon: Package },
    { id: "profile", label: "Profile", Icon: User },
    { id: "addresses", label: "Addresses", Icon: MapPin },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-10 lg:py-14">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-light tracking-wide">My Account</h1>
              <p className="text-muted-foreground text-sm mt-1">{email}</p>
            </div>
            <button
              onClick={() => setLoggedIn(false)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-7">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-medium tracking-wider uppercase transition-colors min-h-[44px] ${
                  tab === id
                    ? "border-b-2 border-[hsl(var(--brand-charcoal))] text-[hsl(var(--brand-charcoal))] -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Orders tab */}
          {tab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-16 border border-border">
                  <Package className="w-10 h-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                  <p className="font-display text-xl font-light mb-2">No orders yet</p>
                  <p className="text-sm text-muted-foreground mb-5">Your order history will appear here</p>
                  <Link to="/shop" className="btn-primary text-xs px-8">Shop the Collection</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border p-5">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <p className="font-medium text-sm">Order #{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 ${
                            order.paymentStatus === "Paid" ? "bg-green-50 text-green-700" : "bg-[hsl(var(--muted))] text-muted-foreground"
                          }`}>{order.paymentStatus}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-[hsl(var(--muted))] text-muted-foreground">{order.fulfillmentStatus}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <div className="w-10 h-12 bg-muted overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-medium leading-tight">{item.productName}</p>
                              <p className="text-[10px] text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                        <Link
                          to={`/tracking?order=${order.orderNumber}`}
                          className="text-xs font-medium text-[hsl(var(--brand-terracotta))] hover:underline"
                        >
                          Track Order →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile tab */}
          {tab === "profile" && (
            <div className="max-w-md">
              <p className="text-sm text-muted-foreground mb-5">
                Account details are managed automatically based on your checkout information.
              </p>
              <div className="space-y-3 border border-border p-5">
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">Email</label>
                  <p className="text-sm font-medium mt-0.5">{email}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    To update your email or contact information, please <Link to="/contact" className="underline hover:text-foreground">contact us</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Addresses tab */}
          {tab === "addresses" && (
            <div className="max-w-md">
              {orders.length > 0 ? (
                <div className="border border-border p-5">
                  <p className="text-xs text-muted-foreground mb-3 font-semibold tracking-wider uppercase">Last Used Address</p>
                  <p className="text-sm font-medium">{orders[0].customer.firstName} {orders[0].customer.lastName}</p>
                  <p className="text-sm text-muted-foreground">{orders[0].customer.addressLine1}</p>
                  {orders[0].customer.addressLine2 && (
                    <p className="text-sm text-muted-foreground">{orders[0].customer.addressLine2}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {orders[0].customer.city}, {orders[0].customer.state} {orders[0].customer.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{orders[0].customer.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No saved addresses yet. Complete a checkout to save your address.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
