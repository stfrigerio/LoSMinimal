import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface DeleteButtonProps {
	onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	return (
		<Pressable onPress={onDelete} style={styles.deleteButton}>
			{({ pressed }) => (
				<FontAwesomeIcon icon={faTrash} color={pressed ? theme.colors.accentColor : theme.colors.gray} />
			)}
		</Pressable>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	deleteButton: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default DeleteButton;