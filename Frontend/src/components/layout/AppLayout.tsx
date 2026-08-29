import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, ClipboardList, Home, Leaf, MapPinned, Menu, PackageCheck, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/surplus", label: "Surplus", icon: ClipboardList },
  { to: "/matching", label: "Matching", icon: MapPinned },
  { to: "/rescue", label: "Rescue", icon: PackageCheck },
  { to: "/impact", label: "Impact", icon: BarChart3 }
];

function Brand() {
  return <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Leaf /></div><div><p className="text-lg font-black">FoodLoop</p><p className="text-xs text-muted-foreground">Surplus rescue dashboard</p></div></div>;
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return <nav className="grid gap-2">{navItems.map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => cn("flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-secondary-foreground", isActive && "bg-secondary text-secondary-foreground")}><Icon className="h-5 w-5" />{item.label}</NavLink>; })}</nav>;
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]"><aside className="hidden border-r bg-card/80 p-6 lg:flex lg:min-h-screen lg:flex-col"><Brand /><div className="mt-10"><Navigation /></div><div className="mt-auto rounded-3xl bg-secondary p-4 text-sm text-secondary-foreground"><strong>Mock-first MVP</strong><p className="mt-1 text-muted-foreground">Ready for future API integration.</p></div></aside><div><header className="sticky top-0 z-20 border-b bg-background/90 p-4 backdrop-blur lg:hidden"><div className="flex items-center justify-between"><Brand /><Button variant="outline" size="sm" onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button></div>{open && <div className="mt-4 rounded-3xl border bg-card p-3"><Navigation onNavigate={() => setOpen(false)} /></div>}</header><main className="p-4 sm:p-6 lg:p-10"><Outlet /></main></div></div>;
}
