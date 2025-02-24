import { useMemo } from 'react';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { useColors } from '@/src/utils/useColors';
import { MoneyData } from '@/src/types/Money';

export const useMoneyColors = (validTransactions: MoneyData[]) => {
    const { theme } = useThemeStyles();

    const { colors: tagColors, loading: colorsLoading, error: colorsError } = useColors();

    // Memoize the color mapping for all entries
    const entryColors = useMemo(() => {
        if (colorsLoading || !tagColors) {
            return {};
        }
        return validTransactions.reduce((acc, entry) => {
            acc[entry.id!] = tagColors[entry.tag!] || theme.colors.textColor;
            return acc;
        }, {} as Record<number, string>);
    }, [validTransactions, tagColors, colorsLoading, theme.colors.textColor]);

    return { entryColors, colorsLoading, colorsError };
};