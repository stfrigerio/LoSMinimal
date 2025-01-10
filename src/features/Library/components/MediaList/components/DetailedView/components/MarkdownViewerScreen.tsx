import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import MobileMarkdown from '@/src/components/Markdown/Markdown';
import { useLocalSearchParams } from 'expo-router';

export const MarkdownViewerScreen: React.FC = () => {
    const { content, title } = useLocalSearchParams<{ content: string; title: string }>();
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
            <ScrollView style={styles.scrollView}>
                <MobileMarkdown>{content}</MobileMarkdown>
            </ScrollView>
        </SafeAreaView>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
});