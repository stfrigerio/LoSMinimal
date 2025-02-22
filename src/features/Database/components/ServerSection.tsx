import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Platform 
} from 'react-native';
import { faFileExport, faFileImport, faShareAlt } from '@fortawesome/free-solid-svg-icons';


import DestructionSection from './DestructionSection';
import AlertModal from '@/src/components/modals/AlertModal';
import BackupActionButton from './atoms/BackupActionButton';
import { SwitchInput } from '@/src/components/FormComponents';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useServerSection } from '../hooks/useServerSection';

const ServerSection = ({ setShowTableSelector, showTableSelector }: { setShowTableSelector: (value: boolean) => void, showTableSelector: boolean }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
	const [showDestructionSection, setShowDestructionSection] = useState(false);

    const {
        serverURL,
        setServerURL,
        isImporting,
        isExporting,
        alertConfig,
        setAlertConfig,
        saveServerURL,
        showFormatSelector
    } = useServerSection();

    const handleServerURLChange = (text: string) => {
        // Replace any commas with dots
        const transformedText = text.replace(/,/g, '.');
        // Allow numbers and dots for IP address format
        if (/^[\d.]*$/.test(transformedText)) {
            setServerURL(transformedText);
        }
    };

    const handleServerURLBlur = async () => {
        await saveServerURL();
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <BackupActionButton
                    label="Export Backup"
                    icon={faFileExport}
                    onPress={() => showFormatSelector('export')}
                    isLoading={isExporting}
                />

                <BackupActionButton
                    label="Import Backup"
                    icon={faFileImport}
                    onPress={() => showFormatSelector('import')}
                    isLoading={isImporting}
                    disabled={isImporting}
                />

                <BackupActionButton
                    label="Share Backup"
                    icon={faShareAlt}
                    onPress={() => showFormatSelector('share')}
                />
            </View>

            <View style={styles.urlSwitchContainer}>

                <View style={[styles.buttonContainer, { marginRight: 20 }]}>
                    <View style={styles.buttonAndLabelContainer}>
                        <Text style={styles.buttonLabel}>Server URL</Text>
                        <TextInput
                            style={[designs.text.input, styles.urlInput]}
                            onChangeText={handleServerURLChange}
                            onBlur={handleServerURLBlur}
                            value={serverURL}
                            placeholder="192.168.1.46"
                            placeholderTextColor={themeColors.gray}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>

                <View style={styles.switchContainer}>
                    <SwitchInput  
                        value={showDestructionSection}
                        onValueChange={(value: boolean) => setShowDestructionSection(value)}
                        trueLabel='Engage Database Destruction'
                        falseLabel=''
                        trackColorTrue={themeColors.accentColor}
                        leftLabelOff={true}
                        style={styles.switch}
                    />
                    <SwitchInput  
                        value={showTableSelector}
                        onValueChange={(value: boolean) => setShowTableSelector(value)}
                        trueLabel='Show Table Selector'
                        falseLabel=''
                        trackColorTrue={themeColors.accentColor}
                        leftLabelOff={true}
                        style={styles.switch}
                    />
                </View>

            </View>

            {showDestructionSection && (
				<DestructionSection />
			)}

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
    urlInput: {
        minWidth: 120,
    },
    urlSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        // borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    switchContainer: {
        // borderWidth: 1,
        // borderColor: themeColors.redOpacity,
        // borderRadius: 10,
        padding: 10,
		width: '50%'
	},
    switch: {
        fontSize: 11,
    },
});

export default ServerSection;