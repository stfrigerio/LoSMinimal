import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Theme, useThemeStyles } from './useThemeStyles';

interface GlitchTextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    glitch?: boolean;
}

export function GlitchText({ children, style, glitch = false }: GlitchTextProps) {
    const { theme } = useThemeStyles();

    const styles = getStyles(theme);

    // State controlling whether glitching is active.
    const [glitchActive, setGlitchActive] = useState(false);
    // Offsets for the two glitch layers.
    const [offsets, setOffsets] = useState({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
    });

    useEffect(() => {
        let glitchTimer: any, glitchStopTimer: any;
        function startGlitch() {
            setGlitchActive(true);
            const interval = setInterval(() => {
                setOffsets({
                    x1: Math.random() * 10 - 5,
                    y1: Math.random() * 10 - 5,
                    x2: Math.random() * 10 - 5,
                    y2: Math.random() * 10 - 5,
                    x3: Math.random() * 10 - 5,
                    y3: Math.random() * 10 - 5,
                });
            }, 50);

            glitchStopTimer = setTimeout(() => {
                setGlitchActive(false);
                clearInterval(interval);
                scheduleNextGlitch();
            }, 300);
        }

        function scheduleNextGlitch() {
            glitchTimer = setTimeout(() => {
                startGlitch();
            }, Math.random() * 3000 + 2000);
        }

        scheduleNextGlitch();

        return () => {
            clearTimeout(glitchTimer);
            clearTimeout(glitchStopTimer);
        };
    }, []);

    // If glitch effect is not enabled, simply render a plain Text.
    if (!glitch) {
        return <Text style={style}>{children}</Text>;
    }

    return (
        <View style={styles.wrapper}>
            <Text style={style}>{children}</Text>
            {glitchActive && (
                <>
                    <Text
                        style={[
                        style,
                        styles.glitchLayer,
                        {
                            color: 'red',
                            transform: [
                            { translateX: offsets.x1 },
                            { translateY: offsets.y1 },
                            ],
                        },
                        ]}
                    >
                        {children}
                    </Text>
                    <Text
                        style={[
                        style,
                        styles.glitchLayer,
                        {
                            color: 'black',
                            transform: [
                            { translateX: offsets.x2 },
                            { translateY: offsets.y2 },
                            ],
                        },
                        ]}
                    >
                        {children}
                    </Text>
                    <Text
                        style={[
                        style,
                        styles.glitchLayer,
                        {
                            color: 'rgba(255, 255, 255, 0.4)',
                            transform: [
                            { translateX: offsets.x3 },
                            { translateY: offsets.y3 },
                            ],
                        },
                        ]}
                    >
                        {children}
                    </Text>
                </>
            )}
        </View>
    );
}

const getStyles = (theme: Theme) => StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    glitchLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        // fontFamily: theme.typography.fontFamily.primary,
    },
});
