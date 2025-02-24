import { useState } from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons'; // Add this import

import { ThemeName } from '@/src/styles/theme';

export const ThemeSelector: React.FC<{
    currentTheme: ThemeName;
    onSelectTheme: (theme: ThemeName) => void;
    themeColors: any;
}> = ({ currentTheme, onSelectTheme, themeColors }) => {
    const [isOpen, setIsOpen] = useState(false);
    const availableThemes: ThemeName[] = ['dark', 'light', 'signalis'];

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 60,
            right: 10,
            backgroundColor: themeColors.backgroundSecondary,
            borderRadius: 8,
            padding: 8,
            display: isOpen ? 'flex' : 'none',
            borderWidth: 1,
            borderColor: themeColors.borderColor,
        },
        option: {
            padding: 8,
            marginVertical: 4,
            borderRadius: 4,
        },
        selectedOption: {
            backgroundColor: themeColors.accentColor,
        },
        optionText: {
            color: themeColors.textColor,
            textTransform: 'capitalize',
        },
    });

    return (
        <>
            <Pressable 
                onPress={() => setIsOpen(!isOpen)}
                style={({ pressed }) => [
                    {
                        padding: 8,
                        borderRadius: 20,
                    },
                    pressed && {
                        backgroundColor: `${themeColors.backgroundColor}EE`,
                        transform: [{ scale: 0.9 }],
                    }
                ]}
            >
                <FontAwesomeIcon 
                    icon={faPalette}
                    size={20}
                    color={themeColors.textColor}
                />
            </Pressable>
            
            {isOpen && (
                <View style={styles.container}>
                    {availableThemes.map((themeName) => (
                        <Pressable
                            key={themeName}
                            style={[
                                styles.option,
                                currentTheme === themeName && styles.selectedOption
                            ]}
                            onPress={() => {
                                onSelectTheme(themeName);
                                setIsOpen(false);
                            }}
                        >
                            <Text style={styles.optionText}>{themeName}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </>
    );
};
