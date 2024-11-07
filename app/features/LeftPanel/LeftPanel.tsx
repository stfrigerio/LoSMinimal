import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import { useNavigationComponents } from './helpers/useNavigation';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

const LeftPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);

    const { openTasks } = useNavigationComponents();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={50} 
                    tint={theme === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    <Pressable onPress={openTasks} style={styles.button}>
                        {({ pressed }) => (
                            <Text style={[designs.text.text, { textAlign: 'center', color: pressed ? themeColors.accentColor : themeColors.textColor }]}>Open Tasks</Text>
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
        padding: 10,
        // borderWidth: 1,
        // borderColor: themeColors.accentColor,
        borderRadius: 10,
        backgroundColor: themeColors.backgroundColor,
        elevation: 10,
        marginVertical: 4,
    },
});

export default LeftPanel;