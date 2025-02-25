import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface FormInputProps {
    label: string;
    value: string;
    onChangeText?: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
    isNumeric?: boolean;
    editable?: boolean;
    containerStyle?: StyleSheet;
    inputStyle?: StyleSheet;
}


export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    value, 
    isNumeric = false, 
    onChangeText, 
    onBlur,
    editable = true, 
    ...props 
}) => {
    const { designs, theme } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={designs.text.input}
                placeholderTextColor={theme.colors.gray}
                keyboardType={isNumeric ? 'numeric' : props.keyboardType}
                onChangeText={onChangeText}
                value={value}
                editable={editable}
                onBlur={onBlur}
                {...props}
            />
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    inputLabel: {
        color: theme.colors.gray,
        marginLeft: 5,
        marginBottom: 5,
        fontFamily: theme.typography.fontFamily.primary,
    },
});