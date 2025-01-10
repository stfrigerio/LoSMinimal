export const ensureHttpsUrl = (url: string) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return `https:${url}`;
    }
    return url;
};