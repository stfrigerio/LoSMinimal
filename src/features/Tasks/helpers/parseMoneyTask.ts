import { MoneyData } from '@/src/types/Money';
import { databaseManagers } from '@/database/tables';

export const parseMoneyTask = async (
    taskDate: string, 
    taskText: string, 
    taskNote?: string
): Promise<MoneyData | null> => {
    try {
        // If we have the note with stored transaction details, use that
        if (taskNote) {
            try {
                const transactionDetails = JSON.parse(taskNote);
                return {
                    date: taskDate,
                    ...transactionDetails
                };
            } catch (e) {
                console.error('Error parsing task note:', e);
            }
        }

        // Fallback to parsing from text if note parsing fails
        const isExpense = taskText.startsWith('💸');
        
        // Remove type emoji and trim
        let text = taskText.slice(2).trim();
        
        // Split by dash and amount
        const [mainPart, amountPart] = text.split('-').map(part => part.trim());
        
        // Extract amount
        const amountMatch = amountPart.match(/(\d+(?:\.\d+)?)€/);
        if (!amountMatch) {
            throw new Error('Could not parse amount from task text');
        }
        const amount = parseFloat(amountMatch[1]);

        // Split main part into description and tag
        const parts = mainPart.split(' ');
        const lastPart = parts[parts.length - 1];
        
        // Get tag (either emoji or #text)
        let tag = lastPart.startsWith('#') ? lastPart.slice(1) : lastPart;
        
        // Get description (everything before the tag)
        let description = parts.slice(0, -1).join(' ').trim();

        // If description or tag is an emoji, look up the actual text
        const tagData = await databaseManagers.tags.getTagsByType('moneyTag');
        const descriptionData = await databaseManagers.tags.getDescriptionsByTag(tag);

        // Find actual description text if emoji was used
        const actualDescription = descriptionData.find(d => d.emoji === description)?.text || description;
        
        // Find actual tag text if emoji was used
        const actualTag = tagData.find(t => t.emoji === tag)?.text || tag;

        const moneyData: MoneyData = {
            date: taskDate,
            amount,
            type: isExpense ? 'Expense' : 'Income',
            tag: actualTag,
            description: actualDescription,
            synced: 0
        };

        return moneyData;

    } catch (error) {
        console.error('Error parsing money task:', error);
        return null;
    }
};