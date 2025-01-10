
export const cleanText = (text: string) => {
    return text ? text.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '') : '';
};