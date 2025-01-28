import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { databaseManagers } from '@/database/tables';
import { getISOWeekData } from '@/src/utils/timezoneBullshit';
import { useTimer } from '@/src/features/Home/hooks/useTimer';

import { ObjectiveData } from '@/src/types/Objective';

interface ObjectiveWithPillarEmoji extends ObjectiveData {
    pillarEmoji: string;
}

interface NextObjectiveProps {
    fetchNextTask: (setNextTask: (task: string) => void, setTimeLeft: (time: string) => void) => void;
}

const NextObjective: React.FC<NextObjectiveProps> = ({ fetchNextTask }) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const [objectives, setObjectives] = useState<ObjectiveWithPillarEmoji[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSlideAnim] = useState(new Animated.Value(0));
    const [nextSlideAnim] = useState(new Animated.Value(300));
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandAnim] = useState(new Animated.Value(40));

    const [nextTask, setNextTask] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const opacity = useRef(new Animated.Value(1)).current;
    const [bgColorAnim] = useState(new Animated.Value(0)); // Add this new animated value

    useEffect(() => {
        fetchWeeklyObjectives();
    }, []);

    const fetchWeeklyObjectives = async () => {
        try {
            const currentWeek = getISOWeekData(new Date());
            const formattedWeek = `${currentWeek.year}-W${currentWeek.week.toString().padStart(2, '0')}`;
            const response = await databaseManagers.objectives.getObjectives({ period: formattedWeek });
            const pillars = await databaseManagers.pillars.getPillars();
            
            const objectivesWithPillarEmoji = response.map(objective => {
                const pillar = pillars.find(p => p.uuid === objective.pillarUuid);
                return {
                    ...objective,
                    pillarEmoji: pillar?.emoji,
                };
            });

            if (objectivesWithPillarEmoji && objectivesWithPillarEmoji.length > 0) {
                setObjectives(objectivesWithPillarEmoji as ObjectiveWithPillarEmoji[]);
            }
        } catch (error) {
            console.error("Error fetching objectives:", error);
        }
    };

    const handleFetchNextTask = () => {
        const animateOpacity = () => {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.5,
                    duration: 100,
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ]).start();
        };

        if (Platform.OS !== 'web') {
            animateOpacity(); // Trigger animation
            fetchNextTask(setNextTask, setTimeLeft);
        }
    };

    useEffect(() => {
        handleFetchNextTask(); // Initial fetch on component mount
    }, []);

    const animateSlide = () => {
        Animated.parallel([
            Animated.timing(currentSlideAnim, {
                toValue: -300,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(nextSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % objectives.length);
            currentSlideAnim.setValue(0);
            nextSlideAnim.setValue(300);
        });
    };

    const showNextObjective = () => {
        if (objectives.length > 1) {
            animateSlide();
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        
        // Animate both height and background color
        Animated.parallel([
            Animated.timing(expandAnim, {
                toValue: isExpanded ? 40 : 200,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(bgColorAnim, {
                toValue: isExpanded ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
            })
        ]).start();

        // Fetch next task when expanding
        if (!isExpanded) {
            handleFetchNextTask();
        }
    };

    const handlePress = () => {
        showNextObjective();
    };

    const handleLongPress = () => {
        toggleExpand();
    };

    if (objectives.length === 0) {
        return null;
    }

    const backgroundColor = bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.8)']
    });

    const renderNextTask = () => {
        return (
            <>
                {nextTask && (
                    <Animated.View style={{ opacity }}>
                        <Pressable onPress={handleFetchNextTask} style={styles.nextTaskContainer}>
                            <Text style={styles.nextTask} numberOfLines={1} ellipsizeMode="tail">"{nextTask}"</Text>
                            <Text style={styles.timeLeft}>{timeLeft}</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </>
        );
    };

    const nextIndex = (currentIndex + 1) % objectives.length;

    return (
        <Animated.View style={
            [
                styles.container, 
                { 
                    height: expandAnim, 
                    backgroundColor
                }
            ]
        }>
            <Pressable 
                onPress={handlePress}
                onLongPress={handleLongPress}
                style={styles.objectiveWrapper}
            >   
                {isExpanded && (
                    <>
                        <Text style={styles.miniHeader}>Next Objectives</Text>
                        <View style={styles.miniHeaderSeparator} />
                    </>
                )}
                {/* Task nella view */}
                <Animated.View style={[styles.objectiveContainer, { transform: [{ translateX: currentSlideAnim }] }]}>
                    <Text 
                        numberOfLines={isExpanded ? undefined : 1} 
                        ellipsizeMode={isExpanded ? undefined : "tail"} 
                        style={
                            [
                                styles.objectiveText, 
                                { 
                                    fontWeight: isExpanded ? 'bold' : 'normal', 
                                    fontSize: isExpanded ? 14 : 8,
                                    color: isExpanded ? themeColors.textColorBold : '#d3c6aa', 
                                    alignSelf: 'center',
                                    marginTop: isExpanded ? 0 : 5,
                                }
                            ]
                        }
                    >
                        {objectives[currentIndex].pillarEmoji} {objectives[currentIndex].objective}

                    </Text>
                </Animated.View>
                {/* Task che scorre into view */}
                <Animated.View style={[styles.objectiveContainer, { transform: [{ translateX: nextSlideAnim }], position: 'absolute' }]}>
                    <Text 
                        numberOfLines={isExpanded ? undefined : 1} 
                        ellipsizeMode={isExpanded ? undefined : "tail"} 
                        style={
                            [
                                styles.objectiveText, 
                                { 
                                    fontWeight: isExpanded ? 'bold' : 'normal', 
                                    fontSize: isExpanded ? 14 : 8,
                                    color: isExpanded ? themeColors.textColorBold : themeColors.textColor, 
                                    marginTop: isExpanded ? 40 : 5,
                                    alignSelf: 'center'
                                }
                            ]
                        }
                    >
                        {objectives[nextIndex].pillarEmoji} {objectives[nextIndex].objective}
                    </Text>
                </Animated.View>
                {isExpanded && ( 
                    <View style={styles.nextTaskWrapper}>
                        <Text style={styles.miniHeader}>Next Task</Text>
                        <View style={styles.miniHeaderSeparator} />
                        {renderNextTask()}
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',
    },
    objectiveWrapper: {
        flex: 1,
        position: 'relative',
    },
    objectiveContainer: {
        flex: 1,
    },
    objectiveText: {
        fontFamily: 'serif',
        alignSelf: 'center',
    },
    nextButton: {
        padding: 5,
    },
    miniHeader: {
        fontSize: 16,
        color: themeColors.gray,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'center',
    },
    miniHeaderSeparator: {
        height: 1,
        width: '100%',
        backgroundColor: themeColors.gray,
        marginBottom: 12,
    },
    nextTaskWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    nextTaskContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextTask: {
        fontSize: 10,
        color: themeColors.gray,
        textAlign: 'center',
    },
    timeLeft: {
        fontSize: 12,
        marginTop: 8,
        color: themeColors.gray,
        fontStyle: 'italic',
    },
});

export default NextObjective;