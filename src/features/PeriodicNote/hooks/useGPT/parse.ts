interface ParsedContent {
    reflection: {
        nice: string;
        notSoNice: string;
    };
    questionsToPonder: string[];
}

export const parseAISummary = (content: string): ParsedContent => {
    const reflectionMatch = content.match(/<reflection>([\s\S]*?)<\/reflection>/);
    const questionsMatch = content.match(/<questions_to_ponder>([\s\S]*?)<\/questions_to_ponder>/);

    if (!reflectionMatch && !questionsMatch) {
        return {
            reflection: {
                nice: content.trim(),  // Put the entire content in the 'nice' field
                notSoNice: ''
            },
            questionsToPonder: []
        };
    }

    const reflection = reflectionMatch ? reflectionMatch[1].trim() : '';
    const questions = questionsMatch ? questionsMatch[1].trim() : '';

    const [nice, notSoNice] = reflection.split('Not so nice:').map(part => part.replace('Nice:', '').trim());

    const questionsList = questions.split('\n')
        .filter(q => q.trim())
        .map(q => q.replace(/^\d+\.\s*/, '').trim());

    return {
        reflection: { nice, notSoNice },
        questionsToPonder: questionsList
    };
};