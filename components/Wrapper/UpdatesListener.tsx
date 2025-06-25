import { useEffect } from "react";
import * as Updates from "expo-updates";
import { UPDATEKEYS } from "@/utils/messages";
import { showToast } from "@/components/ToastConfig";
const isDev = __DEV__;
const UpdatesListener = () => {
	const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
		Updates.useUpdates();

	const applyUpdate = async () => {
		try {
			const result = await Updates.fetchUpdateAsync();
			if (result.isNew) {
				await Updates.reloadAsync(); // Reload app to apply update
			}
		} catch (error) {
			console.error("Failed to apply update:", error);
			showToast({
				type: "error",
				title: UPDATEKEYS.UPDATE_FAILED,
				subtitle: UPDATEKEYS.TRY_AGAIN,
			});
		}
	};

	useEffect(() => {
		const checkForUpdate = async () => {
			try {
				if (isUpdateAvailable || isUpdatePending) {
					showToast({
						type: "info",
						title: UPDATEKEYS.UPDATE_AVAILABLE,
						subtitle: UPDATEKEYS.TAP_TO_RELOAD_RESTART,
						autoHide: false,
						swipeable: false,
						props: {
							update: true,
							onPress: applyUpdate,
						},
					});
				}
			} catch (error) {
				console.error("Error checking for update:", error);
			}
		};
		if (!isDev) checkForUpdate();
	}, [isUpdateAvailable, isUpdatePending]);

	return null; // no UI, just listener
};

export default UpdatesListener;
