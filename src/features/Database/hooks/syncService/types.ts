export type UploadFormat = 'sqlite' | 'json';

export interface UploadResponse {
    success: boolean;
    message: string;
}

export interface ImageUploadResult {
    saved_images: string[];
    duplicates: number;
}

export interface ImageChunkData {
    date: string;
    images: { uri: string; name: string; type: string }[];
} 