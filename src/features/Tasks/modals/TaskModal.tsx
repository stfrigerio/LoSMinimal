import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';
import createTimePicker from '@/src/components/DateTimePicker';
import { GlitchText } from '@/src/styles/GlitchText';

import { useTasksData } from '@/src/features/Tasks/hooks/useTasksData';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { useChecklist } from '@/src/contexts/checklistContext';

import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { TaskBasicInfo } from './components/TaskModal/TaskBasicInfo';
import { TaskDateTime } from './components/TaskModal/TaskDateTime';
import { TaskNote } from './components/TaskModal/TaskNote';
import { TaskPriority } from './components/TaskModal/TaskPriority';
import { TaskPillar } from './components/TaskModal/TaskPillar';
import { TaskObjective } from './components/TaskModal/TaskObjective';
import { TaskEndDateTime } from './components/TaskModal/TaskEndDateTime';
import { RepeatFrequencySelector } from '@/src/components/FormComponents';

import { TaskData } from '@/src/types/Task';
import { PillarData } from '@/src/types/Pillar';
import { ObjectiveData } from '@/src/types/Objective';

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

	const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);

	const [showNote, setShowNote] = useState<boolean>(!!task?.note);
	const [showPriority, setShowPriority] = useState<boolean>(!!task?.priority);
	const [showPillar, setShowPillar] = useState<boolean>(!!task?.pillarUuid);
	const [showFrequency, setShowFrequency] = useState<boolean>(!!task?.frequency);
	const [showObjective, setShowObjective] = useState<boolean>(!!task?.objectiveUuid);
	const [showEndDateTime, setShowEndDateTime] = useState<boolean>(false);
	const [showAlert, setShowAlert] = useState(false);

	const { pillars, uncompletedObjectives } = useTasksData();
	const { showPicker, picker } = createTimePicker();
	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme);
	const { updateChecklist } = useChecklist();


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
				updateChecklist();
				resetForm();
				onClose();
				Toast.show({
                    type: 'success',
                    text1: 'Task Updated',
                    text2: `${itemName} has been updated for ${format(new Date(dateInput), 'dd/MM')} at ${format(new Date(dateInput), 'HH:mm')}`,
					visibilityTime: 8000
                });
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
				updateChecklist();
				resetForm();
				onClose();
				Toast.show({
                    type: 'success',
                    text1: 'Task Added',
                    text2: `${itemName} has been added for ${format(new Date(dateInput), 'dd/MM')} at ${format(new Date(dateInput), 'HH:mm')}`,
					visibilityTime: 8000
                });
			}
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

	useEffect(() => {
        if (task) {
            setShowMoreOptions(!!(
                task.note || 
                task.priority || 
                task.pillarUuid || 
                task.frequency || 
                task.objectiveUuid || 
                task.end
            ));
        }
    }, [task]);

	const modalContent = (
		<>
			<View style={{ marginVertical: 30, justifyContent: 'center', alignItems: 'center' }}>
				<GlitchText
					style={[designs.modal.title]}
					glitch={theme.name === 'signalis'}
				>
					{task ? '✏️ Edit Task' : '✅  Create Task'}
				</GlitchText>
			</View>

			<TaskBasicInfo 
				itemName={itemName}
				setItemName={setItemName}
			/>
			<TaskDateTime 
				dateInput={dateInput}
				showDateTimePicker={showDateTimePicker}
				styles={styles}
			/>

            {/* More Options Toggle */}
            <Pressable 
                style={[styles.moreOptionsButton]} 
                onPress={() => setShowMoreOptions(!showMoreOptions)}
            >
                {({ pressed }) => (
                    <Text style={[styles.moreOptionsText, { color: pressed ? theme.colors.accentColor : theme.colors.textColor }]}>
                        {showMoreOptions ? '− Less Options' : '+ More Options'}
                    </Text>
                )}
            </Pressable>

            {/* Collapsible section */}
            {showMoreOptions && (
                <View style={styles.moreOptionsContainer}>
                    {/* Timing Group */}
                    <View style={styles.optionsGroup}>
                        <Text style={styles.groupTitle}>Timing</Text>
                        <RepeatFrequencySelector
                            repeat={repeat}
                            frequency={frequency}
                            onRepeatChange={setRepeat}
                            onFrequencyChange={setFrequency}
                            styles={styles}
                            customFrequencyItems={frequencyItems}
                        />
                        <TaskEndDateTime
                            showEndDateTime={showEndDateTime}
                            setShowEndDateTime={setShowEndDateTime}
                            endDateInput={endDateInput}
                            showDateTimePicker={showDateTimePicker}
                            styles={styles}
                        />
                    </View>
					
                    {/* Organization Group */}
                    <View style={styles.optionsGroup}>
                        <Text style={styles.groupTitle}>Organization</Text>
                        <TaskPriority
                            showPriority={showPriority}
                            setShowPriority={setShowPriority}
                            priority={priority}
                            setPriority={setPriority}
                            priorityItems={priorityItems}
                            styles={styles}
                        />
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
                    </View>

                    {/* Notes Group */}
                    <View style={styles.optionsGroup}>
                        <TaskNote
                            showNote={showNote}
                            setShowNote={setShowNote}
                            noteText={noteText}
                            setNoteText={setNoteText}
                            styles={styles}
                        />
                    </View>
                </View>
            )}

			<PrimaryButton
				onPress={addNewItem}
				text={task ? 'Update' : 'Add Task'}
			/>
		</>
	);

	return (
		<>
			<UniversalModal isVisible={isOpen} onClose={onClose}>
				{modalContent}
				{picker}
			</UniversalModal>
			
			{showAlert && (
				<AlertModal
					isVisible={showAlert}
					title="Error"
					message="Please enter an item name"
					onConfirm={() => setShowAlert(false)}
					singleButton={true}
				/>
			)}
		</>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	switchContainer: {
		width: '100%',
	},
	dateTimeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 20,
		gap: 10
	},
	dateTimeButton: {
		flex: 1,
		padding: 10,
		borderColor: theme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 5,
		alignItems: 'center',
	},
	dateTimeText: {
		color: theme.colors.textColor,
		...(theme.name === 'signalis' && {
			fontSize: 16,
			fontFamily: theme.typography.fontFamily.secondary,
		})
	},
	moreOptionsButton: {
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    moreOptionsText: {
        color: theme.colors.textColor,
        fontSize: 16,
		...(theme.name === 'signalis' && {
			fontFamily: theme.typography.fontFamily.primary,
		})
    },
    moreOptionsContainer: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderColor,
        paddingTop: 10,
    },
    optionsGroup: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderColor,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.textColor,
        marginBottom: 10,
		...(theme.name === 'signalis' && {
			fontWeight: 'normal',
			fontSize: 18,
			color: theme.colors.textColorBold,
			fontFamily: theme.typography.fontFamily.primary,
		})
    },
});

export default TaskModal;