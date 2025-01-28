import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

export interface MenuItem {
    label: string;
    onPress: () => void;
}

interface PopupMenuProps {
    isVisible: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isVisible, onClose, menuItems }) => {
    const { themeColors } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

    return (
        <Modal
            transparent
            visible={isVisible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <Pressable 
                style={styles.modalOverlay}
                onPress={onClose}
            >
                <View style={styles.popupMenu}>
                    {menuItems.map((item, index) => (
                        <Pressable 
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                onClose();
                                console.log('item.onPress', item);
                                item.onPress();
                            }}
                        >
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupMenu: {
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 10,
        padding: 10,
        minWidth: 150,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    menuItem: {
        padding: 12,
        borderRadius: 6,
    },
    menuItemText: {
        color: themeColors.textColor,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default PopupMenu;