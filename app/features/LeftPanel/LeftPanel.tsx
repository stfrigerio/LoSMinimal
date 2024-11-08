import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faMoon, faSun, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { MenuButton } from './components/MenuButton';

import { useNavigationComponents } from './helpers/useNavigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useThemeStyles } from '@/src/styles/useThemeStyles';


const LeftPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, toggleTheme } = useTheme();
    const { themeColors, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);

    const { openTasks, openDailyNote } = useNavigationComponents();

    const handleOpenTasks = () => {
        setTimeout(() => {
            openTasks();
        }, 150);
    }

    const handleOpenDailyNote = () => {
        setTimeout(() => {
            openDailyNote();
        }, 150);
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={theme === 'dark' ? 50 : 20} 
                    tint={theme === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    {/* Menu buttons section */}
                    <View style={styles.menuSection}>
                        <MenuButton 
                            icon={faCalendarDay}
                            label="Daily Note"
                            onPress={handleOpenDailyNote}
                        />
                        <MenuButton 
                            icon={faCheckCircle}
                            label="Tasks"
                            onPress={handleOpenTasks}
                        />
                    </View>
                    
                    {/* Footer section */}
                    <View style={styles.footerContainer}>
                        <View style={styles.header}>
                            <Pressable 
                                onPress={toggleTheme} 
                                style={({ pressed }) => [
                                    styles.themeToggle,
                                    pressed && styles.themeTogglePressed
                                ]}
                            >
                                <FontAwesomeIcon 
                                    icon={theme === 'dark' ? faSun : faMoon}
                                    size={20}
                                    color={theme === 'dark' ? themeColors.textColor : themeColors.borderColor}
                                />
                            </Pressable>
                        </View>
                    </View>
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
    menuSection: {
        flex: 1, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    footerContainer: {
        width: '100%',  
        marginTop: 'auto', 
    },
    themeToggle: {
        padding: 8,
        borderRadius: 20,
    },
    themeTogglePressed: {
        backgroundColor: `${themeColors.backgroundColor}EE`,
        transform: [{ scale: 0.9 }],
    },
});

export default LeftPanel;