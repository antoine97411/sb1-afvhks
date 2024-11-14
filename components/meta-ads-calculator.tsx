"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Settings,
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  AlertCircle,
  Percent,
  CreditCard,
  Wallet,
  Users,
} from 'lucide-react';

export function MetaAdsCalculator() {
  const [budget, setBudget] = useState<number>(0);
  const [costPerClick, setCostPerClick] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(2);
  const [averageCartValue, setAverageCartValue] = useState<number>(50);
  const [productCost, setProductCost] = useState<number>(0);
  const [targetRoas, setTargetRoas] = useState<number>(2);
  const [targetMargin, setTargetMargin] = useState<number>(30);

  // Safe division function to prevent NaN
  const safeDivide = (numerator: number, denominator: number, fallback: number = 0): number => {
    if (!denominator || isNaN(numerator) || isNaN(denominator)) return fallback;
    return numerator / denominator;
  };

  // Calculations with safety checks
  const clicks = safeDivide(budget, costPerClick);
  const conversions = Math.floor(clicks * (conversionRate / 100));
  const revenue = conversions * averageCartValue;
  const adCost = budget;
  const productCosts = conversions * productCost;
  const totalCosts = adCost + productCosts;
  const profit = revenue - totalCosts;
  const roas = safeDivide(revenue, budget);
  const margin = safeDivide(profit, revenue) * 100;
  const minimumRoas = safeDivide(100, 100 - targetMargin);
  const maxCpc = safeDivide(averageCartValue * (conversionRate / 100), targetRoas);

  const colorRed = '#f26969';
  const colorGreen = '#22c55e';

  const getMetricColor = (value: number, target: number): string => {
    if (isNaN(value) || isNaN(target)) return "";
    return value >= target ? colorGreen : colorRed;
  };

  const formatNumber = (value: number, decimals: number = 2): string => {
    if (isNaN(value) || !isFinite(value)) return "0";
    return value.toFixed(decimals);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calculateur Meta Ads</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Objectifs de Performance</SheetTitle>
              <SheetDescription>
                Définissez vos objectifs de rentabilité pour la campagne
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="targetRoas">Objectif de ROAS</Label>
                <Input
                  id="targetRoas"
                  type="number"
                  step="0.1"
                  min="0"
                  value={targetRoas || ''}
                  onChange={(e) => setTargetRoas(Number(e.target.value))}
                  placeholder="2"
                />
                <p className="text-sm text-muted-foreground">
                  Recommandé: 2x minimum
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMargin">Objectif de Marge (%)</Label>
                <Input
                  id="targetMargin"
                  type="number"
                  min="0"
                  max="100"
                  value={targetMargin || ''}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  placeholder="30"
                />
                <p className="text-sm text-muted-foreground">
                  Recommandé: 30% minimum
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Métriques Publicitaires
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Publicitaire (€)</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="1"
                    min="0"
                    value={budget || ''}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerClick">Coût par Clic (€)</Label>
                  <Input
                    id="costPerClick"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPerClick || ''}
                    onChange={(e) => setCostPerClick(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversionRate">Taux de Conversion (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={conversionRate || ''}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Informations Vente
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="averageCartValue">Panier Moyen (€)</Label>
                  <Input
                    id="averageCartValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={averageCartValue || ''}
                    onChange={(e) => setAverageCartValue(Number(e.target.value))}
                    placeholder="50.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCost">Coût Produit (€)</Label>
                  <Input
                    id="productCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productCost || ''}
                    onChange={(e) => setProductCost(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4">
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">ROAS</h3>
                </div>
                <Badge variant={roas >= targetRoas ? "default" : "destructive"}>
                  Objectif: {formatNumber(targetRoas)}x
                </Badge>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold" style={{color: getMetricColor(roas, targetRoas)}}>
                  {formatNumber(roas)}x
                </span>
              </div>
              <div className='w-full h-2 border rounded relative inset-0 overflow-hidden'>
                <div className="h-full absolute" style={{width: `${safeDivide(roas * 100, targetRoas)}%`, backgroundColor: getMetricColor(roas, targetRoas)}}></div>
              </div>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Percent className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Marge</h3>
                </div>
                <Badge variant={margin >= targetMargin ? "default" : "destructive"}>
                  Objectif: {formatNumber(targetMargin)}%
                </Badge>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold" style={{color: getMetricColor(margin, targetMargin)}}>
                  {formatNumber(margin)}%
                </span>
              </div>
              <div className='w-full h-2 border rounded relative inset-0 overflow-hidden'>
                <div className="h-full delay-100 absolute" style={{width: `${safeDivide(margin * 100, targetMargin)}%`, backgroundColor: getMetricColor(margin, targetMargin)}}></div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Visites Estimées</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{Math.max(0, Math.floor(clicks))}</span>
                  <span className="text-sm text-muted-foreground">visiteurs</span>
                </div>
              </Card>

              <Card className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Ventes Estimées</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{Math.max(0, conversions)}</span>
                  <span className="text-sm text-muted-foreground">ventes</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">CA Total</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{formatNumber(revenue)}€</span>
                </div>
              </Card>

              <Card className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Bénéfice</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold" style={{color: profit >= 0 ? colorGreen : colorRed}}>
                    {formatNumber(profit)}€
                  </span>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
            <div className="space-y-4">
              <div>
                <Label>CPC Maximum Recommandé</Label>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{formatNumber(maxCpc)}€</span>
                  <span className="text-sm text-muted-foreground">par clic</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Pour atteindre un ROAS de {formatNumber(targetRoas)}x
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Label>ROAS Minimum Requis</Label>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{formatNumber(minimumRoas)}x</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Pour maintenir une marge de {formatNumber(targetMargin)}%
                </p>
              </div>
            </div>
          </Card>

          <Alert variant={margin >= targetMargin ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {margin >= targetMargin ? "Campagne Rentable" : "Attention"}
            </AlertTitle>
            <AlertDescription>
              {margin >= targetMargin
                ? `La campagne est rentable avec une marge de ${formatNumber(margin)}% et un ROAS de ${formatNumber(roas)}x.`
                : `La campagne n'est pas assez rentable. Visez un ROAS minimum de ${formatNumber(minimumRoas)}x pour maintenir une marge de ${formatNumber(targetMargin)}%.`}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}