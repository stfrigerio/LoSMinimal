import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

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
    const { designs, themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={designs.text.input}
                placeholderTextColor={themeColors.gray}
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

const getStyles = (themeColors: any) => StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    inputLabel: {
        color: themeColors.gray,
        marginLeft: 5,
        marginBottom: 0,
    },
});