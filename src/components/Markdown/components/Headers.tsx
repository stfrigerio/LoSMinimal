import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface HeaderComponentProps {
    line: string;
    isCollapsed: boolean;
    onToggle: () => void;
    markdownStyles: any;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
    line,
    isCollapsed,
    onToggle,
    markdownStyles,
}) => {
    const { themeColors } = useThemeStyles();
    
    return (
        <Pressable onPress={onToggle} style={styles.headerContainer}>
            <View style={styles.iconContainer}>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    style={[
                        styles.icon,
                        { transform: [{ rotate: isCollapsed ? '0deg' : '90deg' }] }
                    ]}
                    size={10}
                    color={themeColors.textColor}
                />
            </View>
            <View style={styles.headerContent}>
                <Markdown style={markdownStyles}>{line}</Markdown>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 20,
        justifyContent: 'center',
    },
    headerContent: {
        flex: 1,
    },
    icon: {
        width: 12,
        height: 12,
    },
});