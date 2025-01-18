import { useState, useEffect } from 'react';
import { databaseManagers } from '@/database/tables';

export const useServerURL = () => {
    const [serverURL, setServerURL] = useState('');

    useEffect(() => {
        fetchServerURL();
    }, []);

    const fetchServerURL = async () => {
        try {
            const setting = await databaseManagers.userSettings.getByKey('serverUrl');
            if (setting) {
                setServerURL(setting.value);
            }
        } catch (error) {
            console.error('Failed to fetch server URL:', error);
        }
    };

    const saveServerURL = async () => {
        try {
            let urlToSave = serverURL.trim();
            urlToSave = urlToSave.replace(/^https?:\/\//, '');
            urlToSave = urlToSave.split(':')[0];

            const existingSetting = await databaseManagers.userSettings.getByKey('serverUrl');
            const newSetting = {
                settingKey: 'serverUrl',
                value: urlToSave,
                type: 'appSettings',
                uuid: existingSetting?.uuid
            };

            await databaseManagers.userSettings.upsert(newSetting);
            console.log(`Server URL saved successfully: ${urlToSave}`);
        } catch (error) {
            console.error('Failed to save server URL:', error);
        }
    };

    return { serverURL, setServerURL, saveServerURL };
}; 