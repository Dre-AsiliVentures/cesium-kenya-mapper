import { Feature, Geometry } from 'geojson';

export interface CountyProperties {
  shapeName: string;
  shapeISO: string;
  shapeID: string;
  shapeGroup: string;
  shapeType: string;
}

export interface CountyFeature extends Feature<Geometry, CountyProperties> {}

export interface CountyData extends CountyProperties {
  population?: number;
  area?: number;
  capital?: string;
  description?: string;
}