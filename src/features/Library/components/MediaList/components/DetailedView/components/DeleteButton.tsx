import { LibraryData } from "@/src/types/Library";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable, Text, StyleSheet } from "react-native"
import { useThemeStyles } from "@/src/styles/useThemeStyles";

interface DeleteButtonProps {
    onDelete: (item: LibraryData) => void;
    onClose: () => void;
    item: LibraryData;
}

export const DeleteButton = ({ onDelete, onClose, item }: DeleteButtonProps) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    const handleDelete = async () => {
        onDelete(item);
        onClose();
    };

    return (
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} size={20} color={themeColors.redOpacity} />
            <Text style={styles.deleteButtonText}>{`Delete ${item.type}`}</Text>
        </Pressable>
    )
}

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 30,
        borderWidth: 1,
        borderColor: themeColors.redOpacity,
    },
    deleteButtonText: {
        color: themeColors.redOpacity,
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
});