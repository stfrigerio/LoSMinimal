import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faMapLocation } from '@fortawesome/free-solid-svg-icons';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { FormInput } from '@/src/components/FormComponents';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface CarLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LocationData {
    coords: string;
    timestamp: string;
}

const CarLocationModal: React.FC<CarLocationModalProps> = ({ isOpen, onClose }) => {
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    useEffect(() => {
        if (isOpen) {
            getCarLocation();
        }
    }, [isOpen]);


    const saveCarLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const locationString = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
        const data: LocationData = {
            coords: locationString,
            timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem('@car_location', JSON.stringify(data));
        setLocationData(data);
    };

    const getCarLocation = async () => {
        const savedLocation = await AsyncStorage.getItem('@car_location');
        if (savedLocation) {
            setLocationData(JSON.parse(savedLocation));
        } else {
            setLocationData(null);
        }
    };

    const openInMaps = () => {
        if (location) {
            const url = Platform.select({
                ios: `maps:0,0?q=${location}`,
                android: `geo:0,0?q=${location}`,
                web: `https://www.google.com/maps/search/?api=1&query=${location}`
            });
            if (url) {
                Linking.openURL(url);
            }
        }
    };

    let parsedLocation = null;
    let formattedDate = null;
    if (locationData?.coords) {
        const [lat, lng] = locationData.coords.split(',').map(Number);
        parsedLocation = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        formattedDate = new Date(locationData.timestamp).toLocaleString();
    }

    const modalContent = (
        <View style={styles.container}>
            <Text style={[designs.text.title, styles.title]}>🚗 Car Location</Text>
            
            <FormInput
                label="Saved Location"
                value={parsedLocation || 'No location saved'}
                editable={false}
            />

            {formattedDate && (
                <Text style={[styles.timestamp]}>
                    Last saved: {formattedDate}
                </Text>
            )}
            
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button]} onPress={saveCarLocation}>
                    <FontAwesomeIcon icon={faMapLocation} size={20} color={themeColors.accentColor} style={{ marginRight: 15 }} />
                    <Text style={designs.text.text}>Save Current Location</Text>
                </Pressable>
                {parsedLocation && (
                    <Pressable style={[styles.button]} onPress={openInMaps}>
                        <FontAwesomeIcon icon={faLocationDot} size={20} color={themeColors.accentColor} style={{ marginRight: 15 }} />
                        <Text style={designs.text.text}>Open in Maps</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );

    return (
        <UniversalModal isVisible={isOpen} onClose={onClose}>
            {modalContent}
        </UniversalModal>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: theme.backgroundColor,
        borderRadius: 20,
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 10,
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 12,
        padding: 15,
        backgroundColor: theme.backgroundColor,
        shadowColor: theme.shadowColor || '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timestamp: {
        textAlign: 'center',
        color: theme.gray,
        marginTop: -15,
        marginBottom: 20,
        fontSize: 12,
    },
});

export default CarLocationModal;