import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface EditButtonProps {
    onEdit: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onEdit }) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	return (
        <Pressable onPress={onEdit} style={styles.editButton}>
            {({ pressed }) => (
                <FontAwesomeIcon icon={faPencilAlt} color={pressed ? theme.colors.accentColor : theme.colors.gray} />
            )}
        </Pressable>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    editButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditButton;