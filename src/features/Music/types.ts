import { TrackData } from '../../types/Library';

export interface Album {
    name: string;
    id?: string;
    songs: string[];
    uuid?: string;
}

export interface ExtendedTrackData extends TrackData {
    artistName: string;
}

export interface TrackDetailsState {
    details: { [key: string]: TrackData };
    orderedSongs: string[];
}

export type SimpleTrackData = Pick<TrackData, 'trackName' | 'fileName' | 'durationMs' | 'rating' | 'playCount'>; 