import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable, View } from 'react-native';
import { Svg, Path } from 'react-native-svg';

import quotes from '@/assets/quotes.json';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

type QuoteType = {
    content: string;
    author: string;
};

interface QuoteProps {
    isCollapse: boolean;
    isFixed: boolean;
}

const FlourishBorder = ({ style, color }: { style?: any, color: string }) => (
    <Svg 
        height="50" 
        width="300" 
        viewBox="-6.6 -15 40 20" 
        style={[{ alignSelf: 'center', }, style]}
    >
        <Path
            d="M0-1C1-1 1.3333-2.3333 2-3 1-2 0-2 0-1 1-2 0-2 0-4 0-2-1-2 0-1 0-2-1-2-2-3-1-2-1-1 0-1 0-2 0-2 0-1M13-1C13-2 15.343-1.645 14 0 11 4 4-3 1 0M-13-1C-13-2-15.153-1.545-14 0-11 4-4-3-1 0M9-1C8 1 6-1 7-2 9-4 11-2 10 0 8 4 2-3-1 1M-8.611-1.494C-8.577 1.181-5.794-.864-6.986-2.005-9-4-11-2-10 0-8 4-2-3 1 1"
            stroke={color}
            strokeWidth={0.2}
            fill="none"
            transform="scale(2.5, 2)"  // Scale 3x horizontally, 1x vertically
        />
    </Svg>
);

const Quote: React.FC<QuoteProps> = ({ isCollapse, isFixed }) => {
    const [quote, setQuote] = useState<QuoteType>({ content: '', author: '' });
    const [expanded, setExpanded] = useState(!isCollapse);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Using useRef to persist the animated value across renders

    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    const getDailyQuote = () => {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return quotes[dayOfYear % quotes.length];
    };

    useEffect(() => {
        const fetchQuote = () => {
            const newQuote = isFixed ? getDailyQuote() : getRandomQuote();
            setQuote(newQuote);
        };

        fetchQuote();
        // If it's not random, set up a daily refresh
        if (isFixed) {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeUntilMidnight = tomorrow.getTime() - now.getTime();

            const refreshTimer = setTimeout(() => {
                fetchQuote();
            }, timeUntilMidnight);

            return () => clearTimeout(refreshTimer);
        }
    }, [isFixed]);

    // Start the animation every time the quote changes
    useEffect(() => {
        fadeAnim.setValue(0); // Reset the opacity to 0
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, [quote, fadeAnim]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <Pressable onPress={toggleExpanded}>
            <Animated.View style={[styles.quoteContainer, { opacity: fadeAnim }]}>
                <FlourishBorder 
                    color={themeColors.borderColor} 
                    style={{ marginLeft: 1}}
                />
                <View style={[styles.horizontalSeparator, { marginBottom: 10}]} />
                {expanded ? (
                    <>
                        <Text style={styles.quoteContent}>{quote.content}</Text>
                        <Text style={styles.quoteAuthor}>- {quote.author}</Text>
                    </>
                ) : (
                    <Text style={styles.quoteAuthor}>- {quote.author}</Text>
                )}
                <View style={[styles.horizontalSeparator, { marginTop: 10}]} />
                <FlourishBorder 
                    color={themeColors.borderColor} 
                    style={{ transform: [{ rotate: '180deg' }] }}
                />
            </Animated.View>
        </Pressable>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    quoteContainer: {
        padding: 20,
        margin: 10,
        maxWidth: 600,
        alignSelf: 'center',
        backgroundColor: theme.backgroundColor,
    },
    quoteContent: {
        lineHeight: 28,
        textAlign: 'center',
        fontStyle: 'italic',
        color: theme.textColor,
        marginBottom: 20,
        fontSize: 14,
        letterSpacing: 0.5,
        fontFamily: 'serif',
    },
    quoteAuthor: {
        textAlign: 'right',
        fontFamily: 'serif',
        fontSize: 12,
        marginTop: 5,
        color: theme.gray,
        fontWeight: '600',
        letterSpacing: 1,
    },
    horizontalSeparator: {
        marginHorizontal: 50,
        borderTopWidth: 2,
        borderColor: theme.borderColor,
    },
});

export default Quote;