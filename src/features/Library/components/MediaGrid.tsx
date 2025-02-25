import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);
    const animatedScales = React.useRef(
        // Add +1 to account for the Settings card
        [...mediaTypes, 'settings'].map(() => new Animated.Value(1))
    ).current;

    const handlePressIn = (index: number) => {
        Animated.spring(animatedScales[index], {
            toValue: 0.65,
            useNativeDriver: true,
            speed: 18,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = (index: number) => {
        Animated.spring(animatedScales[index], {
            toValue: 1,
            useNativeDriver: true,
            speed: 18,
            bounciness: 4,
        }).start();
    };


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
        return theme.colors.textColor;
    }


    const handleNavigate = (index: number) => {
        const typeMap = ['movies', 'series', 'books', 'videogames', 'music'];
        router.push(`/library/${typeMap[index]}`);
    };

    return (
        <>
            <View style={styles.gridContainer}>
                {mediaTypes.map((media, index) => (
                    <Pressable
                        key={index}
                        onPressIn={() => handlePressIn(index)}
                        onPressOut={() => handlePressOut(index)}
                        onPress={() => handleNavigate(index)}
                    >
                        <Animated.View style={[
                            styles.gridCard,
                            {
                                transform: [{ scale: animatedScales[index] }]
                            }
                        ]}>
                            <FontAwesomeIcon 
                                icon={media.icon} 
                                size={32} 
                                color={getColor(media.type)}
                            />
                            <Text style={styles.gridCardText}>
                                {navItems[index].label}
                            </Text>
                        </Animated.View>
                    </Pressable>
                ))}
                {/* Separate Settings Card */}
                <Pressable
                    onPressIn={() => handlePressIn(mediaTypes.length)}
                    onPressOut={() => handlePressOut(mediaTypes.length)}
                    onPress={() => onNavigate(5)}
                >
                    <Animated.View style={[
                        styles.gridCard,
                        {
                            transform: [{ scale: animatedScales[mediaTypes.length] }]
                        }
                    ]}>
                        <FontAwesomeIcon 
                            icon={faGear} 
                            size={32} 
                            color={getColor('settings')}
                        />
                        <Text style={styles.gridCardText}>
                            Settings
                        </Text>
                    </Animated.View>
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
        color: theme.colors.textColorItalic,
        padding: 8,
        paddingVertical: 16,
        textAlign: 'center',
        marginBottom: 0
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.borderColor,
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
        backgroundColor: theme.colors.backgroundSecondary,
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
    gridCardText: {
        color: theme.colors.textColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 