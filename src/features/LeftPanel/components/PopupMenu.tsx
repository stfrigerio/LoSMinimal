import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
export interface MenuItem {
    label: string;
    onPress: () => void;
}

interface PopupMenuProps {
    isVisible: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    anchorPosition?: { x: number; y: number };
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isVisible, onClose, menuItems, anchorPosition }) => {
    const { theme } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme), [theme]);
    const [menuLayout, setMenuLayout] = useState({ width: 0, height: 0 });
    const windowDimensions = Dimensions.get('window');
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            animatedHeight.setValue(0);
            animatedOpacity.setValue(0);
            
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isVisible]);

    const getAdjustedPosition = () => {
        if (!anchorPosition || !menuLayout.width || !menuLayout.height) return {};

        let left = anchorPosition.x;
        let top = anchorPosition.y;

        // Adjust horizontal position if menu would go off screen
        if (left + menuLayout.width > windowDimensions.width) {
            left = windowDimensions.width - menuLayout.width - 16; // 16px padding from edge
        }
        if (left < 16) left = 16; // Minimum 16px from left edge

        // Adjust vertical position if menu would go off screen
        if (top + menuLayout.height > windowDimensions.height) {
            top = windowDimensions.height - menuLayout.height - 16;
        }
        if (top < 16) top = 16; // Minimum 16px from top edge

        return { left, top };
    };
    
    return (
        <Modal
            transparent
            visible={isVisible}
            onRequestClose={onClose}
            animationType="none"
        >
            <Animated.View 
                style={[
                    styles.modalOverlay,
                    {
                        opacity: animatedOpacity
                    }
                ]}
            >
                <Pressable 
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
                <Animated.View 
                    style={[
                        styles.popupMenu,
                        anchorPosition && {
                            position: 'absolute',
                            ...getAdjustedPosition(),
                        },
                        {
                            opacity: animatedOpacity,
                            transform: [
                                { 
                                    scaleY: animatedHeight 
                                }
                            ]
                        }
                    ]}
                    onLayout={(event) => {
                        const { width, height } = event.nativeEvent.layout;
                        setMenuLayout({ width, height });
                    }}
                >
                    {menuItems.map((item, index) => (
                        <Pressable 
                            key={index}
                            style={({ pressed }) => [
                                styles.menuItem,
                                pressed && styles.menuItemPressed
                            ]}
                            onPress={() => {
                                onClose();
                                item.onPress();
                            }}
                        >
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </Pressable>
                    ))}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};


const getStyles = (theme: Theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
    },
    popupMenu: {
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.xs,
        minWidth: 180,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 2,
    },
    menuItemPressed: {
        backgroundColor: `${theme.colors.borderColor}40`,
    },
    menuItemText: {
        color: theme.colors.textColor,
        fontSize: 16,
    },
});

export default PopupMenu;