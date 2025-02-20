import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface BannerProps {
    imageSource: any;
    height?: number;
}

const Banner: React.FC<BannerProps> = ({ imageSource, height = 180 }) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <View style={[styles.bannerContainer, { height }]}>
            <Image source={imageSource} style={styles.bannerImage} resizeMode="cover" />
            <LinearGradient
                colors={[`${themeColors.backgroundColor}`, 'transparent', `${themeColors.backgroundColor}`]}
                style={styles.gradient}
            />
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    bannerContainer: {
        width: Dimensions.get('window').width,
        marginHorizontal: -20,
        marginVertical: 10,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Banner;
