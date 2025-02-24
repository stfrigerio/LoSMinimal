import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import PersonEntry from './components/PersonEntry';
import MobileNavbar from '@/src/components/NavBar';
import AddPersonModal from './modals/PersonModal';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { usePeopleData } from './hooks/usePeopleData';
import { useContactData } from './hooks/useContactData';

import { PersonData } from '@/src/types/People';
import { ContactData } from '@/src/types/Contact';


const PeopleHub: React.FC = () => {
    const { theme } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme), [theme]);
    const [activeView, setActiveView] = useState('List');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { 
        people, 
        isLoading: isPeopleLoading, 
        error: peopleError, 
        deletePerson,
        refreshPeople 
    } = usePeopleData();

    const {
        contacts,
        isLoading: isContactsLoading,
        error: contactsError,
    } = useContactData();

    // Filter and sort the people
    const filteredAndSortedPeople = useMemo(() => {
        return people
            .sort((a: PersonData, b: PersonData) => a.name.localeCompare(b.name));
    }, [people]);

    const renderItem = ({ item }: { item: PersonData }) => (
        <PersonEntry
            person={item}
            contacts={contacts}
            deletePerson={deletePerson}
            refreshPeople={refreshPeople}
        />
    );

    const navItems = [
        { label: 'List', onPress: () => setActiveView('List') },
    ];

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        refreshPeople();
    };

    return (
        <View style={styles.container}>
            {activeView === 'List' && (
                <>
                    <FlatList
                        data={filteredAndSortedPeople}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                    />
                    {isAddModalOpen && (
                        <AddPersonModal
                            isOpen={isAddModalOpen}
                            onClose={handleCloseModal}
                        />
                    )}
                </>
            )}
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === activeView)} 
                quickButtonFunction={() => setIsAddModalOpen(true)}
                screen="people"
            />
        </View>
    );
};

export default PeopleHub;

const getStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
            paddingHorizontal: 10,
            paddingTop: 37,
        },
        list: {
            marginTop: 30,
            flex: 1,
            marginBottom: 80,
        },
    });
};