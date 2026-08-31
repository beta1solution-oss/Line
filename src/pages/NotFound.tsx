import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-widest uppercase mb-3">404</p>
        <h1 className="font-display text-4xl lg:text-5xl font-light tracking-wide mb-3">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary text-xs px-8 py-3.5">Go Home</Link>
          <Link to="/shop" className="btn-secondary text-xs px-8 py-3.5">Shop Collection</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
