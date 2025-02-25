import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput, Platform, BackHandler, Text, ScrollView } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import MobileMarkdown from '@/src/components/Markdown/Markdown';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AlertModal from '@/src/components/modals/AlertModal';
import { saveMarkdownContent } from '../helpers/openMarkdownViewer';

export const MarkdownViewerScreen: React.FC = () => {
    const { content: initialContent, title } = useLocalSearchParams<{ content: string; title: string }>();
    const { theme } = useThemeStyles();

    const styles = useMemo(() => getStyles(theme), [theme]);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const onClose = () => {
        router.back();
    };

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);
            await saveMarkdownContent(title as string, content);
            setIsEditing(false);
        } catch (error) {
            setSaveError('Failed to save changes. Please try again.');
            console.error('Error saving markdown:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleMarkdownChange = async (newContent: string) => {
        setContent(newContent);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable 
                    onPress={() => {
                        if (isEditing) {
                            setShowDiscardModal(true);
                        } else {
                            onClose();
                        }
                    }} 
                    style={styles.backButton}
                >
                    {({ pressed }) => (
                        <Ionicons 
                            name="arrow-back" 
                            size={24} 
                            color={pressed ? theme.colors.accentColor : theme.colors.textColor} 
                        />
                    )}
                </Pressable>
                <View style={styles.headerButtons}>
                    {!isEditing ? (
                        <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
                            <Ionicons name="pencil" size={24} color={theme.colors.textColor} />
                        </Pressable>
                    ) : (
                        <Pressable 
                            onPress={handleSave} 
                            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            disabled={isSaving}
                        >
                            <Ionicons 
                                name={isSaving ? "hourglass" : "checkmark"} 
                                size={24} 
                                color={theme.colors.textColor} 
                            />
                        </Pressable>
                    )}
                </View>
            </View>
            
            {isEditing ? (
                <TextInput
                    style={styles.markdownInput}
                    value={content}
                    onChangeText={handleMarkdownChange}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            ) : (
                <ScrollView style={styles.markdownContainer}>
                    <MobileMarkdown onChange={handleMarkdownChange}>
                        {content}
                    </MobileMarkdown>
                </ScrollView>

            )}

            {saveError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{saveError}</Text>
                </View>
            )}

            {showDiscardModal && (
                <AlertModal
                    isVisible={showDiscardModal}
                    title="Discard Changes"
                    message="You have unsaved changes. Are you sure you want to discard them?"
                    onConfirm={() => {
                        setShowDiscardModal(false);
                        setIsEditing(false);
                        onClose();
                    }}
                    onCancel={() => setShowDiscardModal(false)}
                />
            )}
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        paddingTop: 30
    },
    markdownContainer: {
        // flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderColor,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    editButton: {
        padding: 4,
        marginLeft: 16,
    },
    saveButton: {
        padding: 4,
        marginLeft: 16,
    },
    markdownInput: {
        flex: 1,
        padding: 16,
        fontSize: 14,
        color: theme.colors.textColor,
        textAlignVertical: 'top',
        fontFamily: 'monospace',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    errorContainer: {
        backgroundColor: theme.colors.redOpacity,
        padding: 8,
        margin: 16,
        borderRadius: 4,
    },
    errorText: {
        color: theme.colors.textColor,
        textAlign: 'center',
    },
});