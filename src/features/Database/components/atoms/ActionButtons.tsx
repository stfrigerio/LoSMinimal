import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface ActionButtonsProps {
	isConfirming: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isConfirming, onConfirm, onCancel }) => {
	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme);

	return (
		<View style={styles.actionButtons}>
			<PrimaryButton
				text="Confirm Sync"
				onPress={onConfirm}
			/>
			<PrimaryButton text="Cancel" onPress={onCancel} />
		</View>
	);
};

export default ActionButtons;

const getStyles = (theme: Theme) => StyleSheet.create({
		disabledButton: {
				opacity: 0.5,
		},
		actionButtons: {
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: '100%',
		},
});