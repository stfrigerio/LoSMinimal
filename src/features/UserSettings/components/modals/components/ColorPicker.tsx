import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface ColorPickerComponentProps {
    onColorSelected: (color: string) => void;
    style: object;
    initialColor: string;
}

const ColorPickerComponent: React.FC<ColorPickerComponentProps> = ({ onColorSelected, style, initialColor }) => {
    const [color, setColor] = useState(initialColor);
    const [inputColor, setInputColor] = useState(initialColor);

    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    useEffect(() => {
        setColor(initialColor);
        setInputColor(initialColor);
    }, [initialColor]);

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        setInputColor(newColor);
        onColorSelected(newColor);
    };

    const handleInputChange = (text: string) => {
        setInputColor(text);
        if (/^#[0-9A-F]{6}$/i.test(text)) {
        setColor(text);
        onColorSelected(text);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <ColorPicker
                color={color}
                onColorChange={handleColorChange}
                thumbSize={20}
                sliderSize={20}
                noSnap={true}
                row={true}
            />
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hex Color:</Text>
                <TextInput
                    style={styles.input}
                    value={inputColor}
                    onChangeText={handleInputChange}
                    placeholder={theme.colors.gray}
                    maxLength={7}
                />
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    inputLabel: {
        marginRight: 10,
        fontSize: 16,
        color: theme.colors.textColor,
    },
    input: {
        width: '50%',
        color: theme.colors.textColor,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        borderRadius: 5,
        padding: 10,
    },
});

export default ColorPickerComponent;