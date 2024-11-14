import { Calculator, Settings } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calculator className="h-6 w-6" />
            <h1 className="text-xl font-bold">Calculateur de Rentabilité</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <button className="p-2 hover:bg-accent rounded-full">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}