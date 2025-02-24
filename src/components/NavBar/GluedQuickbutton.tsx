import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faCheckCircle, faTag, faBuildingColumns, faBullseye } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
type GluedQuickbuttonProps = {
    onPress: () => void;
    screen: string;
}

const GluedQuickbutton = ({ onPress, screen }: GluedQuickbuttonProps) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    const getIconForScreen = (screen: string) => {
        switch (screen) {
            case 'generalSettings':
                return faPlus;
            case 'defaultTagsAndDescriptions':
                return faTag;
            case 'checklist':
                return faCheckCircle;
            case 'pillars':
                return faBuildingColumns;
            case 'objectives':
                return faBullseye;
            default:
                return faPlus;
        }
    };

    const icon = getIconForScreen(screen);

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.floatingButton,
                pressed && styles.pressed
            ]} 
            onPress={() => onPress()}
        >
            {({ pressed }) => (
                <FontAwesomeIcon 
                    icon={icon} 
                    color={pressed ? theme.colors.textColor : theme.colors.backgroundColor} 
                    size={24} 
                />
            )}
        </Pressable>
    );
}

const getStyles = (theme: any) => {
    return StyleSheet.create({
        floatingButton: {
            position: 'absolute',
            bottom: 15,
            right: 25,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.accentColor,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            zIndex: 3000,
        },
        pressed: {
            transform: [{ scale: 0.96 }],
        },
    });
}

export default GluedQuickbutton;