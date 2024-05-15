import { PlateResults } from "./plate-results";

export interface PlateRecognition {
    id?: number;
    results?: PlateResults[];
    filename?: string;
    image?: string;
    version?: number;
    timestamp?: string;
}