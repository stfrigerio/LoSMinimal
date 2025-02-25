import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { 
    faCheckCircle, 
    faCalendarDay, 
    faCommentDots, 
    faDatabase, 
    faMoneyBill, 
    faJournalWhills, 
    faUsers, 
    faMusic, 
    faClock 
} from '@fortawesome/free-solid-svg-icons';

import { MenuButton } from './components/MenuButton';
import PopupMenu from './components/PopupMenu';
import { ThemeSelector } from './components/ThemeSelector';

import { useNavigationComponents } from './helpers/useNavigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { colorRainbow } from '@/src/styles/theme';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { getISOWeekData } from '@/src/utils/timezoneBullshit';
import { getMenuItems, getNavigationHandlers } from './helpers/getMenuItems';

const LeftPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { setTheme } = useTheme();
    const { theme } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme), [theme]);
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

    const { 
        handleOpenTasks, 
        handleOpenDailyNote, 
        handleOpenNote, 
        handleOpenMood, 
        handleOpenDatabase, 
        handleOpenMoney, 
        handleOpenJournal, 
        handleOpenPeople, 
        handleOpenLibrary, 
        handleOpenTime 
    } = getNavigationHandlers({
        openTasks,
        openDailyNote,
        openNote,
        openMoods,
        openDatabase,
        openMoney,
        openJournal,
        openPeople,
        openLibrary,
        openTime
    });

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

    const getBlurIntensity = (themeName: string) => {
        switch (themeName) {
            case 'dark': return 50;
            case 'light': return 20;
            case 'signalis': return 50;
            default: return 35;
        }
    };

    const getTint = (themeName: string) => {
        switch (themeName) {
            case 'dark': return 'dark';
            case 'light': return 'light';
            case 'signalis': return 'dark';
            default: return 'dark';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={getBlurIntensity(theme.name)} 
                    tint={getTint(theme.name)} 
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
                        {theme.name !== 'signalis' && <View style={styles.separator} />}
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
                        {theme.name !== 'signalis' && <View style={styles.separator} />}
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
                        {theme.name !== 'signalis' && <View style={styles.separator} />}
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
                        {theme.name !== 'signalis' && <View style={styles.separator} />}
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
                            <ThemeSelector
                                currentTheme={theme.name}
                                onSelectTheme={setTheme}
                                theme={theme}
                            />
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
                menuItems={activePopup ? getMenuItems({
                    type: activePopup,
                    openTasks,
                    openDailyNote,
                    openNote,
                    openMoods,
                    openDatabase,
                    openMoney,
                    openJournal,
                    openPeople,
                    openLibrary,
                    openTime
                }) : []}
                anchorPosition={menuPosition || undefined}
            />
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
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
        backgroundColor: theme.colors.borderColor,
        marginVertical: theme.spacing.md,
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
        backgroundColor: `${theme.colors.backgroundColor}EE`,
        transform: [{ scale: 0.9 }],
    },
    gridRow: {
        flexDirection: theme.name === 'signalis' ? 'column' : 'row',
        justifyContent: 'space-between',
    },
});

export default LeftPanel;