import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';

export function Scanlines({ visible = true }) {
    // Single animated value for continuous vertical movement
    const screenHeight = Dimensions.get('window').height;
    const scanlinesHeight = screenHeight + 40; // Extra height for overlap
    const translateY = useRef(new Animated.Value(-scanlinesHeight)).current;

    useEffect(() => {
        if (visible) {
            // Using the same speed as your original animation: 40px per 1500ms
            const speed = 40 / 1500; // pixels per ms
            const fullDuration = scanlinesHeight / speed;
            
            // Animate from 0 to -scanlinesHeight, then loop seamlessly
            const animation = Animated.loop(
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: fullDuration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            animation.start();
            return () => animation.stop();
        }
    }, [visible, scanlinesHeight, translateY]);

    if (!visible) return null;

    // Render a full set of scanlines for a given block height
    const renderScanlines = (keyPrefix: string) => {
        const lines = [];
        for (let i = 0; i < scanlinesHeight; i += 2) {
            const color =
                i % 6 === 0 ? 'rgba(255, 0, 0, 0.05)' : // Red
                i % 6 === 2 ? 'rgba(0, 255, 0, 0.04)' : // Green
                i % 6 === 4 ? 'rgba(0, 0, 255, 0.05)' : // Blue
                'rgba(255, 255, 255, 0.09)';            // White
                lines.push(
                    <View
                        key={`${keyPrefix}-${i}`}
                        style={[styles.scanline, { top: i, backgroundColor: color }]}
                    />
                );
        }
        return lines;
    };

    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View
                style={[
                    styles.animatedContainer,
                    { transform: [{ translateY }] }
                ]}
            >
                {/* Two copies of the scanlines for seamless looping */}
                <View style={{ height: scanlinesHeight }}>
                    {renderScanlines('first')}
                </View>
                <View style={{ height: scanlinesHeight }}>
                    {renderScanlines('second')}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 9999,
    },
    animatedContainer: {
        // Height is twice the scanlines block height to stack two copies
        height: '200%',
        width: '100%',
    },
    scanline: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
    },
});
