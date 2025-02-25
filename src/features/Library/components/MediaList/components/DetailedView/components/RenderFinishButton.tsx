import { Pressable, Text, StyleSheet} from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';

export const RenderFinishButton = (item: any, handleMarkAsFinished: () => void) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    if (item.finished === 0) {
        return (
            <Pressable 
                onPress={handleMarkAsFinished} 
                style={styles.finishButton}
            >
                <Text style={styles.finishButtonText}>
                    Mark as Finished
                </Text>
            </Pressable>
        );
    }
    return null;
};

const getStyles = (theme: Theme) => StyleSheet.create({
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        marginTop: 30,
        backgroundColor: theme.colors.backgroundColor,
    },
    finishButtonText: {
        color: theme.colors.textColorBold,
        fontWeight: 'bold',
        fontSize: 16,
    },
});