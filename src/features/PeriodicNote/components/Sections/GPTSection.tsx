import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import AlertModal from '@/src/components/modals/AlertModal';
import { useGPTSection } from '../../hooks/useGPTSection';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { GlitchText } from '@/src/styles/GlitchText';
interface GPTSectionProps {
    startDate: Date;
    endDate: Date;
    currentDate: string;
}

const GPTSection: React.FC<GPTSectionProps> = ({ startDate, endDate, currentDate }) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    const {
        aiSummary,
        error,
        isLoading,
        isAlertVisible,
        errorMessage,
        isErrorAlertVisible,
        setIsAlertVisible,
        setIsErrorAlertVisible,
        generateSummary,
    } = useGPTSection(startDate, endDate, currentDate);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.accentColor} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.noTextcontainer}>
                <Text style={styles.noDataText}>{error}</Text>
            </View>
        );
    }

    if (!aiSummary) {
        return (
            <View style={styles.noTextcontainer}>
                <PrimaryButton
                    text="Generate Summary"
                    onPress={() => setIsAlertVisible(true)}
                />
                {isAlertVisible && (
                    <AlertModal
                        isVisible={isAlertVisible}
                        title="Generate Summary"
                        message="Are you sure you want to ask your desktop for a summary? This may take a moment."
                        onConfirm={() => {
                            setIsAlertVisible(false);
                            generateSummary();
                        }}
                        onCancel={() => setIsAlertVisible(false)}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {aiSummary.reflection.nice && 
                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <GlitchText
                            style={styles.subheading}
                            glitch={theme.name === 'signalis'}
                        >
                            Nice:
                        </GlitchText>
                    </View>
                    <Text style={styles.text}>{aiSummary.reflection.nice}</Text>
                </View>
            }
            {aiSummary.reflection.notSoNice && 
                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <GlitchText
                            style={styles.subheading}
                            glitch={theme.name === 'signalis'}
                        >
                            Not so nice:
                        </GlitchText>
                    </View>
                    <Text style={styles.text}>{aiSummary.reflection.notSoNice}</Text>
                </View>
            }

            {/* TODO: we chucked everything into the nice fields if we have no tags. its notSoNice */}
            {!aiSummary.reflection.nice && !aiSummary.reflection.notSoNice && 
                <Text style={styles.text}>{aiSummary.reflection.nice}</Text>
            }
            
            {isErrorAlertVisible && (
                <AlertModal
                    isVisible={isErrorAlertVisible}
                    title="Error"
                    message={errorMessage}
                    onConfirm={() => setIsErrorAlertVisible(false)}
                    onCancel={() => setIsErrorAlertVisible(false)}
                />
            )}
        </View>
    );
};
const getStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            padding: 16,
        },
        heading: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'gray',
            marginBottom: 12,
            marginTop: 16,
        },
        subheading: {
            fontSize: 14,
            color: theme.colors.gray,
            fontWeight: 'bold',
            marginBottom: 8,
            marginTop: 8,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: 16,
                fontWeight: 'normal',
                color: theme.colors.textColorBold,
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 12,
            })
        },
        text: {
            fontSize: 12,
            color: theme.colors.textColor,
            marginBottom: 12,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.secondary,
                fontSize: 18,
                color: theme.colors.textColor,
                fontWeight: 'normal',
                textShadowColor: theme.colors.textColorBold,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 12,
            })
        },
        listItem: {
            fontSize: 12,
            marginBottom: 8,
            color: theme.colors.textColor
        },
        noTextcontainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noDataText: {
            fontSize: 16,
            color: 'gray',
            fontStyle: 'italic',
        },
    });
}

export default GPTSection;