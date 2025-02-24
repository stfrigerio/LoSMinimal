// SearchComponent.tsx
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface SearchComponentProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ searchQuery, setSearchQuery}) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name"
            placeholderTextColor='gray'
        />
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    input: {
        height: 40,
        borderColor: theme.colors.borderColor,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        color: theme.colors.textColor
    },
});

export default SearchComponent;
