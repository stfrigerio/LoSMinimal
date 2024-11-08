import { TableData } from '@/app/features/Database/types/types';

import { updateMobileData } from '@/app/features/Database/hooks/updateMobile';

export const syncDatabases = async (mergedData: TableData) => {
	try {

		for (const [table, data] of Object.entries(mergedData)) {
			console.log(`First item of ${table}:`, data[0]);
		}

		await updateMobileData(mergedData);
				
		return { 
			success: true, 
			message: 'Database sync completed successfully',
		};
	} catch (error) {
		console.error('Sync failed:', error);
		return { success: false, message: 'Sync failed', error };
	}
};