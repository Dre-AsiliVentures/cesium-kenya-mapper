// src/components/map/CountyPopup.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Users, Grid3x3, Building2 } from "lucide-react";
import { CountyData } from "@/types/county";
import { motion } from "framer-motion";

interface CountyPopupProps {
  county: CountyData;
  onClose: () => void;
}

export const CountyPopup = ({ county, onClose }: CountyPopupProps) => {
  // Mock additional data for demonstration
  const mockData = {
    population: Math.floor(Math.random() * 2000000) + 100000,
    area: Math.floor(Math.random() * 50000) + 5000,
    capital: getCountyCapital(county.shapeName),
    description: `${county.shapeName} County is one of Kenya's 47 counties, known for its unique landscape and cultural heritage.`
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.98, x: 100 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed top-0 right-6 z-50 h-full flex items-center pointer-events-auto"
      style={{ width: '70vw', maxWidth: '900px',color: 'blue'}}
    >
      {/* Arrow pointing left to county */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <polygon points="48,24 0,0 0,48" fill="#22c55e" opacity="0.7" />
        </svg>
      </div>
      <Card className="w-full h-[80vh] shadow-popup bg-card/95 backdrop-blur-sm border-primary/20 flex flex-col justify-center">
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-kenya-green flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                {county.shapeName} County
              </CardTitle>
              <Badge variant="secondary" className="mt-1 text-base">
                {county.shapeISO}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-destructive/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {mockData.description}
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-kenya-green" />
                <span className="font-medium">Population</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {mockData.population.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base">
                <Grid3x3 className="h-5 w-5 text-kenya-green" />
                <span className="font-medium">Area</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {mockData.area.toLocaleString()} km²
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-kenya-green" />
              <span className="font-medium">County Headquarters</span>
            </div>
            <p className="text-lg font-medium text-foreground">
              {mockData.capital}
            </p>
          </div>
          <div className="pt-4 border-t border-border">
            <Badge variant="outline" className="text-base">
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
