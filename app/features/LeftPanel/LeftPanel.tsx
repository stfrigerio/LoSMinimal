import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import { useNavigationComponents } from './helpers/useNavigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const LeftPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, toggleTheme } = useTheme();
    const { themeColors, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);

    const { openTasks } = useNavigationComponents();

    const handleOpenTasks = () => {
        setTimeout(() => {
            openTasks();
        }, 150);
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={50} 
                    tint={theme === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    <Pressable onPress={handleOpenTasks} style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}>
                        {({ pressed }) => (
                            <View style={styles.buttonContent}>
                                <FontAwesomeIcon 
                                    icon={faCheckCircle} 
                                    size={20}
                                    color={pressed ? themeColors.greenOpacity : 'gray'}
                                />
                                <Text style={[
                                    designs.text.text,
                                    styles.buttonText,
                                    { color: pressed ? themeColors.textColor : themeColors.textColor }
                                ]}>
                                    Tasks
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleTheme} style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}>
                        {({ pressed }) => (
                            <View style={styles.buttonContent}>
                                <FontAwesomeIcon 
                                    icon={theme === 'dark' ? faSun : faMoon}
                                    size={20}
                                    color={pressed ? themeColors.greenOpacity : 'gray'}
                                />
                                <Text style={[
                                    designs.text.text,
                                    styles.buttonText,
                                    { color: pressed ? themeColors.textColor : themeColors.textColor }
                                ]}>
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1,
        minHeight: '100%',
    },
    content: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        zIndex: 1000,
        height: '100%',
    },
    button: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: `${themeColors.backgroundColor}CC`, // Adding some transparency
        elevation: 3,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    buttonPressed: {
        backgroundColor: `${themeColors.backgroundColor}EE`,
        transform: [{ scale: 0.98 }],
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default LeftPanel;