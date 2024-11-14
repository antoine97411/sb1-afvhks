"use client";

import { LayoutDashboard, Calculator, Target, Gift, Package, ShoppingBag, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: 'Produits',
    icon: Package,
    href: '/products',
  },
  {
    title: 'Calculateur de Coûts',
    icon: Calculator,
    href: '/costs',
  },
  {
    title: 'Meta Ads',
    icon: Target,
    href: '/meta-ads',
  },
  {
    title: 'Amazon FBA',
    icon: ShoppingBag,
    href: '/amazon-fba',
  },
  {
    title: 'Promotions',
    icon: Gift,
    href: '/promotions',
  },
  {
    title: 'Optimisation Images',
    icon: Image,
    href: '/image-optimizer',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-64 border-r h-screen bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted"
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}