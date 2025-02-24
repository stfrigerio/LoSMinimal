import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faPlus, 
    faCommentDots, 
    faJournalWhills, 
    faUserPlus, 
    faCircleCheck, 
    faClock, 
    faBullseye, 
    faFilm, 
    faBook, 
    faGamepad, 
    faTv,
    faMusic 
} from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface NavbarQuickButtonProps {
    quickButtonFunction: () => void;
    screen?: string;
}

const NavbarQuickButton: React.FC<NavbarQuickButtonProps> = ({ quickButtonFunction, screen }) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const iconMap = {
        mood: faCommentDots,
        journal: faJournalWhills,
        people: faUserPlus,
        tasks: faCircleCheck,
        time: faClock,
        objectives: faBullseye, 
        movie: faFilm,
        book: faBook,
        videogame: faGamepad,
        series: faTv,
        music: faMusic,
    };

    const selectedIcon = iconMap[screen as keyof typeof iconMap] || faPlus;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.floatingButton,
                pressed && styles.pressed
            ]}
            onPress={quickButtonFunction}
        >
            {({ pressed }) => (
                <FontAwesomeIcon 
                    icon={selectedIcon} 
                    size={24} 
                    color={pressed ? theme.colors.textColor : theme.colors.backgroundColor} 
                    style={{ 
                        transform: [
                            { scale: pressed ? 0.9 : 1 },
                            { rotate: pressed ? '-10deg' : '0deg' }
                        ],
                        opacity: pressed ? 0.8 : 1,
                    }}
                />
            )}
        </Pressable>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    floatingButton: {
        backgroundColor: theme.colors.accentColor,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        transform: [{ scale: 0.96 }],
    },
});

export default NavbarQuickButton;