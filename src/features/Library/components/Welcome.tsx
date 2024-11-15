import { useThemeStyles } from '@/src/styles/useThemeStyles';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Welcome: React.FC = () => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    return (
        <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>My Library</Text>
            <Text style={styles.subtitleText}>🎥 📺 📚 📖 🎮 🎵 </Text>
        </View>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    welcomeSection: {
        padding: 16,
        marginBottom: 16,
    },
    welcomeText: {
        ...design.text.title,
        color: theme.textColorBold,
    },
    subtitleText: {
        fontSize: 16,
        color: theme.textColor + '99',
        marginTop: 4,
        textAlign: 'center',
    },
}); 