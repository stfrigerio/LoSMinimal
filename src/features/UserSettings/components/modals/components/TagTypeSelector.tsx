import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface TagTypeSelectorProps {
    isTagSelected: boolean;
    selectedSection: string;
    onTypeChange: (isTag: boolean) => void;
    onDescriptionWarning: () => void;
    hasLinkedDescriptions: boolean;
}

export const TagTypeSelector: React.FC<TagTypeSelectorProps> = ({
    isTagSelected,
    selectedSection,
    onTypeChange,
    onDescriptionWarning,
    hasLinkedDescriptions,
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <View style={styles.tagTypeSelectorContainer}>
            <Pressable
                style={[styles.tagTypeButton, isTagSelected && styles.activeTagTypeButton]}
                onPress={() => onTypeChange(true)}
            >
                <Text style={[designs.text.text, isTagSelected && styles.activeTagTypeText]}>Tag</Text>
            </Pressable>
            {selectedSection !== 'mood' && (
                <Pressable
                    style={[styles.tagTypeButton, !isTagSelected && styles.activeTagTypeButton]}
                    onPress={() => {
                        if (hasLinkedDescriptions) {
                            onDescriptionWarning();
                        } else {
                            onTypeChange(false);
                        }
                    }}
                >
                    <Text style={[designs.text.text, !isTagSelected && styles.activeTagTypeText]}>
                        Description
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    tagTypeSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tagTypeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.borderColor,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    activeTagTypeButton: {
        backgroundColor: theme.accentColor,
    },
    activeTagTypeText: {
        color: theme.backgroundColor,
        fontWeight: 'bold',
    },
}); 