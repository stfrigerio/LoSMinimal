import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

export const renderAPIKeyInput = (label: string, value: string, onChangeText: (text: string) => void, onBlur: () => void) => {
    const { designs, themeColors } = useThemeStyles();
    const styles = getStyles(designs, themeColors);
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[designs.text.input, styles.input]}
                onChangeText={onChangeText}
                onBlur={onBlur}
                value={value}
                placeholder={`Enter ${label}`}
                placeholderTextColor={themeColors.gray}
                secureTextEntry={label.toLowerCase().includes('secret')}
            />
        </View>
    );
};

const getStyles = (designs: any, themeColors: any) => StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: themeColors.textColorItalic,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: themeColors.backgroundColor,
        borderRadius: 12,
        padding: 12,
        backgroundColor: themeColors.backgroundColor,
        color: themeColors.textColor,
        fontSize: 16,
    },
});