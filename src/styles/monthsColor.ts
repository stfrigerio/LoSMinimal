export const getFillColorForMonth = (monthName: string) => {
    const colors: { [key: string]: string } = {
        January: '#cfe2f3',
        February: '#a2c4c9',
        March: '#76a5af',
        April: '#93c47d',
        May: '#6aa84f',
        June: '#8fce00',
        July: '#ffd966',
        August: '#f1c232',
        September: '#ce7e00',
        October: '#e06666',
        November: '#f4cccc',
        December: '#eeeeee',
    };
    return colors[monthName] || '#FFFFFF';
};
