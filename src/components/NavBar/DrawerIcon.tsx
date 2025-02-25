import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { useNavbarDrawer } from '@/src/contexts/NavbarContext';

interface DrawerIconProps {
}

const DrawerIcon: React.FC<DrawerIconProps> = () => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const { isOpen, toggleDrawer } = useNavbarDrawer();
    const iconAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(iconAnimation, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen, iconAnimation]);

    const topLineRotation = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    const bottomLineRotation = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg']
    });

    const lineOpacity = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    });

    const lineTranslate = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 11]
    });

    // Scale transformation for the X shape
    const scale = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2] // Increase scale from 1 to 1.1
    });

    // Translation to the right for alignment
    const containerTranslateX = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 6] // Move right by 10 units
    });

    return (
        <Pressable style={styles.iconWrapper} onPress={toggleDrawer}>
            <Animated.View style={[
                styles.iconContainer,
                { transform: [{ translateX: containerTranslateX }] } // Apply translation to the container
            ]}>
                <Animated.View style={[
                    styles.iconLine,
                    styles.topLine,
                    { 
                        transform: [
                            { rotate: topLineRotation },
                            { translateY: lineTranslate },
                            { scale: scale },
                        ],
                    }
                ]} />
                <Animated.View style={[
                    styles.iconLine,
                    styles.middleLine,
                    { opacity: lineOpacity }
                ]} />
                <Animated.View style={[
                    styles.iconLine,
                    styles.bottomLine,
                    { 
                        transform: [
                            { rotate: bottomLineRotation },
                            { translateY: Animated.multiply(lineTranslate, -1) },
                            { scale: scale },
                        ],
                    }
                ]} />
            </Animated.View>
        </Pressable>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    iconWrapper: {
        width: 60,
        height: 54,
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 1200,
        // borderWidth: 1,
        // borderColor: 'blue',
        position: 'absolute',
        left: 15,
        right: 0,
        bottom: 0,
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, //? Adjust this value to fine-tune vertical position
        zIndex: 14
    },
    iconLine: {
        position: 'absolute',
        width: 24,
        height: 2,
        backgroundColor: theme.colors.gray,
    },
    topLine: {
        top: 0,
    },
    middleLine: {
        top: 8,
    },
    bottomLine: {
        top: 16,
    },
});


export default DrawerIcon;