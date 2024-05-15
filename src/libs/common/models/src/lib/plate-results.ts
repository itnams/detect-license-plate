import { PlateBox } from "./plate-box";

export interface PlateResults {
    id?: number;
    plateRecognitionId?: number;
    box?: PlateBox;
    plate?: string
}