import { databaseManagers } from '@/database/tables';

export interface GameSearchResult {
    id: number; // Assuming 'id' is a number
    name: string;
    first_release_date: number | null; // Allow null values as well
    genres: Genre[]; // Array of Genre
    involved_companies: InvolvedCompany[]; // Array of InvolvedCompany
    cover: {
        id: number;
        url: string;
    };
    igdbRating?: number; // Optional, as it may not always be present
    summary: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Company {
    id: number;
    logo?: number; // Optional, as logo may not always be present
    name: string;
}

export interface InvolvedCompany {
    id: number;
    company: Company;
    developer: boolean;
}

const API_URL = "https://api.igdb.com/v4/games";
const AUTH_URL = "https://id.twitch.tv/oauth2/token";
let API_CLIENT_ID: string | null = null;
let API_CLIENT_SECRET: string | null = null;

async function initializeApiKey() {
    if (API_CLIENT_ID !== null && API_CLIENT_SECRET !== null) return; // Avoid redundant calls

    try {
        const clientIdSetting = await databaseManagers.userSettings.getByKey('igdbClientId');
        API_CLIENT_ID = clientIdSetting?.value || "";

        const clientSecretSetting = await databaseManagers.userSettings.getByKey('igdbClientSecret');
        API_CLIENT_SECRET = clientSecretSetting?.value || "";

        console.log("✅ IGDB API Keys Initialized:", API_CLIENT_ID, API_CLIENT_SECRET);
    } catch (error) {
        console.error("❌ Error initializing API keys:", error);
    }
}

async function ensureApiKeysLoaded() {
    if (API_CLIENT_ID === null || API_CLIENT_SECRET === null) {
        await initializeApiKey();
    }
}

async function getAuthToken() {
    await ensureApiKeysLoaded(); // 🔥 Wait for API keys before requesting auth

    if (!API_CLIENT_ID || !API_CLIENT_SECRET) {
        console.error("🚨 Missing API Credentials! Cannot request token.");
        return null;
    }

    try {
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${API_CLIENT_ID}&client_secret=${API_CLIENT_SECRET}&grant_type=client_credentials`
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
    }
}


// Main search function
export async function searchGames(query: string): Promise<GameSearchResult[]> {
    if (!query) {
        return [];
    }

    await ensureApiKeysLoaded();

    const token = await getAuthToken();
    if (!token) {
        return [];
    }

    // Define the fields you want in the response
    const requestBody = `fields id, name, first_release_date, genres.name, cover.url, summary, rating, involved_companies.developer, involved_companies.company.name, involved_companies.company.logo; search "${query}"; limit 15;`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-ID': API_CLIENT_ID || '',
                'Content-Type': 'application/json' // Make sure to include the content type header
            },
            body: requestBody // Include the request body
        });

        if (!response.ok) {
            console.error("API Request Failed with status: ", response.status);
            return [];
        }

        let data: GameSearchResult[] = await response.json();

        // Convert Unix timestamps to years and update the data array
        data = data.map(game => {
            const convertedDate = game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : null; // Convert timestamp to year
            return {
                ...game,
                first_release_date: convertedDate
            };
        });

        return data;
    } catch (error) {
        console.error("API Request Failed:", error);
        return [];
    }
}

