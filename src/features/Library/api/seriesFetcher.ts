import { databaseManagers } from '@/database/tables';

import { LibraryData } from '@/src/types/Library';

const API_URL = "https://www.omdbapi.com/";
let API_KEY: string | null = null;

async function initializeApiKey() {
    if (API_KEY !== null) return;
    try {
        const setting = await databaseManagers.userSettings.getByKey('moviesApiKey');
        API_KEY = setting?.value || "";
    } catch (error) {
        console.error("❌ Error initializing API key:", error);
    }
}

async function ensureApiKeyLoaded() {
    if (API_KEY === null) {
        await initializeApiKey();
    }
}

export interface Series {
    Title: string;
    Year: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    totalSeasons: string;
}

interface Rating {
    Source: string;
    Value: string;
}

interface OmdbSearchResult {
    Search: Series[];
    totalResults: string;
    Response: string;
}

export async function fetchSeries(query: string): Promise<Series[]> {
    await ensureApiKeyLoaded();

    try {
        const searchResults = await apiGet({ s: query, type: "series" });
        if (!searchResults || !searchResults.Search || !searchResults.Search.length) {
            return [];
        }

        return searchResults.Search;
    } catch (error) {
        console.error("Error fetching series:", error);
        return [];
    }
}

export function isImdbId(str: string): boolean {
    return /^tt\d+$/.test(str);
}

export async function getByImdbId(id: string): Promise<LibraryData | null> {
    await ensureApiKeyLoaded();

    const res = await apiGet({ i: id });
    if (!res || res.Type !== "series") {
        return null;
    }

    return {
        id: parseInt(res.imdbID.replace("tt", "")),
        seen: new Date().toString(),
        title: res.Title,
        type: 'series',
        genre: res.Genre,
        creator: res.Director !== 'N/A' ? res.Director : res.Writer,
        releaseYear: res.Year,
        rating: parseFloat(res.imdbRating),
        comments: '',
        mediaImage: res.Poster,
        plot: res.Plot,
        cast: res.Actors,
        writer: res.Writer,
        metascore: res.Metascore !== 'N/A' ? res.Metascore : null,
        ratingImdb: res.imdbRating === 'N/A' ? undefined : parseFloat(res.imdbRating),
        tomato: extractTomatoRating(res.Ratings),
        runtime: res.Runtime,
        awards: res.Awards,
        seasons: parseInt(res.totalSeasons),
        finished: 0,
    };
} 

function extractTomatoRating(ratings: Rating[]): number | undefined {
    const tomatoRating = ratings.find(rating => rating.Source === "Rotten Tomatoes");
    if (tomatoRating && tomatoRating.Value) {
        // Assuming the Rotten Tomatoes rating is like "75%", extracting the number part
        const value = parseInt(tomatoRating.Value);
        if (!isNaN(value)) {
            return value;
        }
    }
    return undefined; // Return undefined instead of null
}

async function apiGet(params: Record<string, string | undefined>): Promise<OmdbSearchResult | any> {
    await ensureApiKeyLoaded();

    if (!API_KEY) {
        console.error("API Key is missing!");
        return null;
    }

    let finalURL = new URL(API_URL);
    Object.keys(params).forEach(key => finalURL.searchParams.append(key, params[key] || ""));
    finalURL.searchParams.append("apikey", API_KEY);
    try {
        const response = await fetch(finalURL.href);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Request Failed:", error);
        return null;
    }
}