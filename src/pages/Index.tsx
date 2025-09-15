import { CesiumMap } from "@/components/map/CesiumMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <header className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-6 h-4 bg-kenya-black rounded-sm"></div>
                <div className="w-6 h-4 bg-kenya-red rounded-sm"></div>
                <div className="w-6 h-4 bg-kenya-green rounded-sm"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-kenya bg-clip-text text-transparent">
                Kenya Counties Explorer
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Interactive County Mapping System
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Explore Kenya's 47 Counties
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Navigate through Kenya's counties using this interactive 3D map powered by Cesium. 
            Click on any county to view detailed information including population, area, and administrative details.
          </p>
        </div>
        
        {/* Map Container */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-primary/10">
          <CesiumMap className="h-[600px] w-full" />
        </div>
        
        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Cesium • Data from geoBoundaries • Built with React & TypeScript
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
