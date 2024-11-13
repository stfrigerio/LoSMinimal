import { useState, useEffect, useCallback } from 'react';
import { TagData } from '@/src/types/TagsAndDescriptions';
import Toast from 'react-native-toast-message';

interface UseTagDescriptionFormProps {
	initialData?: TagData;
	currentSection: string;
	getLinkedDescriptions: (tag: string) => TagData[];
	onAdd: (itemData: TagData) => void;
	onClose: () => void;
}

export const useTagDescriptionForm = ({
	initialData,
	currentSection,
	getLinkedDescriptions,
	onAdd,
	onClose,
}: UseTagDescriptionFormProps) => {
	const [itemData, setItemData] = useState<TagData>({
		text: '',
		type: `${currentSection}Tag`,
		emoji: '',
		linkedTag: '',
		color: '#FFFFFF'
	});
	
	const [selectedSection, setSelectedSection] = useState(currentSection);
	const [isTagSelected, setIsTagSelected] = useState(true);
	const [selectedColor, setSelectedColor] = useState('#FFFFFF');
	const [tempColor, setTempColor] = useState('#FFFFFF');
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [alertModalVisible, setAlertModalVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [showWarning, setShowWarning] = useState(false);
	const [linkedDescriptions, setLinkedDescriptions] = useState<TagData[]>([]);
	const [isTagSelectionModalVisible, setIsTagSelectionModalVisible] = useState(false);

	useEffect(() => {
		if (initialData) {
			setItemData(initialData);
			setIsTagSelected(initialData.type.includes('Tag'));
			setSelectedSection(initialData.type.includes('money') ? 'money' : 
												initialData.type.includes('time') ? 'time' : 'mood');
			setSelectedColor(initialData.color || '#FFFFFF');
		} else {
			resetForm();
		}
	}, [initialData, currentSection]);

	const resetForm = () => {
		setItemData({
			text: '',
			type: `${currentSection}Tag`,
			emoji: '',
			linkedTag: '',
			color: '#FFFFFF'
		});
		setSelectedSection(currentSection);
		setIsTagSelected(true);
		setSelectedColor('#FFFFFF');
	};

	const handleSectionChange = (section: string) => {
		setSelectedSection(section);
		updateItemData('type', `${section}${isTagSelected ? 'Tag' : 'Description'}`);
	};

	const handleTypeChange = (isTag: boolean) => {
		setIsTagSelected(isTag);
		updateItemData('type', `${selectedSection}${isTag ? 'Tag' : 'Description'}`);
		if (isTag) {
			updateItemData('linkedTag', '');
		}
		setShowWarning(false);
	};

	const handleAdd = () => {
		if (!itemData.text) {
			setAlertMessage('Please enter a tag or description');
			setAlertModalVisible(true);
			return;
		}
		if ((itemData.type === 'moneyDescription' || itemData.type === 'timeDescription') && !itemData.linkedTag) {
			setAlertMessage('Linked tag should be set for descriptions');
			setAlertModalVisible(true);
			return;
		}

		const updatedItemData = {
			...itemData,
			type: `${selectedSection}${isTagSelected ? 'Tag' : 'Description'}`,
			color: isTagSelected ? selectedColor : undefined
		};

		onAdd(updatedItemData);
		Toast.show({
			text1: 'Item added successfully',
			text2: `Added ${itemData.type.includes('Tag') ? 'tag' : 'description'} ${itemData.emoji} ${itemData.text}`,
			type: 'success',
		});
		onClose();
		resetForm();
	};

	const updateItemData = (key: keyof TagData, value: string) => {
		setItemData(prev => ({ ...prev, [key]: value }));
	};

	const handleColorSelect = (color: string) => {
		setTempColor(color);
	};

	const confirmColor = () => {
		setSelectedColor(tempColor);
		updateItemData('color', tempColor);
		setShowColorPicker(false);
	};

	const openTagSelectionModal = useCallback(() => {
		setIsTagSelectionModalVisible(true);
	}, []);

	return {
		itemData,
		selectedSection,
		isTagSelected,
		selectedColor,
		showColorPicker,
		tempColor,
		alertModalVisible,
		alertMessage,
		showWarning,
		linkedDescriptions,
		isTagSelectionModalVisible,
		handleSectionChange,
		handleTypeChange,
		handleAdd,
		updateItemData,
		setAlertModalVisible,
		setShowWarning,
		handleColorSelect,
		confirmColor,
		setShowColorPicker,
		openTagSelectionModal,
		setIsTagSelectionModalVisible,
		resetForm
	};
}; 