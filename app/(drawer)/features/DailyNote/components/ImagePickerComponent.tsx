// components/ImagePickerComponent.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Alert,
    Modal,
    Pressable,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import {
    getImageUrisForDate,
    addImageUri,
    removeImageUri,
} from '@/src/Images/ImageFileManager';

import AlertModal from '@/app/components/modals/AlertModal';

interface ImagePickerComponentProps {
    date: string; // Date in 'YYYY-MM-DD' format
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({ date }) => {
    const [images, setImages] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const { designs, themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    useEffect(() => {
        // Load images for the given date when the component mounts or date changes
        const loadImages = async () => {
            const imageUris = await getImageUrisForDate(date);
            setImages(imageUris);
        };
        loadImages();
    }, [date]);

    // Request permissions for camera and media library
    const requestPermissions = async (): Promise<boolean> => {
        try {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
                setAlertConfig({
                    visible: true,
                    title: 'Permission Denied',
                    message: 'Camera permissions are required to capture images.',
                    onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
                });
                return false;
            }

            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (mediaLibraryStatus.status !== 'granted') {
                setAlertConfig({
                    visible: true,
                    title: 'Permission Denied',
                    message: 'Media library permissions are required to select images.',
                    onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
                });
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            setAlertConfig({
                visible: true,
                title: 'Error',
                message: 'An error occurred while requesting permissions.',
                onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
            });
            return false;
        }
    };

    // Handle image capture using the camera
    const handleCaptureImage = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                await addImageUri(date, uri);
                setImages((prevImages) => [...prevImages, uri]);
            }
        } catch (error) {
            console.error('Error capturing image:', error);
            setAlertConfig({
                visible: true,
                title: 'Error',
                message: 'Failed to capture image. Please try again.',
                onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
            });
        }
    };

    // Handle image selection from the gallery
    const handleSelectImage = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                await addImageUri(date, uri);
                setImages((prevImages) => [...prevImages, uri]);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            setAlertConfig({
                visible: true,
                title: 'Error',
                message: 'Failed to select image. Please try again.',
                onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
            });
        }
    };

    // Handle image deletion
    const handleDeleteImage = async (index: number) => {
        setAlertConfig({
            visible: true,
            title: 'Delete Image',
            message: 'Are you sure you want to delete this image?',
            onConfirm: async () => {
                await removeImageUri(date, index);
                setImages((prevImages) => prevImages.filter((_, i) => i !== index));
                setAlertConfig(prev => ({ ...prev, visible: false }));
            },
        });
    };

    // Handle image preview
    const handlePreviewImage = (uri: string) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    // Close the image preview modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <View style={styles.container}>
            <Text style={[designs.text.subtitle, styles.title]}>Daily Pics 📸</Text>
            
            {/* Buttons for capturing and selecting images */}
            <View style={styles.buttonContainer}>
                <Pressable 
                    style={[styles.button]} 
                    onPress={handleCaptureImage}
                >
                    <MaterialIcons name="camera-alt" size={24} color={themeColors.opaqueTextColor} />
                    <Text style={[designs.text.text, styles.buttonText]}>
                        Take Photo
                    </Text>
                </Pressable>
                <Pressable 
                    style={[styles.button]} 
                    onPress={handleSelectImage}
                >
                    <MaterialIcons name="photo-library" size={24} color={themeColors.opaqueTextColor} />
                    <Text style={[designs.text.text, styles.buttonText]}>
                        Gallery
                    </Text>
                </Pressable>
            </View>
    
            {/* Display selected images */}
            <ScrollView 
                horizontal 
                style={styles.imageScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageScrollContent}
            >
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Pressable 
                            onPress={() => handlePreviewImage(uri)}
                            style={styles.imagePressable}
                        >
                            <Image source={{ uri }} style={styles.imageThumbnail} />
                        </Pressable>
                        <Pressable
                            style={styles.deleteIcon}
                            onPress={() => handleDeleteImage(index)}
                        >
                            <MaterialIcons name="close" size={18} color="#fff" />
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
    
            {/* Modal for image preview */}
            {selectedImage && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <Pressable style={styles.modalContainer} onPress={closeModal}>
                        <View style={styles.modalImageContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                            <Pressable style={styles.modalCloseButton} onPress={closeModal}>
                                <MaterialIcons name="close" size={24} color="#fff" />
                            </Pressable>
                        </View>
                    </Pressable>
                </Modal>
            )}

            {alertConfig.visible && (
                <AlertModal
                    isVisible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onConfirm={alertConfig.onConfirm}
                    onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
                    singleButton={alertConfig.title !== 'Delete Image'} // Only show both buttons for delete confirmation
                />
            )}
        </View>
    );
};

export default ImagePickerComponent;

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        marginVertical: 20,
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 16,
        padding: 20,
        // shadowColor: themeColors.shadowColor,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        backgroundColor: themeColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: themeColors.opaqueTextColor,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    imageScroll: {
        marginTop: 4,
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    imageScrollContent: {
        paddingRight: 40, // Shows partial next image
        gap: 12,
    },
    imageWrapper: {
        position: 'relative',
    },
    imagePressable: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageThumbnail: {
        width: 120,
        height: 120,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalImageContainer: {
        width: '100%',
        height: '80%',
        position: 'relative',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 16,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});