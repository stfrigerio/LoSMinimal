import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Banner from '@/src/components/Banner';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

export const Welcome: React.FC = () => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    return (
        <View style={styles.welcomeSection}>
            <Banner imageSource={require('@/assets/images/library.webp')} />
            <Text style={styles.welcomeText}>Library</Text>
        </View>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    welcomeSection: {
        padding: 16,
        paddingTop: 0,
    },
    welcomeText: {
        ...design.text.title,
    },
}); 