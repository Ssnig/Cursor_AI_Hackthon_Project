import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  HandHeart,
  Home,
  Leaf,
  LogOut,
  MapPinned,
  Menu,
  PackageCheck,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/surplus", label: "Surplus", icon: ClipboardList },
  { to: "/matching", label: "Matching", icon: MapPinned },
  { to: "/rescue", label: "Rescue", icon: PackageCheck },
  { to: "/impact", label: "Impact", icon: BarChart3 }
];

function Brand({ restaurantName }: { restaurantName?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Leaf className="h-6 w-6" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight">FoodLoop</p>
        <p className="text-xs font-medium text-muted-foreground">
          {restaurantName || "Surplus rescue dashboard"}
        </p>
      </div>
    </div>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="grid gap-2" aria-label="FoodLoop navigation">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground",
                isActive && "bg-secondary text-secondary-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function OwnerCard() {
  const navigate = useNavigate();
  const { user, business, logout } = useFoodLoop();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mt-auto rounded-3xl border bg-secondary/60 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-background text-primary">
        <HandHeart className="h-5 w-5" />
      </div>
      <p className="text-sm font-bold">{business?.name || "Your restaurant"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {user?.name} · {user?.email}
      </p>
      <Button
        className="mt-3 w-full justify-start gap-2"
        size="sm"
        variant="outline"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
}

export default function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { business } = useFoodLoop();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r bg-card/75 p-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Brand restaurantName={business?.name} />
        <div className="mt-10">
          <Navigation />
        </div>
        <OwnerCard />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Brand restaurantName={business?.name} />
            <Button
              aria-label="Toggle navigation"
              size="sm"
              variant="outline"
              onClick={() => setIsMobileOpen((value) => !value)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          {isMobileOpen ? (
            <div className="mt-4 space-y-3 rounded-3xl border bg-card p-3 shadow-xl">
              <Navigation onNavigate={() => setIsMobileOpen(false)} />
              <OwnerCard />
            </div>
          ) : null}
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
