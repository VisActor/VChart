import type { IPoint } from '../../typings/coordinate';
import type { ProjectionType } from '@visactor/vgrammar-core';
import type { IComponent } from '../interface';
export interface IProjectionSpec {
    name: string;
    type: ProjectionType;
    zoom?: number;
    center?: [number, number];
}
export interface IGeoCoordinate extends IComponent {
    projectionSpec: IProjectionSpec;
    longitudeField?: string;
    latitudeField?: string;
    dataToPosition: (values: any[]) => IPoint;
}
export interface IGeoCoordinateHelper {
    longitudeField?: string;
    latitudeField?: string;
    dataToPosition: (values: [number, number]) => IPoint;
    dataToLatitude: (lat: number) => number;
    dataToLongitude: (lon: number) => number;
    shape: (datum: any) => string;
    getCoordinateId: () => number;
}
export interface IGeoCoordinateSpec {
    projection: Omit<IProjectionSpec, 'name'>;
}
