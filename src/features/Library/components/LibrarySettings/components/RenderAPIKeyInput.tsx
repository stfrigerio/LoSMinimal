import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
export const renderAPIKeyInput = (label: string, value: string, onChangeText: (text: string) => void, onBlur: () => void) => {
    const { designs, theme } = useThemeStyles();
    const styles = getStyles(designs, theme);
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[designs.text.input, styles.input]}
                onChangeText={onChangeText}
                onBlur={onBlur}
                value={value}
                placeholder={`Enter ${label}`}
                placeholderTextColor={theme.colors.gray}
                secureTextEntry={label.toLowerCase().includes('secret')}
            />
        </View>
    );
};

const getStyles = (designs: any, theme: Theme) => StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: theme.colors.textColorItalic,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.backgroundColor,
        borderRadius: 12,
        padding: 12,
        backgroundColor: theme.colors.backgroundColor,
        color: theme.colors.textColor,
        fontSize: 16,
    },
});