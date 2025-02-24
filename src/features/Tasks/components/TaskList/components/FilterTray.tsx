import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { faCheckCircle, faCircle, faList, faRepeat } from '@fortawesome/free-solid-svg-icons';

import { FilterIcon, FilterType } from './FilterIcon';
import { useThemeStyles, Theme } from "@/src/styles/useThemeStyles";

export const FilterTray = ({ setFilter, filter }: { setFilter: (filter: FilterType) => void, filter: FilterType }) => {
    const { theme } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme), [theme]);

    return (
        <View style={styles.filterContainer}>
            <FilterIcon
            type="all"
            icon={faList}
            setFilter={setFilter}
            filter={filter}
            />
            <FilterIcon
                type="active"
                icon={faCircle}
                setFilter={setFilter}
                filter={filter}
            />
            <FilterIcon
                type="completed"
                icon={faCheckCircle}
                setFilter={setFilter}
                filter={filter}
            />
            <FilterIcon
                type="repeat"
                icon={faRepeat}
                setFilter={setFilter}
                filter={filter}
            />
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});