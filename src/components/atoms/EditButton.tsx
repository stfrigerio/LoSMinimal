import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface EditButtonProps {
    onEdit: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onEdit }) => {
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	return (
        <Pressable onPress={onEdit} style={styles.editButton}>
            {({ pressed }) => (
                <FontAwesomeIcon icon={faPencilAlt} color={pressed ? themeColors.accentColor : themeColors.gray} />
            )}
        </Pressable>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    editButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditButton;