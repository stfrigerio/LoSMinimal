import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions, Animated, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import CustomCalendar from './components/Calendar/Calendar';
import TimerComponent from './components/TimerComponent';
import QuickButton from './components/QuickButton';
// import NextObjective from './components/NextObjective';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useHomepage } from './hooks/useHomepage';
import { useNavigationComponents } from '@/app/(drawer)/features/LeftPanel/helpers/useNavigation';
import { fetchNextTask } from './hooks/fetchNextTask';

const Homepage = () => {
    const { theme, themeColors } = useThemeStyles();
    const styles = getStyles(theme);

    const [isQuickButtonExpanded, setIsQuickButtonExpanded] = useState(false);
    const settingsSlideAnim = useRef(new Animated.Value(0)).current;
    const settingsRotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { homepageSettings } = useHomepage();
    const { openSettings } = useNavigationComponents();

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

    const shouldShow = (setting?: { value: string }) => {
        return setting === undefined || setting.value !== "true";
    };

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
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.footerActions}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <TimerComponent homepageSettings={homepageSettings} />
                </Animated.View>
                {shouldShow(homepageSettings.HideNextObjective) && (
                    <Animated.View style={{
                        opacity: fadeAnim,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                    }}>
                        {/* <NextObjective homepageSettings={homepageSettings} fetchNextTask={fetchNextTask} /> */}
                    </Animated.View>
                )}
                <View style={styles.quickButtonContainer}>
                    <QuickButton 
                        isExpanded={isQuickButtonExpanded} 
                        setIsExpanded={setIsQuickButtonExpanded} 
                        homepageSettings={homepageSettings}
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
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Homepage;