"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductFormData {
  name: string;
  price: number;
  manufacturingCost: number;
  shippingCost: number;
}

export function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    manufacturingCost: 0,
    shippingCost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, {
        ...formData,
        customCosts: products.find(p => p.id === editingId)?.customCosts || [],
      });
      setEditingId(null);
    } else {
      addProduct({
        ...formData,
        customCosts: [],
      });
    }
    setShowForm(false);
    setFormData({
      name: '',
      price: 0,
      manufacturingCost: 0,
      shippingCost: 0,
    });
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        manufacturingCost: product.manufacturingCost,
        shippingCost: product.shippingCost,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier le Produit' : 'Nouveau Produit'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du Produit</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix de Vente (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturingCost">Coût de Fabrication (€)</Label>
                  <Input
                    id="manufacturingCost"
                    type="number"
                    step="0.01"
                    value={formData.manufacturingCost || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturingCost: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Coût de Livraison (€)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={formData.shippingCost || ''}
                    onChange={(e) => setFormData({ ...formData, shippingCost: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      price: 0,
                      manufacturingCost: 0,
                      shippingCost: 0,
                    });
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Coût Fabrication</TableHead>
                <TableHead>Coût Livraison</TableHead>
                <TableHead>Marge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const margin = product.price - (product.manufacturingCost + product.shippingCost);
                const marginPercent = (margin / product.price) * 100;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toFixed(2)}€</TableCell>
                    <TableCell>{product.manufacturingCost.toFixed(2)}€</TableCell>
                    <TableCell>{product.shippingCost.toFixed(2)}€</TableCell>
                    <TableCell>
                      <span className={marginPercent >= 30 ? "text-green-500" : "text-red-500"}>
                        {marginPercent.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}