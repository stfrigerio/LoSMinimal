import React from 'react';
import { View, Dimensions } from 'react-native';
import { MoodNoteData } from '@/src/types/Mood';
import MoodChart from '@/src/components/charts/MoodChart';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface GraphViewProps {
    moodData: MoodNoteData[];
}

const GraphView: React.FC<GraphViewProps> = ({ moodData }) => {
    const { themeColors } = useThemeStyles();
    const { width } = Dimensions.get('window');
    const height = 300; // You can adjust this or make it dynamic

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.backgroundColor }}>
            <MoodChart
                moodData={moodData}
                width={width - 40} // Subtracting padding
                height={height}
            />
        </View>
    );
};

export default GraphView;