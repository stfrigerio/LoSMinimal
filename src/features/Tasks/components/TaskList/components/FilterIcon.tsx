import { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { useThemeStyles } from "@/src/styles/useThemeStyles";

interface FilterIconProps { 
    type: string;
    icon: any;
    setFilter: (type: FilterType) => void;
    filter: FilterType;
}

export type FilterType = 'all' | 'completed' | 'active' | 'repeat';

export const FilterIcon: React.FC<FilterIconProps> = ({ type, icon, setFilter, filter }) => {
    const { themeColors } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);

    return (
        <Pressable onPress={() => setFilter(type as FilterType)} style={styles.filterIcon}>
            <FontAwesomeIcon 
                icon={icon} 
                color={filter === type ? themeColors.accentColor : themeColors.gray} 
                size={24} 
            />
        </Pressable>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    filterIcon: {
        marginHorizontal: 15,
        padding: 5,
    },
});