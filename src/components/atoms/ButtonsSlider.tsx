import React, { useRef } from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
type ButtonsSliderProps = {
    selectedValue: number;
    onChange: (value: number) => void;
    twoRows?: boolean;
};

const ButtonsSlider: React.FC<ButtonsSliderProps> = ({ selectedValue, onChange, twoRows = false }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const handleChange = (value: number) => {
        setTimeout(() => {
            onChange(value);
        }, 0);
    };

    const adjustOpacity = (color: string, opacity: number): string => {
        // Parse rgba(r, g, b, a) format
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            const [_, r, g, b] = match;
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    };

    const getColor = (value: number): string => {
        if (value <= 4) return adjustOpacity(theme.colors.redOpacity, 0.5); 
        if (value <= 7) return adjustOpacity(theme.colors.yellowOpacity, 0.5); 
        return adjustOpacity(theme.colors.greenOpacity, 0.3);
    };

    const buttons = [...Array(11)].map((_, index) => (
        <Pressable
            key={index}
            style={[
                styles.button,
                selectedValue === index && styles.selectedButton,
                { backgroundColor: selectedValue === index ? getColor(index) : theme.colors.backgroundSecondary }
            ]}
            onPress={() => handleChange(index)}
        >
            <Text style={[
                styles.buttonText,
                selectedValue === index && styles.selectedButtonText
            ]}>
                {index}
            </Text>
        </Pressable>
    ));

    if (twoRows) {
        return (
            <View style={styles.twoRowsContainer}>
                <View style={styles.row}>
                    {buttons.slice(0, 6)}
                </View>
                <View style={[styles.row, styles.secondRow]}>
                    {buttons.slice(6)}
                </View>
            </View>
        );
    }

    return (
        <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonsContainer}
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            scrollEventThrottle={16}
            style={styles.scrollView}
        >
            {buttons}
        </ScrollView>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    scrollView: {
        marginHorizontal: -16,  // Negative margin to allow padding
        paddingHorizontal: 16,  // Padding to show partial next button
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
        paddingRight: 40,  // Add extra padding to show partial next button
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
    },
    selectedButton: {
        borderColor: 'transparent',
    },
    buttonText: {
        color: theme.colors.textColor,
        fontSize: 16,
        fontWeight: '500',
    },
    selectedButtonText: {
        color: theme.colors.borderColor,
    },
    twoRowsContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    secondRow: {
        marginTop: 8,
    },
});

export default ButtonsSlider;
