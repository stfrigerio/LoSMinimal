import { LibraryData } from "@/src/types/Library";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable, Text, StyleSheet } from "react-native"
import { Theme, useThemeStyles } from "@/src/styles/useThemeStyles";

interface DeleteButtonProps {
    onDelete: (item: LibraryData) => void;
    onClose: () => void;
    item: LibraryData;
}

export const DeleteButton = ({ onDelete, onClose, item }: DeleteButtonProps) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const handleDelete = async () => {
        onDelete(item);
        onClose();
    };

    return (
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} size={20} color={theme.colors.redOpacity} />
            <Text style={styles.deleteButtonText}>{`Delete ${item.type}`}</Text>
        </Pressable>
    )
}

const getStyles = (theme: Theme) => StyleSheet.create({
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: theme.borderRadius.lg,
        marginTop: 30,
        borderWidth: 1,
        borderColor: theme.colors.redOpacity,
    },
    deleteButtonText: {
        color: theme.colors.redOpacity,
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
});