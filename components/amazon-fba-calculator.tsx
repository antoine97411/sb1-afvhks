"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Package, DollarSign, TrendingUp, Box, Truck, ShoppingCart, Percent, CircleDollarSign, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AmazonFbaCalculator() {
  // Informations produit
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [buyingPrice, setBuyingPrice] = useState<number>(0);
  const [category, setCategory] = useState('standard');

  // Coûts d'approvisionnement
  const [moq, setMoq] = useState<number>(0);
  const [shippingCostPerUnit, setShippingCostPerUnit] = useState<number>(0);
  const [customsDutyRate, setCustomsDutyRate] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(20);
  const [otherImportCosts, setOtherImportCosts] = useState<number>(0);

  // Dimensions et poids
  const [weight, setWeight] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [packagingWeight, setPackagingWeight] = useState<number>(0);

  // Prévisions de vente
  const [monthlyUnits, setMonthlyUnits] = useState<number>(0);
  const [seasonalityFactor, setSeasonalityFactor] = useState<number>(1);
  const [returnRate, setReturnRate] = useState<number>(2);
  const [stockingPeriod, setStockingPeriod] = useState<number>(3);

  // Marketing et autres coûts
  const [ppcBudgetPerUnit, setPpcBudgetPerUnit] = useState<number>(0);
  const [promotionalDiscountRate, setPromotionalDiscountRate] = useState<number>(0);
  const [otherMarketingCosts, setOtherMarketingCosts] = useState<number>(0);

  // Calculs de base
  const volume = (length * width * height) / 1000000; // m³
  const totalWeight = weight + packagingWeight; // kg

  // Calcul des coûts d'importation
  const calculateImportCosts = () => {
    const dutyAmount = buyingPrice * (customsDutyRate / 100);
    const vatAmount = (buyingPrice + dutyAmount) * (vatRate / 100);
    return {
      duty: dutyAmount,
      vat: vatAmount,
      total: dutyAmount + vatAmount + otherImportCosts
    };
  };

  // Calcul des frais Amazon
  const calculateReferralFee = (price: number): number => {
    const rate = category === 'standard' ? 0.15 : 0.20;
    return price * rate;
  };

  const calculateFBAFee = (weight: number, volume: number): number => {
    let baseFee = 2.70; // Frais de base
    
    // Frais selon le poids
    if (weight <= 0.5) {
      baseFee += 2.35;
    } else if (weight <= 1) {
      baseFee += 3.35;
    } else if (weight <= 2) {
      baseFee += 4.00;
    } else if (weight <= 5) {
      baseFee += 5.20;
    } else if (weight <= 10) {
      baseFee += 6.80;
    } else {
      baseFee += 6.80 + Math.ceil((weight - 10) / 5) * 1.50;
    }

    // Ajustement selon le volume
    if (volume > 0.04) { // Grand format
      baseFee *= 1.2;
    }

    return baseFee;
  };

  const calculateStorageFee = (volume: number, months: number): number => {
    const monthlyRatePerM3 = 30; // Taux mensuel par m³
    return volume * monthlyRatePerM3 * months;
  };

  // Calculs détaillés
  const importCosts = calculateImportCosts();
  const referralFee = calculateReferralFee(sellingPrice);
  const fbaFee = calculateFBAFee(totalWeight, volume);
  const monthlyStorageFee = calculateStorageFee(volume, stockingPeriod);
  
  // Coûts marketing et promotions
  const promotionalDiscount = sellingPrice * (promotionalDiscountRate / 100);
  const totalMarketingCosts = ppcBudgetPerUnit + otherMarketingCosts;

  // Coûts totaux par unité
  const landedCostPerUnit = buyingPrice + shippingCostPerUnit + (importCosts.total / moq);
  const amazonFeesPerUnit = referralFee + fbaFee + (monthlyStorageFee / monthlyUnits);
  const marketingCostPerUnit = totalMarketingCosts + promotionalDiscount;
  const returnCost = (fbaFee + referralFee) * (returnRate / 100);
  
  const totalCostPerUnit = landedCostPerUnit + amazonFeesPerUnit + marketingCostPerUnit + returnCost;
  const effectiveSellingPrice = sellingPrice * (1 - (promotionalDiscountRate / 100));
  const profitPerUnit = effectiveSellingPrice - totalCostPerUnit;
  const marginPercent = (profitPerUnit / effectiveSellingPrice) * 100;
  const monthlyProfit = profitPerUnit * monthlyUnits * seasonalityFactor;
  const roi = (profitPerUnit / landedCostPerUnit) * 100;

  const isRentable = marginPercent >= 30;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Calculateur Amazon FBA</h1>

      <Tabs defaultValue="product" className="space-y-8">
        <TabsList>
          <TabsTrigger value="product">Produit</TabsTrigger>
          <TabsTrigger value="costs">Coûts</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations Produit
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nom du Produit</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Accessoire Smartphone"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Prix de Vente (€)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyingPrice">Prix d'Achat (€)</Label>
                  <Input
                    id="buyingPrice"
                    type="number"
                    step="0.01"
                    value={buyingPrice || ''}
                    onChange={(e) => setBuyingPrice(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (15%)</SelectItem>
                    <SelectItem value="premium">Premium (20%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Box className="h-5 w-5" />
              Dimensions et Poids
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids Produit (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packagingWeight">Poids Emballage (kg)</Label>
                  <Input
                    id="packagingWeight"
                    type="number"
                    step="0.1"
                    value={packagingWeight || ''}
                    onChange={(e) => setPackagingWeight(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Longueur (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={length || ''}
                    onChange={(e) => setLength(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Largeur (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={width || ''}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Hauteur (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={height || ''}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Coûts d'Approvisionnement
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moq">Quantité Minimum (MOQ)</Label>
                  <Input
                    id="moq"
                    type="number"
                    value={moq || ''}
                    onChange={(e) => setMoq(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Frais de Port par Unité (€)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={shippingCostPerUnit || ''}
                    onChange={(e) => setShippingCostPerUnit(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customsDuty">Droits de Douane (%)</Label>
                  <Input
                    id="customsDuty"
                    type="number"
                    step="0.1"
                    value={customsDutyRate || ''}
                    onChange={(e) => setCustomsDutyRate(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">TVA (%)</Label>
                  <Input
                    id="vat"
                    type="number"
                    step="0.1"
                    value={vatRate || ''}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    placeholder="20.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherImportCosts">Autres Frais Import (€)</Label>
                  <Input
                    id="otherImportCosts"
                    type="number"
                    step="0.01"
                    value={otherImportCosts || ''}
                    onChange={(e) => setOtherImportCosts(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Prévisions et Gestion des Stocks
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyUnits">Ventes Mensuelles Estimées</Label>
                  <Input
                    id="monthlyUnits"
                    type="number"
                    value={monthlyUnits || ''}
                    onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seasonality">Facteur de Saisonnalité</Label>
                  <Input
                    id="seasonality"
                    type="number"
                    step="0.1"
                    value={seasonalityFactor || ''}
                    onChange={(e) => setSeasonalityFactor(Number(e.target.value))}
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnRate">Taux de Retour (%)</Label>
                  <Input
                    id="returnRate"
                    type="number"
                    step="0.1"
                    value={returnRate || ''}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    placeholder="2.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockingPeriod">Période de Stockage (mois)</Label>
                  <Input
                    id="stockingPeriod"
                    type="number"
                    value={stockingPeriod || ''}
                    onChange={(e) => setStockingPeriod(Number(e.target.value))}
                    placeholder="3"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Marketing et Promotions
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ppcBudget">Budget PPC par Unité (€)</Label>
                  <Input
                    id="ppcBudget"
                    type="number"
                    step="0.01"
                    value={ppcBudgetPerUnit || ''}
                    onChange={(e) => setPpcBudgetPerUnit(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotionalDiscount">Remise Promotionnelle (%)</Label>
                  <Input
                    id="promotionalDiscount"
                    type="number"
                    step="0.1"
                    value={promotionalDiscountRate || ''}
                    onChange={(e) => setPromotionalDiscountRate(Number(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherMarketing">Autres Coûts Marketing (€)</Label>
                <Input
                  id="otherMarketing"
                  type="number"
                  step="0.01"
                  value={otherMarketingCosts || ''}
                  onChange={(e) => setOtherMarketingCosts(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Décomposition des Coûts</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Coût d'Achat Landing</Label>
                  <p className="text-lg font-semibold">{landedCostPerUnit.toFixed(2)}€</p>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Frais Amazon</Label>
                  <p className="text-lg font-semibold">{amazonFeesPerUnit.toFixed(2)}€</p>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Coûts Marketing</Label>
                  <p className="text-lg font-semibold">{marketingCostPerUnit.toFixed(2)}€</p>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Coût des Retours</Label>
                  <p className="text-lg font-semibold">{returnCost.toFixed(2)}€</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label>Coût Total par Unité</Label>
                  <p className="text-xl font-bold">{totalCostPerUnit.toFixed(2)}€</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rentabilité</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Prix de Vente Effectif</Label>
                  <p className="text-lg font-semibold">{effectiveSellingPrice.toFixed(2)}€</p>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Bénéfice par Unité</Label>
                  <p className={`text-lg font-semibold ${profitPerUnit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitPerUnit.toFixed(2)}€
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Marge</Label>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-semibold ${marginPercent >= 30 ? 'text-green-500' : 'text-red-500'}`}>
                      {marginPercent.toFixed(1)}%
                    </p>
                    <Badge variant={marginPercent >= 30 ? "default" : "destructive"}>
                      {marginPercent >= 30 ? "Bon" : "Faible"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Label>ROI</Label>
                  <p className="text-lg font-semibold">{roi.toFixed(1)}%</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label>Bénéfice Mensuel Estimé</Label>
                  <p className={`text-xl font-bold ${monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {monthlyProfit.toFixed(2)}€
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Alert variant={isRentable ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isRentable ? "Produit Rentable" : "Attention"}
            </AlertTitle>
            <AlertDescription>
              {isRentable
                ? `Ce produit est rentable avec une marge de ${marginPercent.toFixed(1)}% et un ROI de ${roi.toFixed(1)}%.`
                : `La marge est trop faible. Visez une marge d'au moins 30% pour assurer la rentabilité.`}
              <ul className="mt-2 list-disc list-inside">
                <li>Coût total par unité: {totalCostPerUnit.toFixed(2)}€</li>
                <li>Prix de vente effectif: {effectiveSellingPrice.toFixed(2)}€</li>
                <li>Bénéfice mensuel estimé: {monthlyProfit.toFixed(2)}€</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}