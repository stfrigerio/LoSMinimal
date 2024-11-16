import React, { useEffect } from 'react';
import { View, Pressable, Text, TextInput, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileExport, faFileImport, faShareAlt } from '@fortawesome/free-solid-svg-icons';

import AlertModal from '@/src/components/modals/AlertModal';
import { useNavbarDrawer } from '@/src/contexts/NavbarContext';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useServerSection } from '../hooks/useServerSection';

const ServerSection = () => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { setKeyboardVisible } = useNavbarDrawer();

    const {
        serverURL,
        setServerURL,
        isImporting,
        alertConfig,
        setAlertConfig,
        saveServerURL,
        showFormatSelector
    } = useServerSection();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [setKeyboardVisible]);

    const handleServerURLChange = (text: string) => {
        setServerURL(text);
    };

    const handleServerURLBlur = async () => {
        await saveServerURL();
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonAndLabelContainer}>
                    <Text style={styles.buttonLabel}>Export Backup</Text>
                    <Pressable 
                        style={styles.button} 
                        onPress={() => showFormatSelector('export')}
                    >
                        <FontAwesomeIcon icon={faFileExport} size={20} color={themeColors.gray} />
                    </Pressable>
                </View>

                <View style={styles.buttonAndLabelContainer}>
                    <Text style={styles.buttonLabel}>Import Backup</Text>
                    <Pressable 
                        style={styles.button} 
                        onPress={() => showFormatSelector('import')}
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <ActivityIndicator color={themeColors.accentColor} />
                        ) : (
                            <FontAwesomeIcon icon={faFileImport} size={20} color={themeColors.gray} />
                        )}
                    </Pressable>
                </View>

                <View style={styles.buttonAndLabelContainer}>
                    <Text style={styles.buttonLabel}>Share Backup</Text>
                    <Pressable 
                        style={styles.button} 
                        onPress={() => showFormatSelector('share')}
                    >
                        <FontAwesomeIcon icon={faShareAlt} size={20} color={themeColors.gray} />
                    </Pressable>
                </View>
            </View>

            <View style={[styles.buttonContainer, { marginTop: 30 }]}>
                <View style={styles.buttonAndLabelContainer}>
                    <Text style={styles.buttonLabel}>Server URL</Text>
                    <TextInput
                        style={[designs.text.input, { marginBottom: 10 }]}
                        onChangeText={handleServerURLChange}
                        onBlur={handleServerURLBlur}
                        value={serverURL}
                        placeholder="192.168.1.46"
                        placeholderTextColor={themeColors.gray}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {alertConfig && (
                <AlertModal
                    isVisible={!!alertConfig}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onConfirm={() => {
                        alertConfig.onConfirm();
                        setAlertConfig(null);
                    }}
                    singleButton={alertConfig.singleButton}
                    onCancel={() => setAlertConfig(null)}
                    customButtons={alertConfig.customButtons}
                />
            )}
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    buttonAndLabelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 5,
    },
    buttonLabel: {
        color: themeColors.gray,
        fontSize: 10,
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        padding: 10,
        borderRadius: 10,
        minWidth: 90,
        justifyContent: 'center',
    },
});

export default ServerSection;