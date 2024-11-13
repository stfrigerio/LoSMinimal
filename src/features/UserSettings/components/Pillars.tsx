import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import DeleteButton from '@/src/components/atoms/DeleteButton';
import EditButton from '@/src/components/atoms/EditButton';
import AlertModal from '@/src/components/modals/AlertModal';

import AddPillarModal from './modals/AddPillarModal';
import { PillarData } from '@/src/types/Pillar';
import GluedQuickbutton from '@/src/components/NavBar/GluedQuickbutton';

import { usePillars } from '../hooks/usePillars';

const PillarManager = () => {
	const [pillars, setPillars] = useState<PillarData[]>([]);
	const [editingPillar, setEditingPillar] = useState<PillarData | null>(null);
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [alertModalVisible, setAlertModalVisible] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertAction, setAlertAction] = useState<() => void>(() => {});

	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);
	const { fetchPillars, handleDeletePillar, handleAddOrUpdatePillar } = usePillars();

	useEffect(() => {
		loadPillars();
	}, []);

	const loadPillars = async () => {
		const fetchedPillars = await fetchPillars();
		setPillars(fetchedPillars);
	};

	const openAddModal = () => {
		setEditingPillar(null);
		setIsAddModalVisible(true);
	};

	const openEditModal = (pillar: PillarData) => {
		setEditingPillar(pillar);
		setIsAddModalVisible(true);
	};

	const handleAddOrEditPillar = async (pillarData: PillarData) => {
		await handleAddOrUpdatePillar(pillarData);
		loadPillars();
		setIsAddModalVisible(false);
		setEditingPillar(null);
	};

	const handlePillarDelete = (id: number) => {
		setAlertTitle("Delete Pillar");
		setAlertMessage("Are you sure you want to delete this pillar? This action cannot be undone.");
		setAlertAction(() => async () => {
		await handleDeletePillar(id);
		loadPillars();
		});
		setAlertModalVisible(true);
	};

	const renderPillars = () => {
		return pillars.map((pillar) => (
			<View key={pillar.id} style={styles.pillarWrapper}>
				<View style={styles.pillarContainer}>
					<Text style={[designs.text.text, styles.pillarText]}>
						{pillar.emoji} {pillar.name}
					</Text>
					<EditButton onEdit={() => openEditModal(pillar)} />
					<DeleteButton onDelete={() => handlePillarDelete(pillar.id!)} />
				</View>
				<Text style={[designs.text.text, styles.pillarDescription]}>{pillar.description ? pillar.description : 'No description'}</Text>
			</View>
		));
	};

	return (
		<View style={styles.container}>
			<ScrollView 
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
			>
				<Text style={[designs.text.title, styles.title]}>Pillars</Text>
				<Text style={styles.description}>
					Pillars represent your core values or fundamental areas of focus in life. 
					They serve as a foundation for your goals and daily activities, helping you 
					align your actions with what's most important to you. Use pillars to:
				</Text>
				<Text style={styles.bulletPoint}>
				• Link objectives to your core values
				</Text>
				<Text style={styles.bulletPoint}>
				• Connect tasks to broader life areas
				</Text>
				<Text style={styles.bulletPoint}>
				• Ensure your daily activities support your long-term vision
				</Text>
				{renderPillars()}
				<View style={styles.bottomPadding} />
			</ScrollView>
			
			{alertModalVisible && (
				<AlertModal
					isVisible={alertModalVisible}
					title={alertTitle}
					message={alertMessage}
					onConfirm={() => {
						alertAction();
						setAlertModalVisible(false);
					}}
					onCancel={() => setAlertModalVisible(false)}
				/>
			)}
			{isAddModalVisible && (
				<AddPillarModal
					isVisible={isAddModalVisible}
					onClose={() => {
						setIsAddModalVisible(false);
						setEditingPillar(null);
					}}
					onAdd={handleAddOrEditPillar}
					initialData={editingPillar || undefined}
				/>
			)}
			<View style={styles.quickButtonContainer}>
				<GluedQuickbutton screen="pillars" onPress={openAddModal} />
			</View>
		</View>
	);
};

const getStyles = (themeColors: any) => StyleSheet.create({
	container: { 
		flex: 1,
		paddingTop: 0,
		padding: 20,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		padding: 20,
		paddingBottom: 100, // Extra padding at the bottom
	},
	title: {
		marginBottom: 20,
	},
	pillarWrapper: {
		marginTop: 20,
		backgroundColor: themeColors.backgroundSecondary,
		borderRadius: 10,
	},
	pillarContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		backgroundColor: themeColors.cardColor,
		borderRadius: 5,
	},
	pillarText: {
		flex: 1,
		fontWeight: 'bold',
	},
	pillarDescription: {
		// marginTop: 5,
		marginLeft: 10,
		marginBottom: 10,
		color: themeColors.textColorItalic,
	},   
	bottomPadding: {
		height: 60, // Adjust this value based on your GluedQuickbutton height
	},
	quickButtonContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	description: {
		color: themeColors.gray,
		marginBottom: 10,
	},
	bulletPoint: {
		color: themeColors.gray,
		marginBottom: 5,
		marginLeft: 10,
	},
});

export default PillarManager;