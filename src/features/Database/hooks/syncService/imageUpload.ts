import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { ImageUploadResult, ImageChunkData } from './types';
import { CHUNK_SIZE } from './constants';
import { readImageData } from '@/src/Images/ImageFileManager';

export const processImageChunk = async (
    chunkUris: string[],
    date: string
): Promise<ImageChunkData> => {
    const imageFormData = new FormData();
    imageFormData.append('date', date);
    const processedImages = [];

    for (const uri of chunkUris) {
        try {
            const imageInfo = await FileSystem.getInfoAsync(uri);   
            if (imageInfo.exists) {
                processedImages.push({
                    uri: imageInfo.uri,
                    name: `image_${processedImages.length}.jpeg`,
                    type: 'image/jpeg'
                });
            }
        } catch (error) {
            console.warn(`Failed to process image ${uri}:`, error);
        }
    }

    return { date, images: processedImages };
};

export const uploadImageChunk = async (
    flaskURL: string,
    chunkData: ImageChunkData
): Promise<ImageUploadResult> => {
    const imageFormData = new FormData();
    imageFormData.append('date', chunkData.date);
    
    chunkData.images.forEach(image => {
        imageFormData.append('images', image as unknown as Blob);
    });

    const response = await axios.post(`${flaskURL}/upload_images`, imageFormData, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
    });

    return response.data;
};

export const uploadAllImages = async (flaskURL: string): Promise<{
    totalImages: number;
    totalSaved: number;
    totalDuplicates: number;
}> => {
    const imageData = await readImageData();
    let totalImages = 0;
    let totalSaved = 0;
    let totalDuplicates = 0;

    for (const [date, uris] of Object.entries(imageData)) {
        if (uris.length === 0) continue;

        for (let i = 0; i < uris.length; i += CHUNK_SIZE) {
            const chunkUris = uris.slice(i, i + CHUNK_SIZE);
            const chunkData = await processImageChunk(chunkUris, date);
            
            if (chunkData.images.length > 0) {
                try {
                    const result = await uploadImageChunk(flaskURL, chunkData);
                    totalImages += chunkData.images.length;
                    totalSaved += result.saved_images.length;
                    totalDuplicates += result.duplicates;
                } catch (error: any) {
                    console.error('Chunk upload error:', error.response?.data || error.message);
                    throw error;
                }
            }
        }
    }

    return { totalImages, totalSaved, totalDuplicates };
}; 