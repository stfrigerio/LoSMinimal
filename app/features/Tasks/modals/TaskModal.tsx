import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';

import { UniversalModal } from '@/app/components/UniversalModal';
import AlertModal from '@/app/components/AlertModal';
import createTimePicker from '@/app/components/DateTimePicker';

import { useTasksData } from '@/app/features/Tasks/hooks/useTasksData';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { TaskData } from '@/src/types/Task';
import { PillarData } from '@/src/types/Pillar';
import { ObjectiveData } from '@/src/types/Objective';

import { TaskBasicInfo } from './components/TaskBasicInfo';
import { TaskDateTime } from './components/TaskDateTime';
import { TaskNote } from './components/TaskNote';
import { TaskPriority } from './components/TaskPriority';
import { TaskRepeat } from './components/TaskRepeat';
import { TaskFrequency } from './components/TaskFrequency';
import { TaskPillar } from './components/TaskPillar';
import { TaskObjective } from './components/TaskObjective';
import { TaskEndDateTime } from './components/TaskEndDateTime';

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddItem: (item: TaskData) => void;
	onUpdateItem: (item: TaskData) => void;
	task?: TaskData;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onAddItem, onUpdateItem, task }) => {
	const [itemName, setItemName] = useState<string>(task?.text || '');
	const [dateInput, setDateInput] = useState<string>(task?.due || '');
	const [endDateInput, setEndDateInput] = useState<string>(task?.end || '');
	const [noteText, setNoteText] = useState<string>(task?.note || '');
	const [selectedPillarUuid, setSelectedPillarUuid] = useState<string | undefined>(task?.pillarUuid || undefined);
	const [objectiveUuid, setObjectiveUuid] = useState<string | undefined>(task?.objectiveUuid || undefined);
	const [priority, setPriority] = useState<number | undefined>(task?.priority || undefined);
	const [repeat, setRepeat] = useState<string | undefined>(task?.repeat || undefined);
	const [frequency, setFrequency] = useState<string | undefined>(task?.frequency || undefined);

	const [showNote, setShowNote] = useState<boolean>(!!task?.note);
	const [showPriority, setShowPriority] = useState<boolean>(!!task?.priority);
	const [showPillar, setShowPillar] = useState<boolean>(!!task?.pillarUuid);
	const [showFrequency, setShowFrequency] = useState<boolean>(!!task?.frequency);
	const [showObjective, setShowObjective] = useState<boolean>(!!task?.objectiveUuid);
	const [showEndDateTime, setShowEndDateTime] = useState<boolean>(false);
	const [showAlert, setShowAlert] = useState(false);

	const { pillars, uncompletedObjectives } = useTasksData();
	const { showPicker, picker } = createTimePicker();
	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);

	useEffect(() => {
		if (isOpen) {
			setItemName(task?.text || '');
			setDateInput(task?.due || '');
			setEndDateInput(task?.end || '');
		}
	}, [isOpen, task]);

	const showDateTimePicker = (isStart: boolean, isDate: boolean) => {
		const currentDate = isStart ? new Date(dateInput || Date.now()) : new Date(endDateInput || Date.now());
		
		showPicker({
			mode: isDate ? 'date' : 'time',
			value: currentDate,
			is24Hour: true,
		}, (selectedDate) => {
			if (selectedDate) {
				updateDateTime(selectedDate, isStart, isDate);
			}
		});
	};

	const updateDateTime = (date: Date, isStart: boolean, isDate: boolean) => {
		const updatedDate = isStart ? new Date(dateInput || Date.now()) : new Date(endDateInput || Date.now());
		
		if (isDate) {
			updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
		} else {
			updatedDate.setHours(date.getHours(), date.getMinutes());
		}
		
		const formattedDate = format(updatedDate, "yyyy-MM-dd'T'HH:mm:ss");
		
		if (isStart) {
			setDateInput(formattedDate);
		} else {
			setEndDateInput(formattedDate);
		}
	};

	const addNewItem = () => {
		if (itemName) {
			let newTask: TaskData;
			if (task?.uuid) {
				newTask = {
					id: task?.id,
					uuid: task?.uuid,
					text: itemName,
					due: dateInput,
					completed: task?.completed || false,
					repeat: repeat,
					frequency: frequency,
					end: endDateInput,
					note: noteText,
					pillarUuid: selectedPillarUuid,
					objectiveUuid: task?.objectiveUuid,
					priority: priority,
					createdAt: task?.createdAt,
					synced: task?.synced,
					type: task?.type,
				};
				onUpdateItem(newTask);
			} else {
				newTask = {
					text: itemName,
					due: dateInput,
					completed: false,
					end: endDateInput,
					repeat: repeat,
					frequency: frequency,
					note: noteText,
					pillarUuid: selectedPillarUuid,
					objectiveUuid: objectiveUuid,
					priority: priority,
				};
				onAddItem(newTask);
			}

			resetForm();
			onClose();
		} else {
			setShowAlert(true);
		}
	};

	const resetForm = () => {
		setItemName('');
		setDateInput('');
		setEndDateInput('');
		setSelectedPillarUuid(undefined);
		setObjectiveUuid(undefined);
		setPriority(undefined);
		setRepeat(undefined);
		setFrequency(undefined);
		setShowNote(false);
		setShowPriority(false);
		setShowPillar(false);
		setShowFrequency(false);
		setShowObjective(false);
	};

	const pillarItems = [
		{ label: 'None', value: '' },
		...pillars.map((pillar: PillarData) => ({
			label: `${pillar.emoji} ${pillar.name}`,
			value: pillar.uuid
		}))
	];

	const objectiveItems = [
		{ label: 'None', value: '' },
		...uncompletedObjectives.map((objective: ObjectiveData) => {
			const pillar = pillars.find((p: PillarData) => p.uuid === objective.pillarUuid);
			const emoji = pillar ? pillar.emoji : '';
			return {
				label: `${emoji} ${objective.objective}`,
				value: objective.uuid || '',
				pillarUuid: objective.pillarUuid
			};
		})
	];

	const priorityItems = [
		{ label: 'None', value: '' },
		{ label: '1', value: '1' },
		{ label: '2', value: '2' },
		{ label: '3', value: '3' },
	];

	const frequencyItems = [
		{ label: 'None', value: '' },
		{ label: 'Daily', value: 'daily' },
		{ label: 'Weekly', value: 'weekly' },
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Yearly', value: 'yearly' },
	];

	const modalContent = (
		<View>
			<Text style={[designs.modal.title]}>
				{task ? '✏️ Edit task' : '✅ Create a new task'}
			</Text>

			<TaskBasicInfo 
				itemName={itemName}
				setItemName={setItemName}
			/>
			<TaskDateTime 
				dateInput={dateInput}
				showDateTimePicker={showDateTimePicker}
				styles={styles}
			/>
			<TaskNote
				showNote={showNote}
				setShowNote={setShowNote}
				noteText={noteText}
				setNoteText={setNoteText}
				styles={styles}
			/>
			<TaskPriority
				showPriority={showPriority}
				setShowPriority={setShowPriority}
				priority={priority}
				setPriority={setPriority}
				priorityItems={priorityItems}
				styles={styles}
			/>
			<TaskRepeat
				repeat={repeat}
				setRepeat={setRepeat}
				setShowFrequency={setShowFrequency}
				styles={styles}
			/>
			{showFrequency && (
				<TaskFrequency
					frequency={frequency}
					setFrequency={setFrequency}
					frequencyItems={frequencyItems}
					styles={styles}
				/>
			)}
			<TaskPillar
				showPillar={showPillar}
				setShowPillar={setShowPillar}
				selectedPillarUuid={selectedPillarUuid}
				setSelectedPillarUuid={setSelectedPillarUuid}
				pillarItems={pillarItems}
				styles={styles}
			/>
			<TaskObjective
				showObjective={showObjective}
				setShowObjective={setShowObjective}
				objectiveUuid={objectiveUuid}
				setObjectiveUuid={setObjectiveUuid}
				setShowPillar={setShowPillar}
				setSelectedPillarUuid={setSelectedPillarUuid}
				objectiveItems={objectiveItems}
				styles={styles}
			/>
			<TaskEndDateTime
				showEndDateTime={showEndDateTime}
				setShowEndDateTime={setShowEndDateTime}
				endDateInput={endDateInput}
				showDateTimePicker={showDateTimePicker}
				styles={styles}
			/>

			<Pressable 
				style={[designs.button.marzoSecondary]} 
				onPress={addNewItem}
			>
				<Text style={designs.button.buttonText}>
					{task ? 'Update' : 'Add Task'}
				</Text>
			</Pressable>
		</View>
	);

	return (
		<>
			<UniversalModal isVisible={isOpen} onClose={onClose}>
				{modalContent}
				{picker}
			</UniversalModal>
			
			<AlertModal
				isVisible={showAlert}
				title="Error"
				message="Please enter an item name"
				onConfirm={() => setShowAlert(false)}
				onCancel={() => setShowAlert(false)}
			/>
		</>
	);
};

const getStyles = (theme: any) => StyleSheet.create({
	switchContainer: {
		width: '100%',
	},
	dateTimeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 20,
	},
	dateTimeButton: {
		flex: 1,
		padding: 10,
		borderColor: theme.borderColor,
		borderWidth: 1,
		borderRadius: 5,
		marginHorizontal: 5,
		alignItems: 'center',
	},
	dateTimeText: {
		color: theme.textColor,
	},
});

export default TaskModal;