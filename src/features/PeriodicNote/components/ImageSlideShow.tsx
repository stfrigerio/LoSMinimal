import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import { getImageUrisForDate } from '@/src/Images/ImageFileManager';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface ImageSlideShowProps {
    startDate: string; // 'YYYY-MM-DD' format
    endDate: string;   // 'YYYY-MM-DD' format
    intervalMs?: number; // Auto-scroll interval in milliseconds
}

const ImageSlideShow: React.FC<ImageSlideShowProps> = ({ 
    startDate, 
    endDate, 
    intervalMs = 3000 // Default to 3 seconds
}) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [scrollInterval, setScrollInterval] = useState(intervalMs);

    // Fetch images for date range
    useEffect(() => {
        const fetchImagesForDateRange = async () => {
            const allImages: string[] = [];
            const start = new Date(startDate);
            const end = new Date(endDate);

            for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                const dateStr = date.toISOString().split('T')[0];
                const uris = await getImageUrisForDate(dateStr);
                allImages.push(...uris);
            }
            
            setImageUris(allImages);
        };

        fetchImagesForDateRange();
    }, [startDate, endDate]);

    // Auto-scroll logic
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if (isPlaying && imageUris.length > 1) {
            intervalId = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % imageUris.length);
            }, scrollInterval);  // Changed from intervalMs to scrollInterval
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [imageUris.length, scrollInterval, isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const nextImage = useCallback(() => {
        setIsPlaying(false);  // Stop auto-play
        setCurrentIndex(prev => (prev + 1) % imageUris.length);
    }, [imageUris.length]);
    
    const prevImage = useCallback(() => {
        setIsPlaying(false);  // Stop auto-play
        setCurrentIndex(prev => (prev - 1 + imageUris.length) % imageUris.length);
    }, [imageUris.length]);

    if (imageUris.length === 0) {
        return <Text style={{ color: themeColors.textColor }}>No images available for this date range.</Text>;
    }

    const INTERVAL_OPTIONS = [
        { label: '0.25s', value: 250 },
        { label: '0.5s', value: 500 },
        { label: '1s', value: 1000 },
        { label: '2s', value: 2000 },
        { label: '3s', value: 3000 },
    ];

    return (
        <View style={{ marginBottom: 80 }}>
            <Image
                source={{ uri: imageUris[currentIndex] }}
                style={styles.image}
            />
            <Text style={{ color: themeColors.textColor, marginLeft: 10 }}>{`${currentIndex + 1} / ${imageUris.length}`}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={prevImage} style={styles.button}>
                    <Text style={{ color: themeColors.textColor }}>Previous</Text>
                </Pressable>
                <Pressable onPress={togglePlayPause} style={styles.button}>
                    <Text style={{ color: themeColors.textColor }}>{isPlaying ? "Pause" : "Play"}</Text>
                </Pressable>
                <Pressable onPress={nextImage} style={styles.button}>
                    <Text style={{ color: themeColors.textColor }}>Next</Text>
                </Pressable>
            </View>
            <View style={styles.speedControls}>
                <Text style={{ color: themeColors.textColor }}>Speed:</Text>
                <View style={styles.speedButtons}>
                    {INTERVAL_OPTIONS.map((option) => (
                        <Pressable
                            key={option.value}
                            onPress={() => setScrollInterval(option.value)}
                            style={[
                                styles.speedButton,
                                scrollInterval === option.value && styles.speedButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.speedButtonText,
                                scrollInterval === option.value && styles.speedButtonTextActive
                            ]}>
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default ImageSlideShow;

const getStyles = (theme: any) => {
    return StyleSheet.create({
        image: {
            width: 300, 
            height: 300, 
            alignSelf: 'center', 
            marginVertical: 20, 
            borderRadius: 20
        },
        button: {
            marginTop: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            minWidth: 80
        },
        speedControls: {
            marginTop: 20,
            alignItems: 'center'
        },
        speedButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            gap: 8
        },
        speedButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: 'transparent'
        },
        speedButtonActive: {
            backgroundColor: theme.accentColor,
            borderColor: theme.accentColor
        },
        speedButtonText: {
            color: theme.textColor,
            fontSize: 12
        },
        speedButtonTextActive: {
            color: theme.backgroundColor
        }
    });
};