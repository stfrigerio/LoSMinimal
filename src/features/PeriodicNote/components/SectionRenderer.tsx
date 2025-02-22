import React from 'react';
import { ObjectivesSection } from './Sections/ObjectivesSection';
import QuantifiableSection from './Sections/QuantifiableSection';
import BooleanSection from './Sections/BooleanSection';
import MoneySection from './Sections/MoneySection';
import TimeSection from './Sections/TimeSection';
import SleepSection from './Sections/SleepSection';
import GPTSection from './Sections/GPTSection';
import TextLists from './TextLists';
import TextInputs from './TextInputs';

type SectionRendererProps = {
    activeSection: string;
    dateState: {
        startDate: Date;
        endDate: Date;
        periodType: string;
        formattedDate: string;
    };
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    tagColors: any;
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({
    activeSection,
    dateState,
    isModalVisible,
    setIsModalVisible,
    tagColors,
}) => {
    // Early return for sections that shouldn't be shown in allTime view
    if (dateState.periodType === 'allTime') {
        switch (activeSection) {
            case 'quantifiable':
                return (
                    <QuantifiableSection
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        tagColors={tagColors}
                        periodType={dateState.periodType}
                    />
                );
            case 'boolean':
                return (
                    <BooleanSection
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        periodType={dateState.periodType}
                    />
                );
            case 'money':
                return (
                    <MoneySection
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        tagColors={tagColors}
                    />
                );
            case 'time':
                return (
                    <TimeSection
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        tagColors={tagColors}
                    />
                );
            default:
                return null;
        }
    }

    switch (activeSection) {
        case 'objectives':
            return (
                <ObjectivesSection
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    currentDate={dateState.formattedDate}
                />
            );
        case 'quantifiable':
            return (
                <QuantifiableSection
                    startDate={dateState.startDate}
                    endDate={dateState.endDate}
                    tagColors={tagColors}
                    periodType={dateState.periodType}
                />
            );
        case 'boolean':
            if (dateState.periodType === 'week') return null;
            return (
                <BooleanSection
                    startDate={dateState.startDate}
                    endDate={dateState.endDate}
                    periodType={dateState.periodType}
                />
            );
        case 'money':
            return (
                <MoneySection
                    startDate={dateState.startDate}
                    endDate={dateState.endDate}
                    tagColors={tagColors}
                />
            );
        case 'time':
            return (
                <TimeSection
                    startDate={dateState.startDate}
                    endDate={dateState.endDate}
                    tagColors={tagColors}
                />
            );
        case 'sleep':
            if (dateState.periodType === 'year') return null;
            return (
                <SleepSection
                    startDate={dateState.startDate}
                    endDate={dateState.endDate}
                    periodType={dateState.periodType}
                />
            );
        case 'gpt':
            return (
                <>
                    <GPTSection
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        currentDate={dateState.formattedDate}
                    />
                    {dateState.periodType !== 'quarter' && dateState.periodType !== 'year' && (
                        <>
                            <TextLists
                                startDate={dateState.startDate}
                                endDate={dateState.endDate}
                            />
                        </>
                    )}
                    <TextInputs
                        periodType={dateState.periodType}
                        startDate={dateState.startDate.toString()}
                        endDate={dateState.endDate.toString()}
                    />
                </>
            );
        default:
            return null;
    }
};