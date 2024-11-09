export interface NavItem {
    label: string;
    onPress: () => void;
}

export interface MobileNavbarProps {
    items: NavItem[];
    activeIndex: number;
    showFilter?: boolean;
    onFilterPress?: () => void;
    quickButtonFunction?: () => void;
    screen?: string;
}
