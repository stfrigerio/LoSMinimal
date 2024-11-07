import { StyleSheet, View, Text, ImageBackground, Pressable, Dimensions, Alert } from 'react-native';
import CustomCalendar from './components/Calendar/Calendar';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { databaseManager } from '@/database/databaseManager';
import Toast from 'react-native-toast-message';

const Homepage = () => {
    const { designs } = useThemeStyles();

    const handleResetDatabase = async () => {
        Alert.alert(
            "Reset Database",
            "Are you sure you want to reset the database? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await databaseManager.hardResetDatabase();
                            Alert.alert("Success", "Database has been reset successfully");
                        } catch (error) {
                            console.error('Error resetting database:', error);
                            Alert.alert("Error", "Failed to reset database. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('@/assets/images/evening.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <CustomCalendar />
                        <Pressable 
                            style={[styles.resetButton, designs.button.homepage]}
                            onPress={handleResetDatabase}
                        >
                            <Text style={[styles.resetButtonText, designs.button.buttonText]}>
                                Reset Database
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    resetButton: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Homepage;