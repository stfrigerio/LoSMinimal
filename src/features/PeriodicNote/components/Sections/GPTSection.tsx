import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import AlertModal from '@/src/components/modals/AlertModal';
import { useGPTSection } from '../../hooks/useGPTSection';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface GPTSectionProps {
    startDate: Date;
    endDate: Date;
    currentDate: string;
}

const GPTSection: React.FC<GPTSectionProps> = ({ startDate, endDate, currentDate }) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

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
            <View style={styles.noTextcontainer}>
                <Text style={styles.noDataText}>Loading...</Text>
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
                    <Text style={styles.subheading}>Nice:</Text>
                    <Text style={styles.text}>{aiSummary.reflection.nice}</Text>
                </View>
            }
            {aiSummary.reflection.notSoNice && 
                <View>
                    <Text style={styles.subheading}>Not so nice:</Text>
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
const getStyles = (theme: any) => {
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
            color: 'gray',
            fontWeight: 'bold',
            marginBottom: 8,
            marginTop: 8,
        },
        text: {
            fontSize: 12,
            color: theme.textColor,
            marginBottom: 12,
        },
        listItem: {
            fontSize: 12,
            marginBottom: 8,
            color: theme.textColor
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