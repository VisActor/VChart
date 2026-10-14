export type ObservationValue = number | string | boolean | null;
export interface TableObservation {
    id: string;
    values: {
        [variable: string]: ObservationValue;
    };
}
export interface NumericObservation {
    id: string;
    values: {
        [variable: string]: number | null;
    };
}
