import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface DeleteButtonProps {
	onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	return (
		<Pressable onPress={onDelete} style={styles.deleteButton}>
      		{({ pressed }) => (
				<FontAwesomeIcon icon={faTrash} color={pressed ? themeColors.accentColor : themeColors.gray} />
			)}
		</Pressable>
	);
};

const getStyles = (themeColors: any) => StyleSheet.create({
	deleteButton: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default DeleteButton;