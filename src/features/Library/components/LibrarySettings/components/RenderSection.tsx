import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Collapsible from '@/src/components/Collapsible';
import { useState } from 'react';

export const renderSection = (title: string, section: string, children: React.ReactNode) => {
    const { designs, themeColors } = useThemeStyles();
    const styles = getStyles(designs, themeColors);


    const [collapsedSections, setCollapsedSections] = useState({
        books: true,
        movies: true,
        music: true,
        games: true,
    });

    const toggleSection = (section: keyof typeof collapsedSections) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
            <View style={styles.section}>
                <Pressable 
                onPress={() => toggleSection(section as keyof typeof collapsedSections)} 
                style={[
                    styles.sectionHeader,
                    !collapsedSections[section as keyof typeof collapsedSections] && styles.activeSectionHeader
                ]}
            >
                <Text style={styles.title}>{title}</Text>
                <FontAwesomeIcon 
                    icon={collapsedSections[section as keyof typeof collapsedSections] ? faChevronDown : faChevronUp}
                    size={16}
                    color={themeColors.textColor}
                />
            </Pressable>
            <Collapsible collapsed={collapsedSections[section as keyof typeof collapsedSections]}>
                <View style={styles.sectionContent}>
                    {children}
                </View>
            </Collapsible>
        </View>
    )
};

const getStyles = (designs: any, themeColors: any) => StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColor,
    },
    section: {
        marginBottom: 16,
        backgroundColor: themeColors.backgroundSecondary,
        borderRadius: 16,
        marginHorizontal: 20,
        overflow: 'hidden',
        shadowColor: themeColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: themeColors.backgroundSecondary,
    },
    activeSectionHeader: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borderColor,
    },
    sectionContent: {
        padding: 16,
    },
});