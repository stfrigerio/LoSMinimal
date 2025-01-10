import { databaseManagers } from "@/database/tables";
import { useThemeStyles } from "@/src/styles/useThemeStyles";
import { LibraryData } from "@/src/types/Library";
import { Pressable, TextInput, Text, StyleSheet } from "react-native"

interface EditableTitleProps {
    isEditingTitle: boolean;
    item: LibraryData;
    editedTitle: string;
    setEditedTitle: (editedTitle: string) => void;
    updateItem: (item: LibraryData) => Promise<void>;
    setIsEditingTitle: (isEditingTitle: boolean) => void;
}

const EditableTitle: React.FC<EditableTitleProps> = ({ 
    isEditingTitle, 
    setIsEditingTitle, 
    item, 
    editedTitle, 
    setEditedTitle,
    updateItem, 
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    const handleTitleEdit = async () => {
        if (isEditingTitle) {
            const updatedItem = { ...item, title: editedTitle };
            await databaseManagers.library.upsert(updatedItem);
            updateItem(updatedItem);
        }
        setIsEditingTitle(!isEditingTitle);
    };

    return (
        <Pressable onPress={handleTitleEdit}>
            {isEditingTitle ? (
                <TextInput
                    style={[styles.title, styles.titleInput]}
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    onBlur={handleTitleEdit}
                    autoFocus
                />
            ) : (
                <Text style={styles.title}>{item.title}</Text>
            )}
        </Pressable>
    )
}

export default EditableTitle;

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    title: {
        ...designs.text.title,
        fontSize: 28,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    titleInput: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borderColor,
        paddingBottom: 5,
    },
});