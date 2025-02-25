import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Banner from '@/src/components/Banner';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { GlitchText } from '@/src/styles/GlitchText';

export const Welcome: React.FC = () => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

    return (
        <View style={styles.welcomeSection}>
            <Banner imageSource={require('@/assets/images/library.webp')} />
            <View style={styles.welcomeTextContainer}>
                <GlitchText
                    style={styles.welcomeText}
                    glitch={theme.name === 'signalis'}
            >
                    Library
                </GlitchText>
            </View>
        </View>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    welcomeSection: {
        padding: 16,
        paddingTop: 0,
    },
    welcomeTextContainer: {
        alignSelf: 'center',
    },
    welcomeText: {
        ...design.text.title,
        ...(theme.name === 'signalis' && {
            fontSize: 36,
            fontFamily: theme.typography.fontFamily.primary,
            fontWeight: 'normal',
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 6,
        })
    },
}); 