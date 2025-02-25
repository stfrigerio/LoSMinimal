import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Text, Animated, Modal, SafeAreaView, StatusBar, Easing, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import TaskModal from '@/src/features/Tasks/modals/TaskModal';
import TransactionModal from '@/src/features/Money/modals/TransactionModal';
import MoodModal from '@/src/features/Mood/modals/MoodModal';
import CarLocationModal from '@/src/features/Home/modals/CarLocationModal';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface QuickButtonProps {  
	isExpanded: boolean;
	setIsExpanded: (isExpanded: boolean) => void;
}

import { useTasksData } from '@/src/features/Tasks/hooks/useTasksData';

const QuickButton: React.FC<QuickButtonProps> = ({ isExpanded, setIsExpanded }) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);
	const [buttonsVisible, setButtonsVisible] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
	const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
	const [isCarLocationModalOpen, setIsCarLocationModalOpen] = useState(false);

	const scaleAnim = useRef(new Animated.Value(1)).current;

	const { addTask, updateTask } = useTasksData();

	const buttonConfig = [
		{ key: 'mood', settingKey: 'HideMoods' },
		{ key: 'task', settingKey: 'HideTasks' },
		{ key: 'transaction', settingKey: 'HideMoney' },
		{ key: 'carLocation', settingKey: 'HideCarLocation' },
	];

	const fadeAnims = useRef({
		transaction: new Animated.Value(0),
		mood: new Animated.Value(0),
		task: new Animated.Value(0),
		people: new Animated.Value(0),
		contact: new Animated.Value(0),
		carLocation: new Animated.Value(0),
	}).current;

	const elevationAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animations = buttonConfig.map((button, index) => {
			const reverseIndex = buttonConfig.length - 1 - index;
			return Animated.timing(fadeAnims[button.key as keyof typeof fadeAnims], {
				toValue: isExpanded ? 1 : 0,
				duration: 200,
				useNativeDriver: true,
				delay: isExpanded ? reverseIndex * 80 : index * 80,
			});
		});

		const elevationAnimation = Animated.timing(elevationAnim, {
			toValue: isExpanded ? 1 : 0,
			duration: 100,
			useNativeDriver: false,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing for smoother transition
		});

		if (isExpanded) {
			setButtonsVisible(true);
			Animated.parallel([...animations, elevationAnimation]).start();
		} else {
			Animated.parallel([...animations, elevationAnimation]).start(({ finished }) => {
				if (finished) {
					setButtonsVisible(false);
				}
			});
		}
	}, [isExpanded]);

	const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            speed: 100,
            bounciness: 30
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 100,
            bounciness: 30
        }).start();
    };

	const animatedElevation = elevationAnim.interpolate({
		inputRange: [0, 0.8, 0.9, 1],
		outputRange: [0, 0, 10, 10],
		extrapolate: 'clamp'
	});

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

	const getButtonText = (key: string) => {
		switch (key) {
			case 'task': return '✅ Task';
			case 'mood': return '💭 Mood';
			case 'transaction': return '💸 Transaction';
			case 'carLocation': return '🚗 Car Location';
			default: return '';
		}
	};
	
	const handleButtonPress = (key: string) => {
		switch (key) {
			case 'task': setIsAddModalOpen(true); break;
			case 'mood': setIsMoodModalOpen(true); break;
			case 'transaction': setIsTransactionModalOpen(true); break;
			case 'carLocation': setIsCarLocationModalOpen(true); break;
		}
	};

	return (
		<View style={styles.container}>
			{buttonsVisible && (
				<View style={[styles.buttonContainer]}>
					{buttonConfig.map(({ key }) => (
						<Animated.View 
							key={key}
							style={{ 
								opacity: fadeAnims[key as keyof typeof fadeAnims],
							}}
						>
							<AnimatedPressable 
								style={[
									styles.secondaryButton,
									{ elevation: animatedElevation as any } // Type assertion to avoid TS error
								]}
								onPress={() => handleButtonPress(key)}
							>
								{({ pressed }) => (
									<Text style={[styles.buttonText, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}>
										{getButtonText(key)}
									</Text>
								)}
							</AnimatedPressable>
						</Animated.View>
					))}
				</View>
			)}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    style={[styles.floatingButton, { width: 56 }]}
                    onPress={() => setIsExpanded(!isExpanded)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <FontAwesomeIcon 
                        icon={isExpanded ? faMinus : faPlus} 
                        size={24} 
                        color={theme.name === 'light' ? '#333333' : theme.colors.backgroundColor} 
                    />
                </Pressable>
            </Animated.View>

			{isAddModalOpen &&
				<TaskModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					onAddItem={addTask}
					onUpdateItem={updateTask}
				/>
			}
			{isMoodModalOpen &&
				<MoodModal
					isOpen={isMoodModalOpen}
					closeMoodModal={() => setIsMoodModalOpen(false)}
				/>
			}
			{isTransactionModalOpen &&
				<TransactionModal
					isOpen={isTransactionModalOpen}
					closeTransactionModal={() => setIsTransactionModalOpen(false)}
				/>
			}
			{isCarLocationModalOpen &&
				<CarLocationModal
					isOpen={isCarLocationModalOpen}
					onClose={() => setIsCarLocationModalOpen(false)}
				/>
			}
		</View>
	);
};

const getFloatingButtonColor = (theme: Theme) => {
	if (theme.name === 'light') {
		return '#CC5359';
	} else if (theme.name === 'signalis') {
		return `${theme.colors.accentColor}80`;
	} else {
		return `${theme.colors.accentColor}`;
	}
};

const getSecondaryButtonColor = (theme: Theme) => {
	if (theme.name === 'light') {
		return `#f0868b99`;
	} else {
		return `${theme.colors.accentColorShade}`;
	}
};

const getStyles = (theme: Theme) => StyleSheet.create({
	container: {
		alignItems: 'flex-end',
		zIndex: 2
	},
	centerContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	floatingButton: {
		backgroundColor: getFloatingButtonColor(theme),
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
	},
	secondaryButton: {
		backgroundColor: getSecondaryButtonColor(theme),
		marginBottom: 16,
		width: 150,
		height: 40,
		borderRadius: theme.borderRadius.pill,
		justifyContent: 'center',
		alignItems: 'center',  
		borderWidth: theme.name == 'signalis' ? 1 : 0,
		borderColor: theme.colors.borderColor,
	},
	buttonText: {
		color: theme.name === 'light' ? '#333333' : theme.colors.backgroundColor,
		fontSize: theme.name === 'signalis' ? 14 : 16,
		fontFamily: theme.typography.fontFamily.primary,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 70,
		right: 0,
		alignItems: 'flex-end',
	},
	mainButtonText: {
		color: theme.colors.borderColor,
		fontSize: 16,
		marginBottom: 3
	},
	modalContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundColor,
		marginTop: -40,
	},
});

export default QuickButton;
