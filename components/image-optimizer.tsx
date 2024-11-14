'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Image as ImageIcon,
  Upload,
  Download,
  Trash2,
  Settings,
  CheckSquare,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  optimizedUrl?: string;
  originalSize: number;
  optimizedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  width?: number;
  height?: number;
  error?: string;
}

export function ImageOptimizer() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [format, setFormat] = useState<'webp' | 'jpeg' | 'png'>('jpeg');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'pending' as const,
      progress: 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: true,
  });

  const detectBrowser = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (
      userAgent.indexOf('safari') !== -1 &&
      userAgent.indexOf('chrome') === -1
    ) {
      return 'safari';
    }
    return 'other';
  };

  const optimizeImage = async (imageFile: ImageFile) => {
    try {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id ? { ...img, status: 'processing' } : img
        )
      );

      const browser = detectBrowser();
      const isSafari = browser === 'safari';

      // Ajustement des options pour Safari
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: !isSafari, // Désactivé pour Safari
        fileType: `image/${format}`,
        quality: isSafari ? Math.min(quality / 100, 0.9) : quality / 100, // Limite à 0.9 pour Safari
        initialQuality: isSafari ? 0.9 : quality / 100,
        alwaysKeepResolution: true,
        onProgress: (progress: number) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageFile.id ? { ...img, progress } : img
            )
          );
        },
      };

      // Pré-traitement pour Safari
      let imageToCompress = imageFile.file;
      if (isSafari) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = URL.createObjectURL(imageFile.file);
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), `image/${format}`, quality / 100);
        });

        imageToCompress = new File([blob], imageFile.file.name, {
          type: `image/${format}`,
        });
      }

      const compressedFile = await imageCompression(imageToCompress, options);
      const optimizedUrl = URL.createObjectURL(compressedFile);

      // Get dimensions
      const img = new Image();
      img.src = optimizedUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id
            ? {
                ...img,
                optimizedUrl,
                optimizedSize: compressedFile.size,
                status: 'completed',
                progress: 100,
                width: img.width,
                height: img.height,
              }
            : img
        )
      );
    } catch (error) {
      console.error("Erreur d'optimisation:", error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id
            ? { ...img, status: 'error', error: (error as Error).message }
            : img
        )
      );
    }
  };

  const optimizeAll = () => {
    const imagesToOptimize =
      selectedImages.length > 0
        ? images.filter(
            (img) => selectedImages.includes(img.id) && img.status === 'pending'
          )
        : images.filter((img) => img.status === 'pending');

    imagesToOptimize.forEach((img) => optimizeImage(img));
  };

  const downloadImage = (imageFile: ImageFile) => {
    if (imageFile.optimizedUrl) {
      const link = document.createElement('a');
      link.href = imageFile.optimizedUrl;
      link.download = `optimized-${
        imageFile.file.name.split('.')[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadSelected = () => {
    const imagesToDownload =
      selectedImages.length > 0
        ? images.filter(
            (img) =>
              selectedImages.includes(img.id) && img.status === 'completed'
          )
        : images.filter((img) => img.status === 'completed');

    imagesToDownload.forEach((img) => downloadImage(img));
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImages((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const removeSelected = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.id));
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (original: number, optimized?: number) => {
    if (!optimized) return 0;
    return ((original - optimized) / original) * 100;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Optimisation d'Images</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Paramètres d'Optimisation</SheetTitle>
              <SheetDescription>
                Configurez les paramètres de compression et de redimensionnement
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label>Qualité de Compression</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    min={1}
                    max={100}
                    step={1}
                  />
                  <span className="w-12 text-right">{quality}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Format de Sortie</Label>
                <Select
                  value={format}
                  onValueChange={(value: 'webp' | 'jpeg' | 'png') =>
                    setFormat(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="advanced"
                    checked={isAdvancedMode}
                    onCheckedChange={(checked) =>
                      setIsAdvancedMode(checked as boolean)
                    }
                  />
                  <Label htmlFor="advanced">Mode Avancé</Label>
                </div>

                {isAdvancedMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Largeur Max</Label>
                      <Input
                        type="number"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hauteur Max</Label>
                      <Input
                        type="number"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            {isDragActive
              ? 'Déposez les images ici...'
              : 'Glissez-déposez vos images ici, ou cliquez pour sélectionner'}
          </p>
        </div>
      </Card>

      {images.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                Images ({images.length})
              </h2>
              {selectedImages.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length} sélectionnée(s)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedImages.length > 0 && (
                <>
                  <Button variant="outline" onClick={removeSelected}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer la sélection
                  </Button>
                  <Button variant="outline" onClick={downloadSelected}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger la sélection
                  </Button>
                </>
              )}
              <Button onClick={optimizeAll}>
                <Upload className="mr-2 h-4 w-4" />
                {selectedImages.length > 0
                  ? 'Optimiser la sélection'
                  : 'Tout Optimiser'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedImages.length === images.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Aperçu</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Taille Originale</TableHead>
                  <TableHead>Taille Optimisée</TableHead>
                  <TableHead>Réduction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={image.preview}
                        alt="preview"
                        className="h-12 w-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>{image.file.name}</TableCell>
                    <TableCell>
                      {image.width && image.height
                        ? `${image.width}x${image.height}`
                        : '-'}
                    </TableCell>
                    <TableCell>{formatBytes(image.originalSize)}</TableCell>
                    <TableCell>
                      {image.optimizedSize
                        ? formatBytes(image.optimizedSize)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {image.optimizedSize && (
                        <span className="text-green-500">
                          {calculateSavings(
                            image.originalSize,
                            image.optimizedSize
                          ).toFixed(1)}
                          %
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {image.status === 'processing' && (
                        <div className='w-full h-2 border rounded relative inset-0 overflow-hidden'>
                        <div className="h-full absolute" style={{width: `${image.progress}%`, backgroundColor: "#ffffff"}}></div>
                      </div>
                      )}
                      {image.status === 'completed' && (
                        <span className="text-green-500">Terminé</span>
                      )}
                      {image.status === 'error' && (
                        <span className="text-red-500">Erreur</span>
                      )}
                      {image.status === 'pending' && (
                        <span className="text-muted-foreground">
                          En attente
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {image.status === 'pending' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => optimizeImage(image)}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                        {image.status === 'completed' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => downloadImage(image)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
