import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBill, faClock, faSmile } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface SectionSelectorProps {
	selectedSection: string;
	onSectionChange: (section: string, isTagSelected: boolean) => void;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
	selectedSection,
	onSectionChange,
}) => {
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	const sections = [
		{ key: 'money', icon: faMoneyBill },
		{ key: 'time', icon: faClock },
		{ key: 'mood', icon: faSmile }
	];

  return (
		<View style={styles.sectionSelectorContainer}>
			{sections.map((section) => (
				<Pressable
					key={section.key}
					style={[styles.sectionButton, selectedSection === section.key && styles.activeSectionButton]}
					onPress={() => onSectionChange(section.key, true)}
				>
					<FontAwesomeIcon 
						icon={section.icon} 
						color={selectedSection === section.key ? themeColors.backgroundColor : themeColors.textColor} 
						size={24} 
					/>
				</Pressable>
			))}
		</View>
	);
};

const getStyles = (theme: any) => StyleSheet.create({
	sectionSelectorContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		gap: 20,
		marginBottom: 20,
	},
	sectionButton: {
		padding: 10,
		borderRadius: 5,
	},
	activeSectionButton: {
		backgroundColor: theme.accentColor,
	},
}); 