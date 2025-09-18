import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { CountyFeature, CountyData } from '@/types/county';
import { CountyPopup } from './CountyPopup';
import { AnimatePresence } from 'framer-motion';

// Set Cesium Ion access token
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlN2U0NzA4Ny02OGQ4LTQ0N2YtYWExOC1iZThjODUyOTkyNTkiLCJpZCI6MzM3NDAwLCJpYXQiOjE3NTY3ODQ5Mzl9.9azisrf51JAoJj8p_EdTvNFdHc3g7KxxGFp5QIuVJR0";

interface CesiumMapProps {
  className?: string;
}

export const CesiumMap = ({ className }: CesiumMapProps) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Cesium.Entity | null>(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialize Cesium viewer in 2D mode
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
      sceneMode: Cesium.SceneMode.SCENE2D,
      scene3DOnly: false,
    } as Cesium.Viewer.ConstructorOptions);

    // Add imagery with error handling
    const addImagery = async () => {
      if (viewer.current) {
        try {
          const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3);
          viewer.current.imageryLayers.removeAll();
          viewer.current.imageryLayers.addImageryProvider(imageryProvider);
          console.log('Imagery provider loaded successfully');
        } catch (error) {
          console.error('Error loading Cesium Ion imagery:', error);
          console.log('Switched to OpenStreetMap imagery provider');
        }
      }
    };

    // Set initial camera position over Kenya for 2D view
    viewer.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(37.9062, 0.0236, 2000000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(0),
        roll: 0.0,
      },
    });

    // Add imagery and load Kenya counties
    addImagery();
    loadKenyaCounties();

    // Cleanup
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
      }
    };
  }, []);

  // Helper function to set entity to default green styling
  const setEntityToDefault = (entity: Cesium.Entity) => {
    if (entity.polygon) {
      entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.1));
      entity.polygon.outline = new Cesium.ConstantProperty(true);
      entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.8));
      entity.polygon.outlineWidth = new Cesium.ConstantProperty(2);
    }
  };

  // Helper function to set entity to hover styling
  const setEntityToHover = (entity: Cesium.Entity) => {
    if (entity.polygon) {
      entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#f87171').withAlpha(0.3));
      entity.polygon.outline = new Cesium.ConstantProperty(true);
      entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#f87171').withAlpha(0.8));
      entity.polygon.outlineWidth = new Cesium.ConstantProperty(2);
    }
  };

  // Helper function to set entity to selected styling
  const setEntityToSelected = (entity: Cesium.Entity) => {
    if (!entity.polygon) return;
    console.log("Applying selected style to entity:", entity.id);
    
    // Set bright yellow fill and outline
    entity.polygon.material = new Cesium.ColorMaterialProperty(
      Cesium.Color.YELLOW.withAlpha(0.4)
    );
    entity.polygon.outline = new Cesium.ConstantProperty(true);
    entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.YELLOW);
    entity.polygon.outlineWidth = new Cesium.ConstantProperty(4);

    // Add additional polyline for extra thick yellow outline
    const hierarchy = entity.polygon.hierarchy?.getValue(Cesium.JulianDate.now());
    if (hierarchy && hierarchy.positions) {
      const outlineId = `${entity.id}-outline`;
      const existing = viewer.current!.entities.getById(outlineId);
      if (existing) viewer.current!.entities.remove(existing);
      
      viewer.current!.entities.add({
        id: outlineId,
        polyline: {
          positions: hierarchy.positions,
          width: 5,
          material: Cesium.Color.YELLOW,
          clampToGround: true,
        },
      });
    }
  };

  // Helper function to clear selection styling
  const clearSelection = (entity: Cesium.Entity) => {
    if (entity.polygon) {
      console.log("Clearing selection for entity:", entity.id);
      setEntityToDefault(entity);
      const outlineId = `${entity.id}-outline`;
      const outline = viewer.current!.entities.getById(outlineId);
      if (outline) {
        viewer.current!.entities.remove(outline);
        console.log("Removed outline entity:", outlineId);
      }
    }
  };

  const loadKenyaCounties = async () => {
    if (!viewer.current) return;

    try {
      const response = await fetch('/data/kenya-counties.geojson');
      const geoJsonData = await response.json();

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
          entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.1));
          entity.polygon.outline = new Cesium.ConstantProperty(true);
          entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.8));
          entity.polygon.outlineWidth = new Cesium.ConstantProperty(2);
          entity.polygon.height = new Cesium.ConstantProperty(0);
        }
      });

      // Add mouse move handler for hover effects
      let hoveredEntity: Cesium.Entity | null = null;
      viewer.current.cesiumWidget.screenSpaceEventHandler.setInputAction((event: any) => {
        const pickedObject = viewer.current?.scene.pick(event.endPosition);

        // Remove hover color from previously hovered entity (only if it's not selected)
        if (hoveredEntity && hoveredEntity !== selectedEntity) {
          setEntityToDefault(hoveredEntity);
          hoveredEntity = null;
          viewer.current!.canvas.style.cursor = "default";
        }

        if (pickedObject && pickedObject.id && pickedObject.id.polygon) {
          hoveredEntity = pickedObject.id;
          if (hoveredEntity !== selectedEntity) {
            setEntityToHover(hoveredEntity);
            viewer.current!.canvas.style.cursor = 'pointer';
          } else {
            viewer.current!.canvas.style.cursor = 'pointer';
          }
        } else {
          hoveredEntity = null;
          viewer.current!.canvas.style.cursor = 'default';
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // Add click handler
      viewer.current.cesiumWidget.screenSpaceEventHandler.setInputAction((event: any) => {
        const pickedObject = viewer.current?.scene.pick(event.position);

        // Clear previous selection if it exists
        if (selectedEntity) {
          clearSelection(selectedEntity);
          setSelectedEntity(null);
          setSelectedCounty(null);
        }

        // If no valid pick, return early (deselect case)
        if (!pickedObject || !pickedObject.id || !pickedObject.id.properties) {
          return;
        }

        // New selection
        const properties = pickedObject.id.properties;
        const countyData: CountyData = {
          shapeName: properties.shapeName?.getValue() || 'Unknown',
          shapeISO: properties.shapeISO?.getValue() || 'Unknown',
          shapeID: properties.shapeID?.getValue() || 'Unknown',
          shapeGroup: properties.shapeGroup?.getValue() || 'Unknown',
          shapeType: properties.shapeType?.getValue() || 'Unknown',
        };

        setSelectedCounty(countyData);
        setSelectedEntity(pickedObject.id);
        setEntityToSelected(pickedObject.id);

        // Camera fly to county polygon with padding
        if (pickedObject.id.polygon && pickedObject.id.polygon.hierarchy) {
          const hierarchy = pickedObject.id.polygon.hierarchy.getValue();
          if (hierarchy && hierarchy.positions && hierarchy.positions.length > 0) {
            const rect = Cesium.Rectangle.fromCartesianArray(hierarchy.positions);
            const padding = 0.75;
            const width = rect.width;
            const height = rect.height;
            const pad = Math.max(width, height) * 0.5;
            const paddedRect = Cesium.Rectangle.fromDegrees(
              Cesium.Math.toDegrees(rect.west) - pad,
              Cesium.Math.toDegrees(rect.south) - pad,
              Cesium.Math.toDegrees(rect.east) + pad,
              Cesium.Math.toDegrees(rect.north) + pad
            );

            viewer.current!.camera.flyTo({
              destination: paddedRect,
              duration: 1.5,
            });
          }
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
    if (selectedEntity) {
      clearSelection(selectedEntity);
    }
    setSelectedCounty(null);
    setSelectedEntity(null);

    // Reset camera to original Kenya view
    if (viewer.current) {
      viewer.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(37.9062, 0.0236, 2000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(0),
          roll: 0.0,
        },
        duration: 1.5,
      });
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
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
          />
        )}
      </AnimatePresence>
      <div className="absolute top-4 left-4 flex space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="w-4 h-3 bg-kenya-black rounded-sm"></div>
        <div className="w-4 h-3 bg-kenya-red rounded-sm"></div>
        <div className="w-4 h-3 bg-kenya-green rounded-sm"></div>
      </div>
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-sm text-gray-700 font-medium">
          Click on any county to view detailed information
        </p>
      </div>
    </div>
  );
};
