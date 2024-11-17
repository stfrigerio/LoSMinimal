import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import TimerDisplay from './TimerDisplay';
import TagModal from '@/src/components/modals/TagModal';
import DescriptionModal from '@/src/components/modals/DescriptionModal';

import { useTimer } from '@/src/features/Home/hooks/useTimer';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { TagData } from '@/src/types/TagsAndDescriptions';

export interface SelectionData {
	isTagModalOpen: boolean;
	isDescriptionModalOpen: boolean;
	selectedTag?: TagData;
	selectedDescription?: TagData;
	newTagName?: string;
	newDescriptionName?: string;
}

const TimerComponent: React.FC = () => {
	const [selectionData, setSelectionData] = useState<SelectionData>({
		isTagModalOpen: false,
		isDescriptionModalOpen: false,
	});

	const { timerRunning, initialSeconds, startTimer, stopTimer, getCurrentTimerSecondsRef, tag, description, fetchActiveTimer, checkAndClearStuckNotification } = useTimer();
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	const handleTagDescriptionSelection = () => {
		if (selectionData.selectedTag && selectionData.selectedDescription) {
			startTimer(selectionData.selectedTag.text, selectionData.selectedDescription.text);
			setSelectionData(prev => ({
				...prev,
				isTagModalOpen: false,
				isDescriptionModalOpen: false,
			}));
		}
	};

	useEffect(() => {
		handleTagDescriptionSelection();
	}, [selectionData.selectedTag, selectionData.selectedDescription]);

	const handleStopTimer = async () => {
		await stopTimer();
		setSelectionData(prevData => ({
			...prevData,
			selectedTag: undefined,
			selectedDescription: undefined,
		}));
		checkAndClearStuckNotification()
	};

    const handlePressIn = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.8,
                useNativeDriver: true,
                speed: 50,
                bounciness: 12,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 50,
                bounciness: 32,
            })
        ]).start();

        // Open modal after a short delay (adjust the 150ms to your preference)
        setTimeout(() => {
            setSelectionData(prev => ({ ...prev, isTagModalOpen: true }));
        }, 200);
    };

	return (
		<View style={styles.container}>
            {!timerRunning && (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Pressable 
                        style={styles.floatingButton} 
                        onPress={handlePressIn}
                    >
                        <FontAwesomeIcon 
                            icon={faPlay} 
                            size={16} 
                            color={themeColors.backgroundColor} 
                            style={{ marginLeft: 3}}
                        />
                    </Pressable>
                </Animated.View>
            )}
			{timerRunning && (
				<View style={styles.timerContent}>
					<Pressable style={styles.stopButton} onPress={handleStopTimer}>
						<FontAwesomeIcon icon={faPause} size={24} color={themeColors.textColor} />
					</Pressable>
				</View>
			)}
			{timerRunning && (
				<Pressable onPress={fetchActiveTimer} style={
					[
						styles.timerDisplayWrapper,
						{
							height: 80,
						}
					]
				}>
					<TimerDisplay
						initialSeconds={initialSeconds}
						tagName={selectionData.selectedTag?.text || tag || ''}
						description={selectionData.selectedDescription?.text || description || ''}
						registerTimer={(timerFunction) => getCurrentTimerSecondsRef.current = timerFunction}
					/>
				</Pressable>
			)}
			{selectionData.isTagModalOpen && (
				<TagModal
					isOpen={selectionData.isTagModalOpen}
					setSelectionData={setSelectionData}
					sourceTable='TimeTable'
				/>
			)}
			{selectionData.isDescriptionModalOpen && (
				<DescriptionModal
					isOpen={selectionData.isDescriptionModalOpen}
					selectedTag={selectionData.selectedTag!}
					setSelectionData={setSelectionData}
					sourceTable='TimeTable'
				/>
			)}
		</View>
	);
};

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		alignItems: 'flex-start',
	},
	floatingButton: {
		backgroundColor: theme.accentColor,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
	},
	timerContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	stopButton: {
		padding: 15,
		borderRadius: 5,
	},
	timerDisplayWrapper: {
		position: 'absolute',
		bottom: -10,
		width: 200,
		left: 55,
	}
});

export default TimerComponent;
