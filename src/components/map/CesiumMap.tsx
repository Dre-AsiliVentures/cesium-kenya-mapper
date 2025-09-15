import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { CountyFeature, CountyData } from '@/types/county';
import { CountyPopup } from './CountyPopup';
import { AnimatePresence } from 'framer-motion';

// Set Cesium Ion access token (you'll need to get this from Cesium Ion)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

interface CesiumMapProps {
  className?: string;
}

export const CesiumMap = ({ className }: CesiumMapProps) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialize Cesium viewer
    viewer.current = new Cesium.Viewer(cesiumContainer.current, {
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      infoBox: false,
      selectionIndicator: false,
    });

    // Set initial camera position over Kenya
    viewer.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(37.9062, 0.0236, 1500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0
      }
    });

    // Load Kenya counties GeoJSON
    loadKenyaCounties();

    // Cleanup
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
      }
    };
  }, []);

  const loadKenyaCounties = async () => {
    if (!viewer.current) return;

    try {
      const response = await fetch('/data/kenya-counties.geojson');
      const geoJsonData = await response.json();
      
      // Create a promise to resolve when all entities are added
      const dataSource = await Cesium.GeoJsonDataSource.load(geoJsonData, {
        stroke: Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.8),
        fill: Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.1),
        strokeWidth: 2,
        clampToGround: true,
      });

      viewer.current.dataSources.add(dataSource);

      // Style entities and add click handlers
      const entities = dataSource.entities.values;
      entities.forEach((entity) => {
        if (entity.polygon) {
          // Set initial styling using proper Cesium property assignments
          entity.polygon.material = new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.1)
          );
          entity.polygon.outline = new Cesium.ConstantProperty(true);
          entity.polygon.outlineColor = new Cesium.ConstantProperty(
            Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.8)
          );
          entity.polygon.height = new Cesium.ConstantProperty(0);
          entity.polygon.extrudedHeight = new Cesium.ConstantProperty(1000);
        }
      });

      // Add mouse move handler for hover effects
      let hoveredEntity: Cesium.Entity | null = null;
      viewer.current.cesiumWidget.screenSpaceEventHandler.setInputAction((event: any) => {
        const pickedObject = viewer.current?.scene.pick(event.endPosition);
        
        if (hoveredEntity && hoveredEntity.polygon) {
          // Reset previous hovered entity
          hoveredEntity.polygon.material = new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.1)
          );
          hoveredEntity.polygon.outlineColor = new Cesium.ConstantProperty(
            Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.8)
          );
        }

        if (pickedObject && pickedObject.id && pickedObject.id.polygon) {
          hoveredEntity = pickedObject.id;
          // Highlight hovered entity
          hoveredEntity.polygon.material = new Cesium.ColorMaterialProperty(
            Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.3)
          );
          hoveredEntity.polygon.outlineColor = new Cesium.ConstantProperty(
            Cesium.Color.fromCssColorString('#22c55e')
          );
          
          // Change cursor
          viewer.current!.canvas.style.cursor = 'pointer';
        } else {
          hoveredEntity = null;
          viewer.current!.canvas.style.cursor = 'default';
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // Add click handler
      viewer.current.cesiumWidget.screenSpaceEventHandler.setInputAction((event: any) => {
        const pickedObject = viewer.current?.scene.pick(event.position);
        
        if (pickedObject && pickedObject.id && pickedObject.id.properties) {
          const properties = pickedObject.id.properties;
          const countyData: CountyData = {
            shapeName: properties.shapeName?.getValue() || 'Unknown',
            shapeISO: properties.shapeISO?.getValue() || 'Unknown',
            shapeID: properties.shapeID?.getValue() || 'Unknown',
            shapeGroup: properties.shapeGroup?.getValue() || 'Unknown',
            shapeType: properties.shapeType?.getValue() || 'Unknown',
          };

          setSelectedCounty(countyData);
          setPopupPosition({
            x: event.position.x,
            y: event.position.y,
          });
        } else {
          setSelectedCounty(null);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Fly to Kenya bounds
      viewer.current.flyTo(dataSource, {
        duration: 2.0,
      });

    } catch (error) {
      console.error('Error loading Kenya counties data:', error);
    }
  };

  const handleClosePopup = () => {
    setSelectedCounty(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={cesiumContainer} 
        className="w-full h-full rounded-lg shadow-map overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #b3e5fc 100%)' }}
      />
      
      <AnimatePresence>
        {selectedCounty && (
          <CountyPopup 
            county={selectedCounty}
            onClose={handleClosePopup}
            position={popupPosition}
          />
        )}
      </AnimatePresence>
      
      {/* Kenya flag colors overlay indicator */}
      <div className="absolute top-4 left-4 flex space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="w-4 h-3 bg-kenya-black rounded-sm"></div>
        <div className="w-4 h-3 bg-kenya-red rounded-sm"></div>
        <div className="w-4 h-3 bg-kenya-green rounded-sm"></div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-sm text-gray-700 font-medium">
          Click on any county to view detailed information
        </p>
      </div>
    </div>
  );
};