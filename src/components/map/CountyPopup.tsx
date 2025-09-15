import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Users, Grid3x3, Building2 } from "lucide-react";
import { CountyData } from "@/types/county";
import { motion } from "framer-motion";

interface CountyPopupProps {
  county: CountyData;
  onClose: () => void;
  position: { x: number; y: number };
}

export const CountyPopup = ({ county, onClose, position }: CountyPopupProps) => {
  // Mock additional data for demonstration
  const mockData = {
    population: Math.floor(Math.random() * 2000000) + 100000,
    area: Math.floor(Math.random() * 50000) + 5000,
    capital: getCountyCapital(county.shapeName),
    description: `${county.shapeName} County is one of Kenya's 47 counties, known for its unique landscape and cultural heritage.`
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed z-50 pointer-events-auto"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
    >
      <Card className="w-96 shadow-popup bg-card/95 backdrop-blur-sm border-primary/20">
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-kenya-green flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {county.shapeName} County
              </CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs">
                {county.shapeISO}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mockData.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-kenya-green" />
                <span className="font-medium">Population</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {mockData.population.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Grid3x3 className="h-4 w-4 text-kenya-green" />
                <span className="font-medium">Area</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {mockData.area.toLocaleString()} km²
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-kenya-green" />
              <span className="font-medium">County Headquarters</span>
            </div>
            <p className="text-base font-medium text-foreground">
              {mockData.capital}
            </p>
          </div>
          
          <div className="pt-2 border-t border-border">
            <Badge variant="outline" className="text-xs">
              Administrative Level: {county.shapeType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function getCountyCapital(countyName: string): string {
  const capitals: Record<string, string> = {
    'Nairobi': 'Nairobi',
    'Mombasa': 'Mombasa',
    'Turkana': 'Lodwar',
    'Marsabit': 'Marsabit',
    'Wajir': 'Wajir',
    'Mandera': 'Mandera',
    'Isiolo': 'Isiolo',
    'Garissa': 'Garissa',
    'Tana River': 'Hola',
    'Lamu': 'Lamu',
    'Taita Taveta': 'Voi',
    'Kwale': 'Kwale',
    'Kilifi': 'Kilifi',
    'Makueni': 'Wote',
    'Machakos': 'Machakos',
    'Kitui': 'Kitui',
    'Embu': 'Embu',
    'Tharaka Nithi': 'Kathwana',
    'Meru': 'Meru',
    'Nyeri': 'Nyeri',
    'Kirinyaga': 'Kerugoya',
    'Murang\'a': 'Murang\'a',
    'Kiambu': 'Kiambu',
    'Nakuru': 'Nakuru',
    'Kajiado': 'Kajiado',
    'Kericho': 'Kericho',
    'Bomet': 'Bomet',
    'Narok': 'Narok',
    'Samburu': 'Maralal',
    'Trans Nzoia': 'Kitale',
    'Uasin Gishu': 'Eldoret',
    'Elgeyo Marakwet': 'Iten',
    'Nandi': 'Kapsabet',
    'Baringo': 'Kabarnet',
    'Laikipia': 'Nanyuki',
    'West Pokot': 'Kapenguria',
    'Kakamega': 'Kakamega',
    'Vihiga': 'Vihiga',
    'Bungoma': 'Bungoma',
    'Busia': 'Busia',
    'Siaya': 'Siaya',
    'Kisumu': 'Kisumu',
    'Homa Bay': 'Homa Bay',
    'Migori': 'Migori',
    'Kisii': 'Kisii',
    'Nyamira': 'Nyamira'
  };
  
  return capitals[countyName] || countyName;
}