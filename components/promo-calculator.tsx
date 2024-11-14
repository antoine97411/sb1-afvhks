"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStore } from '@/lib/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

export function PromoCalculator() {
  const { productCosts, setProductCosts } = useStore();
  const [promoType, setPromoType] = useState('bogo');
  const [packSize, setPackSize] = useState('3');
  const [packDiscount, setPackDiscount] = useState('20');
  const [bogoFreeItems, setBogoFreeItems] = useState('1');
  const [bogoPaidItems, setBogoPaidItems] = useState('2');

  const calculatePromoMetrics = () => {
    const { sellingPrice, manufacturingCost, shippingCost } = productCosts;
    const totalCost = manufacturingCost + shippingCost;
    
    if (promoType === 'bogo') {
      const paid = Number(bogoPaidItems);
      const free = Number(bogoFreeItems);
      const total = paid + free;
      
      const revenue = sellingPrice * paid;
      const costs = totalCost * total;
      const normalRevenue = sellingPrice * total;
      const discount = ((normalRevenue - revenue) / normalRevenue) * 100;
      const profit = revenue - costs;
      const margin = (profit / revenue) * 100;
      const costPerUnit = costs / total;
      const effectivePrice = revenue / total;

      return {
        revenue,
        costs,
        profit,
        margin,
        discount,
        costPerUnit,
        effectivePrice,
        unitsOffered: total,
        unitsPaid: paid,
      };
    } else {
      const size = Number(packSize);
      const discountPercent = Number(packDiscount);
      const packPrice = (sellingPrice * size) * (1 - discountPercent / 100);
      
      const revenue = packPrice;
      const costs = totalCost * size;
      const normalRevenue = sellingPrice * size;
      const profit = revenue - costs;
      const margin = (profit / revenue) * 100;
      const costPerUnit = costs / size;
      const effectivePrice = revenue / size;

      return {
        revenue,
        costs,
        profit,
        margin,
        discount: discountPercent,
        costPerUnit,
        effectivePrice,
        unitsOffered: size,
        unitsPaid: size,
      };
    }
  };

  const metrics = calculatePromoMetrics();
  const isRentable = metrics.margin >= 30;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Calculateur d'Offres Promotionnelles</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nom du Produit</Label>
                <Input
                  id="productName"
                  value={productCosts.productName}
                  onChange={(e) => setProductCosts({ productName: e.target.value })}
                  placeholder="Ex: T-shirt Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Prix de Vente Normal (€)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  value={productCosts.sellingPrice || ''}
                  onChange={(e) => setProductCosts({ sellingPrice: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturingCost">Coût de Fabrication (€)</Label>
                  <Input
                    id="manufacturingCost"
                    type="number"
                    value={productCosts.manufacturingCost || ''}
                    onChange={(e) => setProductCosts({ manufacturingCost: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Coût de Livraison (€)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={productCosts.shippingCost || ''}
                    onChange={(e) => setProductCosts({ shippingCost: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Offre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Type d'Offre</Label>
                <Select value={promoType} onValueChange={setPromoType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type d'offre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bogo">BOGO (Buy X Get Y Free)</SelectItem>
                    <SelectItem value="pack">Pack Promotionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {promoType === 'bogo' ? (
                <>
                  <div className="space-y-2">
                    <Label>Articles Payés</Label>
                    <Select value={bogoPaidItems} onValueChange={setBogoPaidItems}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre d'articles payés" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 article</SelectItem>
                        <SelectItem value="2">2 articles</SelectItem>
                        <SelectItem value="3">3 articles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Articles Offerts</Label>
                    <Select value={bogoFreeItems} onValueChange={setBogoFreeItems}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre d'articles offerts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 article</SelectItem>
                        <SelectItem value="2">2 articles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Taille du Pack</Label>
                    <Select value={packSize} onValueChange={setPackSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre d'articles dans le pack" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 articles</SelectItem>
                        <SelectItem value="3">3 articles</SelectItem>
                        <SelectItem value="4">4 articles</SelectItem>
                        <SelectItem value="5">5 articles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Réduction Pack (%)</Label>
                    <Select value={packDiscount} onValueChange={setPackDiscount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pourcentage de réduction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de Rentabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Métrique</TableHead>
                    <TableHead className="text-right">Valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Prix Normal</TableCell>
                    <TableCell className="text-right">
                      {(productCosts.sellingPrice * metrics.unitsOffered).toFixed(2)}€
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Prix Promotionnel</TableCell>
                    <TableCell className="text-right">{metrics.revenue.toFixed(2)}€</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Réduction</TableCell>
                    <TableCell className="text-right">{metrics.discount.toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Prix Effectif par Unité</TableCell>
                    <TableCell className="text-right">{metrics.effectivePrice.toFixed(2)}€</TableCell>
                  </TableRow>
                  <Separator />
                  <TableRow>
                    <TableCell>Coût Total</TableCell>
                    <TableCell className="text-right">{metrics.costs.toFixed(2)}€</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bénéfice</TableCell>
                    <TableCell className="text-right">
                      <span className={metrics.profit >= 0 ? "text-green-500" : "text-red-500"}>
                        {metrics.profit.toFixed(2)}€
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marge</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={isRentable ? "default" : "destructive"}>
                        {metrics.margin.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert variant={isRentable ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isRentable ? "Offre Rentable" : "Attention"}
            </AlertTitle>
            <AlertDescription className="space-y-2">
              {isRentable ? (
                <p>Cette offre maintient une marge satisfaisante tout en restant attractive pour les clients.</p>
              ) : (
                <p>La marge est inférieure au seuil recommandé de 30%. Considérez d'ajuster les paramètres de l'offre.</p>
              )}
              <HoverCard>
                <HoverCardTrigger className="cursor-help">
                  <p className="font-medium">Recommandations →</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>BOGO: Privilégiez un ratio "payés/offerts" d'au moins 2:1</li>
                    <li>Packs: Maintenez la réduction en dessous de 25% pour les packs de 3 articles ou plus</li>
                    <li>Visez une marge minimale de 30% sur le total de l'offre</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}