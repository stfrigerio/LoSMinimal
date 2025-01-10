import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

export const RenderRating = (rating: number, handleRatingChange: (star: number) => void) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

    return (
        <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
                key={star}
                onPress={() => handleRatingChange(star)}
                style={{ padding: 5 }}
            >
                <FontAwesomeIcon 
                    icon={faStar} 
                    size={20} 
                    color={star <= rating ? 'gold' : 'gray'} 
                />
            </Pressable>
        ))}
        </View>
    );
};

const getStyles = (theme: any, designs: any) => StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        justifyContent: 'center',
    },
});