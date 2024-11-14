"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CustomCost {
  id: string;
  name: string;
  value: number;
}

export function Calculator() {
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [manufacturingCost, setManufacturingCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [customCosts, setCustomCosts] = useState<CustomCost[]>([]);
  const [newCostName, setNewCostName] = useState('');
  const [newCostValue, setNewCostValue] = useState(0);

  const addCustomCost = () => {
    if (newCostName && newCostValue > 0) {
      setCustomCosts([
        ...customCosts,
        { id: Date.now().toString(), name: newCostName, value: newCostValue }
      ]);
      setNewCostName('');
      setNewCostValue(0);
    }
  };

  const removeCustomCost = (id: string) => {
    setCustomCosts(customCosts.filter(cost => cost.id !== id));
  };

  const totalCustomCosts = customCosts.reduce((sum, cost) => sum + cost.value, 0);
  const totalCosts = manufacturingCost + shippingCost + totalCustomCosts;
  const profit = sellingPrice - totalCosts;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const costRatio = totalCosts > 0 ? (totalCosts / sellingPrice) * 100 : 0;
  const isRentable = costRatio <= 30;
  const minimumPrice = totalCosts / 0.3; // Prix minimum pour avoir un ratio de coût de 30%
  
  // Prix psychologique suggéré (exemple de logique)
  const suggestedPrice = Math.ceil(minimumPrice / 5) * 5 - 0.1;

  const costData = [
    { name: 'Fabrication', value: manufacturingCost },
    { name: 'Livraison', value: shippingCost },
    ...customCosts.map(cost => ({ name: cost.name, value: cost.value }))
  ].filter(item => item.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Calculateur de Coûts</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Nom du Produit</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: T-shirt Premium"
              />
            </div>
            
            <div>
              <Label htmlFor="sellingPrice">Prix de Vente (€)</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturingCost">Coût de Fabrication (€)</Label>
                <Input
                  id="manufacturingCost"
                  type="number"
                  value={manufacturingCost || ''}
                  onChange={(e) => setManufacturingCost(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="shippingCost">Coût de Livraison (€)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  value={shippingCost || ''}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Coûts Additionnels</Label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du coût"
                  value={newCostName}
                  onChange={(e) => setNewCostName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Montant"
                  value={newCostValue || ''}
                  onChange={(e) => setNewCostValue(Number(e.target.value))}
                />
                <Button onClick={addCustomCost} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {customCosts.map((cost) => (
                  <div key={cost.id} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>{cost.name}</span>
                    <div className="flex items-center gap-2">
                      <span>{cost.value.toFixed(2)}€</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomCost(cost.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Coût Total</Label>
                  <p className="text-2xl font-bold">{totalCosts.toFixed(2)}€</p>
                </div>
                <div>
                  <Label>Ratio Coût/Prix</Label>
                  <p className={`text-2xl font-bold ${costRatio <= 30 ? 'text-green-500' : 'text-red-500'}`}>
                    {costRatio.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <Label>Bénéfice</Label>
                  <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profit.toFixed(2)}€
                  </p>
                </div>
                <div>
                  <Label>Marge</Label>
                  <p className={`text-2xl font-bold ${margin >= 30 ? 'text-green-500' : 'text-red-500'}`}>
                    {margin.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Prix Minimum Recommandé</Label>
                <p className="text-xl font-semibold">{minimumPrice.toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">
                  Pour maintenir un ratio coût/prix de 30%
                </p>
              </div>

              <div className="pt-4 border-t">
                <Label>Prix Psychologique Suggéré</Label>
                <p className="text-xl font-semibold">{suggestedPrice.toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">
                  Prix optimisé pour la perception client
                </p>
              </div>

              {costData.length > 0 && (
                <div className="h-[300px] mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {costData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}€`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>

          <Alert variant={isRentable ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isRentable ? "Coûts Maîtrisés" : "Attention"}
            </AlertTitle>
            <AlertDescription>
              {isRentable
                ? "Le ratio coût/prix est inférieur au seuil recommandé de 30%."
                : "Le ratio coût/prix dépasse le seuil recommandé de 30%. Considérez d'augmenter le prix de vente ou de réduire les coûts."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}