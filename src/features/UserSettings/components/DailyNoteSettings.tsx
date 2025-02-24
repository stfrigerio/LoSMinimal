// Libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
// Components
import AddHabitModal from './modals/AddHabitModal';
import HabitRow from './atoms/HabitRow'
import AppSettingRow from './atoms/AppSettingRow';
import GluedQuickbutton from '@/src/components/NavBar/GluedQuickbutton';
import Collapsible from '@/src/components/Collapsible';

import { UserSettingData } from '@/src/types/UserSettings';
import { useSettings } from '@/src/features/UserSettings/hooks/useSettings';

const SECTION_TYPES = {
    DAILY_NOTE: 'dailyNoteSettings',
    BOOLEAN_HABITS: 'booleanHabits',
    QUANTIFIABLE_HABITS: 'quantifiableHabits',
} as const;

type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES];

const DailyNoteSettings: React.FC = () => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

    const [expandedSections, setExpandedSections] = useState({
        [SECTION_TYPES.DAILY_NOTE]: false,
        [SECTION_TYPES.BOOLEAN_HABITS]: false,
        [SECTION_TYPES.QUANTIFIABLE_HABITS]: false,
    });

    const { settings, deleteRecord, updateSetting, fetchSettings } = useSettings();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleModalClose = () => {
        setIsModalVisible(false);
        fetchSettings();
    };

    const toggleSection = (section: SectionType) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const renderHabitRow = (key: string, setting: UserSettingData) => (
        <View style={styles.habitRow} key={key}>
            <HabitRow
                habitName={key}
                setting={setting}
                updateSetting={updateSetting}
                deleteRecord={deleteRecord}
            />
        </View>
    );

    const SectionContent: React.FC<{ type: SectionType }> = ({ type }) => {
        // Update the content mapping to handle all section types
        const content = {
            [SECTION_TYPES.DAILY_NOTE]: [], // Empty array for daily note settings as they're handled separately
            [SECTION_TYPES.BOOLEAN_HABITS]: Object.entries(settings)
                .filter(([, setting]) => setting.type === 'booleanHabits'),
            [SECTION_TYPES.QUANTIFIABLE_HABITS]: Object.entries(settings)
                .filter(([, setting]) => setting.type === 'quantifiableHabits'),
        }[type] || [];
    
        return (
            <>
                {content.map(([key, setting]) => renderHabitRow(key, setting))}
            </>
        );
    };

    const renderSectionHeader = (title: string, section: SectionType) => {
        const isSubheader = title.includes('Habits');
        const isDailyNoteSettings = section === SECTION_TYPES.DAILY_NOTE;
    
        return (
            <Pressable 
                onPress={() => toggleSection(section)} 
                style={[
                    isSubheader && styles.subHeader,
                ]}
            >
                <View style={styles.headerContent}>
                    <Text style={[
                        styles.headerText,
                        isSubheader && styles.subHeaderText,
                        !isSubheader && { flex: 1 }
                    ]}>
                        {title}
                    </Text>
                    {!isDailyNoteSettings && (
                        <Text style={[
                            styles.arrow,
                            expandedSections[section] && styles.arrowExpanded,
                        ]}>
                            ▼
                        </Text>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {renderSectionHeader('Daily Note Settings', SECTION_TYPES.DAILY_NOTE)}
                <Text style={[styles.explainerText, { marginBottom: 15, marginHorizontal: 20 }]}>
                    Customize the appearance and behavior of your daily note.
                </Text>
                <View style={styles.sectionContainer}>
                    <View style={styles.settingsGroup}>
                        <AppSettingRow
                            settingKey="QuoteCollapse"
                            label="Auto Collapse Quote"
                            type="appSettings"
                            settings={settings}
                            updateSetting={updateSetting}
                        />
                        <AppSettingRow
                            settingKey="HideQuote"
                            label="Hide Quote"
                            type="appSettings"
                            settings={settings}
                            updateSetting={updateSetting}
                        />
                        <AppSettingRow
                            settingKey="FixedQuote"
                            label="Fixed Daily Quote"
                            type="appSettings"
                            settings={settings}
                            updateSetting={updateSetting}
                        />
                        <AppSettingRow
                            settingKey="BooleanHabitsName"
                            label="Toggle Boolean Habits Name"
                            type="appSettings"
                            settings={settings}
                            updateSetting={updateSetting}
                        />
                        <AppSettingRow
                            settingKey="QuantifiableHabitsName"
                            label="Toggle Quantifiable Habits Name"
                            type="appSettings"
                            settings={settings}
                            updateSetting={updateSetting}
                        />
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    {renderSectionHeader('Boolean Habits', SECTION_TYPES.BOOLEAN_HABITS)}
                    <Collapsible collapsed={!expandedSections[SECTION_TYPES.BOOLEAN_HABITS]}>
                        <Text style={styles.explainerText}>
                            Boolean habits are simple yes/no activities you typically do once a day. 
                            For example, "Did you exercise?" or "Did you read today?". 
                            Your progress will be shown in a colorful calendar view, making it easy to see your consistency over time.
                        </Text>
                        <SectionContent type={SECTION_TYPES.BOOLEAN_HABITS} />
                    </Collapsible>
                </View>

                <View style={styles.sectionContainer}>
                    {renderSectionHeader('Quantifiable Habits', SECTION_TYPES.QUANTIFIABLE_HABITS)}
                    <Collapsible collapsed={!expandedSections[SECTION_TYPES.QUANTIFIABLE_HABITS]}>
                        <Text style={styles.explainerText}>
                            Track habits with numerical goals or counts. For example, "How many glasses of water did you drink?" or "How many cigarettes did you smoke?". 
                            Your progress will be shown as simple line charts, allowing you to see trends over time.
                        </Text>
                        <SectionContent type={SECTION_TYPES.QUANTIFIABLE_HABITS} />
                    </Collapsible>
                </View>
            </ScrollView>

            {isModalVisible && (
                <AddHabitModal
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    onUpdate={updateSetting}
                />
            )}
            
            <View style={styles.quickButtonContainer}>
                <GluedQuickbutton 
                    screen="generalSettings" 
                    onPress={() => setIsModalVisible(true)} 
                />
            </View>
        </View>
    );
};

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
        },
        scrollViewContent: {
            marginTop: 20,
            padding: 20,
            paddingTop: 0,
            paddingBottom: 100,
        },
        sectionContainer: {
            marginBottom: 20,
            borderRadius: 12,
            backgroundColor: theme.colors.backgroundSecondary,
            padding: 10
        },
        settingsGroup: {
            marginTop: 10,
        },
        headerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerText: {
            ...designs.text.title,
            fontSize: designs.text.title.fontSize * 0.7,
            color: theme.colors.textColor,
        },
        subHeader: {
            borderBottomWidth: 0,
        },
        subHeaderText: {
            ...designs.text.subtitle,
        },
        arrow: {
            color: theme.colors.textColor,
            transform: [{ rotate: '0deg' }],
            width: 20,
        },
        arrowExpanded: {
            transform: [{ rotate: '180deg' }],
        },
        habitRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        explainerText: {
            color: theme.colors.gray,
            lineHeight: 20,
            fontSize: 14,
        },
        quickButtonContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        },
    });
};

export default DailyNoteSettings;