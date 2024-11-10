import React, { useRef } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

type EnergyButtonsProps = {
    selectedValue: number;
    onChange: (value: number) => void;
};

const EnergyButtons: React.FC<EnergyButtonsProps> = ({ selectedValue, onChange }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleEnergyChange = (value: number) => {
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

    const getEnergyColor = (energy: number): string => {
        if (energy <= 4) return adjustOpacity(themeColors.redOpacity, 0.5); 
        if (energy <= 7) return adjustOpacity(themeColors.yellowOpacity, 0.5); 
        return adjustOpacity(themeColors.greenOpacity, 0.3);
    };

    return (
        <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.energyButtonsContainer}
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            scrollEventThrottle={16}
            style={styles.scrollView}
        >
            {[...Array(11)].map((_, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.energyButton,
                        selectedValue === index && styles.selectedEnergyButton,
                        { backgroundColor: selectedValue === index ? getEnergyColor(index) : themeColors.backgroundSecondary }
                    ]}
                    onPress={() => handleEnergyChange(index)}
                >
                    <Text style={[
                        styles.energyButtonText,
                        selectedValue === index && styles.selectedEnergyButtonText
                    ]}>
                        {index}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    scrollView: {
        marginHorizontal: -16,  // Negative margin to allow padding
        paddingHorizontal: 16,  // Padding to show partial next button
    },
    energyButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
        paddingRight: 40,  // Add extra padding to show partial next button
    },
    energyButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    selectedEnergyButton: {
        borderColor: 'transparent',
    },
    energyButtonText: {
        color: themeColors.textColor,
        fontSize: 16,
        fontWeight: '500',
    },
    selectedEnergyButtonText: {
        color: themeColors.borderColor,
    },
});

export default EnergyButtons;