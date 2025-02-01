import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faMoon, faSun, faCalendarDay, faCommentDots, faDatabase, faMoneyBill, faJournalWhills, faUsers, faMusic, faClock } from '@fortawesome/free-solid-svg-icons';

import { MenuButton } from './components/MenuButton';
import PopupMenu, { MenuItem } from './components/PopupMenu';

import { NotePeriod, useNavigationComponents } from './helpers/useNavigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { colorRainbow } from '@/src/styles/theme';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { getISOWeekData, getStartOfToday } from '@/src/utils/timezoneBullshit';

const LeftPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, toggleTheme } = useTheme();
    const { themeColors, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors, theme), [themeColors, theme]);
    const [activePopup, setActivePopup] = useState<'tasks' | 'money' | 'time' | 'mood' | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

    const { 
        openTasks, 
        openDailyNote, 
        openMoods, 
        openDatabase, 
        openNote, 
        openLibrary,
        openMoney,
        openJournal,
        openPeople,
        openTime
    } = useNavigationComponents();

    const withNavigationDelay = <T extends (...args: any[]) => void>(action: T) => {
        return ((...args: Parameters<T>): void => {
            setTimeout(() => action(...args), 150);
        }) as unknown as T;
    };
    
    const handleOpenTasks = withNavigationDelay(() => openTasks());
    const handleOpenDailyNote = withNavigationDelay(() => openDailyNote(getStartOfToday().toString()));
    const handleOpenNote = withNavigationDelay((type: string, date: string) => openNote(type as NotePeriod, date));
    const handleOpenMood = withNavigationDelay(() => openMoods());
    const handleOpenDatabase = withNavigationDelay(() => openDatabase());
    const handleOpenMoney = withNavigationDelay(() => openMoney());
    const handleOpenJournal = withNavigationDelay(() => openJournal());
    const handleOpenPeople = withNavigationDelay(() => openPeople());
    const handleOpenLibrary = withNavigationDelay(() => openLibrary());
    const handleOpenTime = withNavigationDelay(() => openTime());

    const getMenuItems = (type: 'tasks' | 'money' | 'time' | 'mood'): MenuItem[] => {
        switch (type) {
            case 'tasks':
                return [
                    { 
                        label: 'Dashboard', 
                        onPress: withNavigationDelay(() => openTasks())
                    },
                    { 
                        label: 'Task List', 
                        onPress: withNavigationDelay(() => openTasks('list'))
                    },
                    { 
                        label: 'Checklist', 
                        onPress: withNavigationDelay(() => openTasks('checklist'))
                    },
                    { 
                        label: 'Projects', 
                        onPress: withNavigationDelay(() => openTasks('projects'))
                    },
                ];
            case 'money':
                return [
                    { 
                        label: 'Dashboard', 
                        onPress: withNavigationDelay(() => openMoney())
                    },
                    { 
                        label: 'List', 
                        onPress: withNavigationDelay(() => openMoney('list'))
                    },
                    { 
                        label: 'Graph', 
                        onPress: withNavigationDelay(() => openMoney('graph'))
                    },
                    // Add more money-related options
                ];
            // case 'time':
            //     return [
            //         { 
            //             label: 'Timeline', 
            //             onPress: withNavigationDelay(() => openTime('timeline'))
            //         },
            //         { 
            //             label: 'Calendar', 
            //             onPress: withNavigationDelay(() => openTime('calendar'))
            //         },
            //         // Add more time-related options
            //     ];
            // case 'mood':
            //     return [
            //         { 
            //             label: 'Tracker', 
            //             onPress: withNavigationDelay(() => openMoods('tracker'))
            //         },
            //         { 
            //             label: 'Analytics', 
            //             onPress: withNavigationDelay(() => openMoods('analytics'))
            //         },
            //         // Add more mood-related options
            //     ];
            default:
                return [];
        }
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
    const { week, year } = getISOWeekData(new Date());
    const weekString = `${year}-W${week.toString().padStart(2, '0')}`;

    const GridRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <View style={styles.gridRow}>
            {children}
        </View>
    );    

    const handleLongPress = (type: 'tasks' | 'money' | 'time' | 'mood', event: any) => {
        const { pageX, pageY } = event.nativeEvent;
        setMenuPosition({ x: pageX, y: pageY });
        setActivePopup(type);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={theme === 'dark' ? 50 : 20} 
                    tint={theme === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    {/* Menu buttons section */}
                    <View style={styles.menuSection}>
                        <GridRow>
                            <MenuButton 
                                icon={faCalendarDay}
                                label={today}
                                onPress={handleOpenDailyNote}
                                color={colorRainbow[1]}
                            />
                            <MenuButton
                                icon={faCalendarDay}
                                label={weekString}
                                onPress={() => handleOpenNote('week', weekString)}
                                color={colorRainbow[2]}
                            />
                        </GridRow>
                        <View style={styles.separator} />
                        <GridRow>
                            <MenuButton
                                icon={faMoneyBill}
                                label="Money"
                                onPress={handleOpenMoney}
                                onLongPress={(event) => handleLongPress('money', event)}
                                color={colorRainbow[4]}
                            />
                            <MenuButton 
                                icon={faCheckCircle}
                                label="Tasks"
                                onPress={handleOpenTasks}
                                onLongPress={(event) => handleLongPress('tasks', event)}
                                color={colorRainbow[5]}
                            />
                        </GridRow>
                        <View style={styles.separator} />
                        <GridRow>
                            <MenuButton 
                                icon={faClock}
                                label="Time"
                                onPress={handleOpenTime}
                                onLongPress={(event) => handleLongPress('time', event)}
                                color={colorRainbow[11]}
                            />
                            <MenuButton 
                                icon={faCommentDots}
                                label="Mood"
                                onPress={handleOpenMood}
                                onLongPress={(event) => handleLongPress('mood', event)}
                                color={colorRainbow[6]}
                            />
                        </GridRow>
                        <View style={styles.separator} />
                        <GridRow>
                            <MenuButton 
                                icon={faJournalWhills}
                                label="Journal"
                                onPress={handleOpenJournal}
                                color={colorRainbow[10]}
                            />
                            <MenuButton 
                                icon={faUsers}
                                label="People"
                                onPress={handleOpenPeople}
                                color={colorRainbow[12]}
                            />
                        </GridRow>
                        <View style={styles.separator} />
                        <GridRow>
                            <MenuButton
                                icon={faMusic}
                                label="Library"
                                onPress={handleOpenLibrary}
                                color={colorRainbow[14]}
                            />
                            <MenuButton 
                                icon={faDatabase}
                                label="Database"
                                onPress={handleOpenDatabase}
                                color={colorRainbow[15]}
                            />
                        </GridRow>
                    </View>
                    
                    {/* Footer section */}
                    <View style={styles.footerContainer}>
                        <View style={styles.header}>
                            <Pressable 
                                onPress={toggleTheme} 
                                style={({ pressed }) => [
                                    styles.themeToggle,
                                    pressed && styles.themeTogglePressed
                                ]}
                            >
                                <FontAwesomeIcon 
                                    icon={theme === 'dark' ? faSun : faMoon}
                                    size={20}
                                    color={theme === 'dark' ? themeColors.textColor : themeColors.borderColor}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <PopupMenu
                isVisible={activePopup !== null}
                onClose={() => {
                    setActivePopup(null);
                    setMenuPosition(null);
                }}
                menuItems={activePopup ? getMenuItems(activePopup) : []}
                anchorPosition={menuPosition || undefined}
            />
        </View>
    );
};

const getStyles = (themeColors: any, theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1,
        minHeight: '100%',
    },
    content: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        zIndex: 1000,
        height: '100%',
    },
    menuSection: {
        flex: 1, 
        justifyContent: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: theme === 'dark' ? themeColors.borderColor : themeColors.gray,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    footerContainer: {
        width: '100%',  
        marginTop: 'auto', 
    },
    themeToggle: {
        padding: 8,
        borderRadius: 20,
    },
    themeTogglePressed: {
        backgroundColor: `${themeColors.backgroundColor}EE`,
        transform: [{ scale: 0.9 }],
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
});

export default LeftPanel;