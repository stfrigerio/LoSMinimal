import { Pressable, Text, StyleSheet} from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';


export const RenderFinishButton = (item: any, handleMarkAsFinished: () => void) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

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

const getStyles = (theme: any, designs: any) => StyleSheet.create({
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.borderColor,
        marginTop: 30,
        backgroundColor: theme.backgroundColor,
    },
    finishButtonText: {
        color: theme.textColorBold,
        fontWeight: 'bold',
        fontSize: 16,
    },
});