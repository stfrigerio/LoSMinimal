import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { colorRainbow } from '@/src/styles/theme';

interface MediaGridProps {
    mediaTypes: Array<{
        type: string;
        icon: IconDefinition;
    }>;
    navItems: Array<{ label: string }>;
    onNavigate: (index: number) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ mediaTypes, navItems, onNavigate }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    const getColor = (type: string) => {
        if(type === 'movie') {
            return colorRainbow[7];
        }
        if(type === 'series') {
            return colorRainbow[6];
        }
        if(type === 'videogame') {
            return colorRainbow[1];
        }   
        if(type === 'book') {
            return colorRainbow[15];
        }
        if(type === 'music') {
            return colorRainbow[14];
        }
        if(type === 'settings') {
            return colorRainbow[13];
        }
        return themeColors.textColor;
    }

    return (
        <>
            <View style={[styles.separator, { marginTop: 8 }]} />
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={[styles.separator, { marginBottom: 16 }]} />
            <View style={styles.gridContainer}>
                {mediaTypes.map((media, index) => (
                    <Pressable
                        key={index}
                        style={styles.gridCard}
                        onPress={() => onNavigate(index)}
                    >
                        <FontAwesomeIcon 
                            icon={media.icon} 
                            size={32} 
                            color={getColor(media.type)}
                        />
                        <Text style={styles.gridCardText}>
                            {navItems[index].label}
                        </Text>
                    </Pressable>
                ))}
                {/* Separate Settings Card */}
                <Pressable
                    style={styles.gridCard}
                    onPress={() => onNavigate(5)} // 5 is settings index
                >
                    <FontAwesomeIcon 
                        icon={faGear} 
                        size={32} 
                        color={getColor('settings')}
                    />
                    <Text style={styles.gridCardText}>
                        Settings
                    </Text>
                </Pressable>
            </View>
        </>
    );
};

const { width: screenWidth } = Dimensions.get('window');
const PADDING = 16;
const GAP = 16;
const cardWidth = (screenWidth - (PADDING * 2) - GAP) / 2;

const getStyles = (theme: any, design: any) => StyleSheet.create({
    sectionTitle: {
        ...design.text.title,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textColorItalic,
        padding: 8,
        paddingVertical: 16,
        textAlign: 'center',
        marginBottom: 0
    },
    separator: {
        height: 1,
        backgroundColor: theme.borderColor,
        marginHorizontal: PADDING,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: PADDING,
        gap: GAP,
    },
    gridCard: {
        width: cardWidth,
        height: 160,
        backgroundColor: theme.backgroundSecondary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        gap: 12,
    },
    // fullWidthCard: {
    //     width: screenWidth - (PADDING * 2),
    //     height: 120,
    //     marginTop: GAP - 12,
    // },
    gridCardText: {
        color: theme.textColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 