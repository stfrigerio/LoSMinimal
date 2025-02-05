import { Pressable, Text, StyleSheet} from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';


export const RenderFinishButton = (item: any, handleMarkAsFinished: () => void) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

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

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        marginTop: 30,
        backgroundColor: themeColors.backgroundColor,
    },
    finishButtonText: {
        color: themeColors.textColorBold,
        fontWeight: 'bold',
        fontSize: 16,
    },
});