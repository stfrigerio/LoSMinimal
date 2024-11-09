import React from 'react';
import { View } from 'react-native';
import { FormInput, SwitchInput } from '@/app/components/FormComponents';

interface TaskNoteProps {
    showNote: boolean;
    setShowNote: (value: boolean) => void;
    noteText: string;
    setNoteText: (value: string) => void;
    styles: any;
}

export const TaskNote: React.FC<TaskNoteProps> = ({
    showNote,
    setShowNote,
    noteText,
    setNoteText,
    styles
}) => {
  return (
        <>
            <View style={styles.switchContainer}>
                <SwitchInput
                    label="Add Note"
                    value={showNote}
                    trueLabel="Add note"
                    falseLabel=""
                    leftLabelOff={true}
                    onValueChange={(value) => setShowNote(value)}
                />
            </View>
            {showNote && (
                <View style={{ width: '100%' }}>
                    <FormInput
                        label="Note"
                        value={noteText}
                        onChangeText={setNoteText}
                        placeholder="Enter note (optional)"
                    />
                </View>
            )}
        </>
    );
}; 