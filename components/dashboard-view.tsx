"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Calculator, Target, Gift, ShoppingBag } from 'lucide-react';

export function DashboardView() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/costs')}>
          <Calculator className="h-12 w-12 mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Calculateur de Coûts</h2>
          <p className="text-muted-foreground">
            Analysez la rentabilité de vos produits en calculant tous les coûts associés.
          </p>
          <Button className="mt-4">Accéder</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/meta-ads')}>
          <Target className="h-12 w-12 mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Meta Ads</h2>
          <p className="text-muted-foreground">
            Calculez votre CPA optimal et analysez la performance de vos campagnes Meta Ads.
          </p>
          <Button className="mt-4">Accéder</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/amazon-fba')}>
          <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Amazon FBA</h2>
          <p className="text-muted-foreground">
            Calculez la rentabilité de vos produits sur Amazon FBA avec tous les frais inclus.
          </p>
          <Button className="mt-4">Accéder</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/promotions')}>
          <Gift className="h-12 w-12 mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Promotions</h2>
          <p className="text-muted-foreground">
            Calculez la rentabilité de vos offres BOGO et packs promotionnels.
          </p>
          <Button className="mt-4">Accéder</Button>
        </Card>
      </div>
    </div>
  );
}