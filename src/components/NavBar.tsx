import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, Keyboard, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';    
import { faSliders } from '@fortawesome/free-solid-svg-icons';

import DrawerContent from './NavBar/DrawerContent';
import DrawerIcon from './NavBar/DrawerIcon';
import { useNavbarDrawer } from '@/src/contexts/NavbarContext';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import NavbarQuickButton from './NavBar/NavbarQuickButton';

import { MobileNavbarProps } from './NavBar/NavbarTypes';

const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
    items, 
    activeIndex, 
    showFilter = false,
    onFilterPress,
    quickButtonFunction,
    screen,
}) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { slideAnim } = useNavbarDrawer();
    const [isFilterActive, setIsFilterActive] = useState(false);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                Animated.timing(keyboardHeight, {
                    toValue: 80, // Adjusted to move navbar downward
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                Animated.timing(keyboardHeight, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, [keyboardHeight]);

    const handleFilterPress = () => {
        setIsFilterActive(!isFilterActive);
        onFilterPress && onFilterPress();
    };

    return (
        <>
            <Animated.View 
                style={[
                    styles.navbarContent, 
                    { 
                        transform: [
                            { translateY: slideAnim },
                            { translateY: keyboardHeight }
                        ] 
                    }
                ]}
            >
                {items.length > 0 && (
                    <>
                        <DrawerIcon />
                        <DrawerContent items={items} activeIndex={activeIndex} />
                    </>
                )}
                {showFilter && (
                    <Pressable style={styles.filterIconWrapper} onPress={handleFilterPress}>
                        <FontAwesomeIcon 
                            icon={faSliders} 
                            color={isFilterActive ? themeColors.accentColor : themeColors.gray} 
                            size={24} 
                        />
                    </Pressable>
                )}
                {quickButtonFunction && (
                    <View style={styles.quickButtonContainer}>
                        <NavbarQuickButton quickButtonFunction={quickButtonFunction} screen={screen} />
                    </View>
                )}
            </Animated.View>
            <Animated.View 
                style={[
                    styles.coverUp, 
                    { 
                        transform: [
                            { translateY: slideAnim },
                            { translateY: keyboardHeight }
                        ] 
                    }
                ]} 
            />
        </>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        navbarContent: {
            height: 60,
            borderTopWidth: 1,
            borderTopColor: theme.textColor,
            backgroundColor: theme.backgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            zIndex: 200,
        },
        backIconWrapper: {
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1002,
        },
        filterIconWrapper: {
            position: 'absolute',
            right: 100,
            width: 60,
            height: 60,
            bottom: -4,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1002,
        },
        quickButtonContainer: {
            position: 'absolute',
            width: 60,
            height: 50,
            justifyContent: 'center',
            right: 15,
            bottom: 0, 
        },
        coverUp: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            backgroundColor: theme.backgroundColor,
        },
    });
};

export default MobileNavbar;
