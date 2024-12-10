import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions, Animated, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDay, faCheck, faCog } from '@fortawesome/free-solid-svg-icons';

import CustomCalendar from './components/Calendar/Calendar';
import TimerComponent from './components/TimerComponent';
import QuickButton from './components/QuickButton';
import NextObjective from './components/NextObjective';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { fetchNextTask } from './hooks/fetchNextTask';
import { DrawerStateManager } from '@/src/contexts/DrawerState';
import { useNavigationComponents } from '@/src/features/LeftPanel/helpers/useNavigation';
import DayNotesStatus from './components/DayNotesStatus';
import MusicPlayerControls from '../Music/components/MusicPlayerControls';
import { getStartOfToday } from '@/src/utils/timezoneBullshit';
import { useMusicPlayer } from '@/src/contexts/MusicPlayerContext';

const Homepage = () => {
    const { theme, themeColors } = useThemeStyles();
    const styles = getStyles(theme);

    const [isQuickButtonExpanded, setIsQuickButtonExpanded] = useState(false);
    const settingsSlideAnim = useRef(new Animated.Value(0)).current;
    const settingsRotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { openSettings, openDailyNote } = useNavigationComponents();
    const { isPlaying } = useMusicPlayer();

    useEffect(() => {
        if (DrawerStateManager) {
            DrawerStateManager.enableAllSwipeInteractions();
        }
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(settingsSlideAnim, {
                toValue: isQuickButtonExpanded ? -80 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(settingsRotateAnim, {
                toValue: isQuickButtonExpanded ? 1 : 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isQuickButtonExpanded]);

    useEffect(() => {
        if (!isQuickButtonExpanded) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isQuickButtonExpanded]);

    const spin = settingsRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-240deg']
    });

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('@/assets/images/evening.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <CustomCalendar />
                        <DayNotesStatus />
                        <Animated.View style={{
                            width: '80%',
                        }}>
                            <NextObjective 
                                fetchNextTask={(setTask, setTime) => {
                                    fetchNextTask(
                                        (task) => setTask(task ?? ''),
                                        (time) => setTime(time ?? '')
                                    );
                                }} 
                            />                    
                        </Animated.View>
                        <View style={{ flexDirection: isPlaying ? 'column' : 'row', alignItems: 'center' }}>
                            <MusicPlayerControls screen='home'/>
                            <Pressable onPress={() => openDailyNote(getStartOfToday().toString())} style={{ padding: 20, borderRadius: 8 }}>
                                {({ pressed }) => (
                                    <FontAwesomeIcon icon={faCalendarDay} size={pressed ? 18 : 22} color={pressed ? themeColors.accentColor : themeColors.textColor} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.footerActions}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <TimerComponent />
                </Animated.View>
                <View style={styles.quickButtonContainer}>
                    <QuickButton 
                        isExpanded={isQuickButtonExpanded} 
                        setIsExpanded={setIsQuickButtonExpanded} 
                    />
                    <Animated.View style={[
                        styles.settingsButton,
                        { 
                            transform: [
                                { translateX: settingsSlideAnim },
                                { rotate: spin }
                            ] 
                        }
                    ]}>
                        <Pressable onPress={openSettings} >
                            { ({ pressed }) => (
                                <FontAwesomeIcon 
                                    icon={faCog} 
                                    size={28} 
                                    color={pressed ? themeColors.accentColor : themeColors.gray}
                                    style={{ transform: [{ scale: pressed ? 0.8 : 1 }] }}
                                />
                            )}
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.3)' : undefined,
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    quickButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsButton: {
        position: 'absolute',
        right: 0,
        padding: 10,
        zIndex: 1,
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
    },
});

export default Homepage;