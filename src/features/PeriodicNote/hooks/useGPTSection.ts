import { useState, useEffect } from 'react';
import axios from 'axios';

import { databaseManagers } from '@/database/tables';
import { usePeriodicData } from './usePeriodicData';
import { useTextSection } from './useTextSection';
import { useObjectives } from './useObjectives';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';

import { fetchQuarterlySummariesForYear } from './useGPT/fetchSummaries';
import { parseAISummary } from './useGPT/parse';
import { fetchWeeklySummariesForMonth, fetchMonthlySummariesForQuarter } from './useGPT/fetchSummaries';
import { getNextWeekDate, getNextMonthDate, getNextQuarterDate } from './useGPT/getDates';

interface ParsedContent {
    reflection: {
        nice: string;
        notSoNice: string;
    };
    questionsToPonder: string[];
}

export const useGPTSection = (startDate: Date, endDate: Date, currentDate: string) => {
    const [aiSummary, setAiSummary] = useState<ParsedContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);

    const { current } = usePeriodicData(startDate, endDate);
    const { dailyNoteData, timeData, moneyData, moodData, journalData } = current;

    let periodType = 'month'; // default value
    
    if (currentDate.includes('-W')) {
        periodType = 'week';
    } else if (currentDate.includes('Q')) {
        periodType = 'quarter';
    } else if (currentDate.match(/^\d{4}$/)) {
        periodType = 'year';
    }

    const { handleInputChange: handleTextInputChange, refetchData: fetchTextData } = useTextSection({ periodType, startDate, endDate });
    const { addObjective } = useObjectives(currentDate);

    useEffect(() => {
        fetchAiSummary();
    }, [currentDate]);

    const fetchAiSummary = async () => {
        setIsLoading(true);
        try {
            const gptResponse = await databaseManagers.gpt.getByDate(currentDate);
            if (gptResponse && gptResponse.length > 0) {
                const parsedContent = parseAISummary(gptResponse[0].summary);
                setAiSummary(parsedContent);
                setError(null);
            } else {
                setAiSummary(null);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching AI summary:', error);
            setAiSummary(null);
            setError("Error fetching AI summary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const generateSummary = async () => {
        setIsLoading(true);
        try {
            let data: any = {};
            let endpoint = '';

            if (periodType === 'week') {
                data = {
                    dailyNoteData,
                    moodData,
                    currentDate
                };
                endpoint = 'weekly_summary';
            } else if (periodType === 'month') {
                data = {
                    dailyNoteData,
                    moodData,
                    currentDate
                };
                const weeklySummaries = await fetchWeeklySummariesForMonth(currentDate);
                data.weeklyAISummaries = weeklySummaries;
                endpoint = 'monthly_summary';
            } else if (periodType === 'quarter') {
                data = {
                    moodData,
                    currentDate
                };
                const monthlySummaries = await fetchMonthlySummariesForQuarter(currentDate, currentDate.split('-')[0]);
                data.monthlyAISummaries = monthlySummaries;
                endpoint = 'quarterly_summary';
            } else if (periodType === 'year') {
                data = {
                    moodData,
                    currentDate
                };
                const quarterlySummaries = await fetchQuarterlySummariesForYear(currentDate);
                data.quarterlyAISummaries = quarterlySummaries;
                endpoint = 'yearly_summary';
            }
    
            const flaskURL = await getFlaskServerURL();
            const response = await axios.post(`${flaskURL}/${endpoint}`, data);
    
            if (response.data && response.data.mood_summary) {
                const moodSummary = response.data.mood_summary;
                
                // Save to database
                await databaseManagers.gpt.upsert({
                    date: moodSummary.date,
                    type: moodSummary.type,
                    summary: moodSummary.claude_summary,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
    
                // Process GPT summary
                if (moodSummary.gpt_summary) {
                    const gptSummary = moodSummary.gpt_summary;
                    
                    // Save successes, areas for improvement, and insights
                    ['successes', 'areas_for_improvement', 'insights'].forEach((key) => {
                        gptSummary[key].forEach((item: string) => {
                            handleTextInputChange({ 
                                text: item + ' 🤖', 
                                period: currentDate, 
                                key: key === 'successes' ? 'success' : key === 'areas_for_improvement' ? 'beBetter' : 'think'
                            });
                        });
                    });
    
                    // Save next week goals as objectives
                    if (Array.isArray(gptSummary.next_week_goals)) {
                        const nextPeriodDate = periodType === 'week' ? getNextWeekDate(currentDate) : getNextMonthDate(currentDate);
                        gptSummary.next_week_goals.forEach((goalData: any) => {
                            addObjective({
                                objective: goalData.goal + ' 🤖',
                                completed: goalData.completed,
                                pillarUuid: goalData.pillar_uuid,
                                pillarEmoji: goalData.pillar_emoji,
                                period: nextPeriodDate,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            });
                        });
                    }
                }
    
                await fetchAiSummary();
                await fetchTextData();
                console.log('Summary generated and saved successfully');

            } else {
                throw new Error("Failed to generate summary: Unexpected response format");
            }
        } catch (error) {
            console.error('Error generating or saving summary:', error);
            let message = "Error generating or saving summary. Please try again.";
            if (error instanceof Error) {
                message += ` ${error.message}`;
            }
            setErrorMessage(message);
            setIsErrorAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        aiSummary,
        error,
        isLoading,
        isAlertVisible,
        errorMessage,
        isErrorAlertVisible,
        setIsAlertVisible,
        setIsErrorAlertVisible,
        generateSummary,
    };
};