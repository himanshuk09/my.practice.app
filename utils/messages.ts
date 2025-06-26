import { Href } from "expo-router";

export const AUTHKEYS = {
	EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	USERNAME_REGEX: /^[a-zA-Z0-9]+$/,
	MISSING_USERNAME_AND_PASSWORD: "Please_enter_your_username_and_password",
	MISSING_USERNAME: "Please_enter_your_username",
	MISSING_PASSWORD: "Please_enter_your_password",
	INVALID_USERNAME: "Username_should_not_contain_special_characters",
	INVALID_EMAIL: "Please_enter_a_valid_email_address",
	SUCCESS: "LoggedIn_Successful",
	FAILURE: "Login_failed_Please_check_your_credentials",
	ERROR: "An_error_occurred_Please_try_again",
	ERROR_TITLE: "Login_failed_Please_try_again",
	UNKNOWN_ERROR: "An_unknown_error_occurred_Please_try_again",
	LOGOUT_TITLE: "logout_title",
	LOGOUT_MESSAGE: "logout_message",
	MESSAGE_SENT: "message_sent_successfully",
	SUCCESS_TEXT: "success",
	ERROR_TEXT: "Error",
	SOMETHING_WORNG: "Something_went_wrong",
	SUBMIT: "submit",
	SUBMIT_FEEDBACK: "thank_you_for_your_feedback",
	INVALID_RESPONSE: "Invalid_response_data_from_API",
	SERVICE_UNAVAILABLE:
		"Service_is_currently_unavailable_Please_try_again_later",
	TECHNICAL_ISSUES:
		"Were_experiencing_technical_issues_Please_try_again_later",
	SESSION_EXPIRED: "Your_session_has_expired_Please_log_in_again",
	PERMISSION_NOT_GRANTED: "You_dont_have_permission_to_perform_this_action",
	REQUEST_TIMEOUT: "The_request_timed_out_Please_try_again",
	TOO_MANY_REQUEST: "Too_many_requests_Please_wait_a_moment_and_try_again",
	NOT_FOUND_ROUTES: "Page_Not_Found",
} as const;

export const NETWORKKEYS = {
	NO_INTERNET: "No_Internet_Connection",
	WAITING_FOR_CONNECTION: "Waiting_for_reconnection",
	NETWORK_ERROR: "Network_error_Please_check_your_internet_connection",
} as const;

export const UPDATEKEYS = {
	UPDATE_AVAILABLE: "Update_Available",
	TAP_TO_RELOAD_RESTART: "Tap_to_roload_or_restart_the_app",
	UPDATE_FAILED: "Update_Failed",
	TRY_AGAIN: "Please_try_again_later",
} as const;

export const PERMISSIONKEYS = {
	PERMISSION_REQUIRED: "Permission_Required",
	PERMISSION_DENIED: "Permission_Denied",
	PERMISSION_STORAGE_NOT_GRANTED: "Storage_access_not_granted",
	ENABLE_PERMISSION: "Please_enable_permission_from_settings",
	ENABLE_NOTIFICATION: "Please_enable_notifications_in_system_settings",
	ASK_ME_LATER: "Ask_Me_Later",
	OPEN_SETTINGS: "Open_Settings",
	CANT_OPEN_CSV: "Cannot_Open_CSV",
	CANT_OPEN_FILE: "Cannot_Open_File",
	INSTALLED_CSV_VIEWER: "Make_sure_a_CSV_viewer_is_installed",
	INSTALLED_FILE_VIEWER: "install_a_file_viewer",
	SHARING_NOT_AVAILABLE: "Sharing_isnot_available_on_your_platform",
	UNABLED_TO_SHARED: "Unabled_to_shared",
	FAILED_TO_SHARED_PNG: "Failed_to_Share_PNG",
	ENSURE_SHARING: "Ensure_your_device_supports_sharing",
	CHART_SAVED: "Chart_saved",
	FILE_SAVED: "File_Saved",
	SAVED_FAILED: "Save_Failed",
	TAP_TO_OPEN: "Tap_to_open",
	ERROR_ON_SAVING: "An_error_occurred_while_saving",
	DOWNLOAD_FAILED: "Download_Failed",
	EXIT_APP: "exit_app",
	EXIT_MESSAGE: "exit_msg",
	ENABLED: "enabled",
	DISABLED: "disabled",
} as const;

export const LOCALSTORAGEKEYS = {
	NOTIFICATION_PROMPTED: "notification_prompted",
	NOTIFICATION_PREFERENCE: "notification_preference",
	SIGNAL_PREFERENCE: "signal_preference",
	SESSION: "session",
	TOKEN: "token",
	USERID: "UserId",
	APKVERSION: "ApkVersion",
	CULTURE: "culture",
	DIRECTORY_URI_KEY: "SAVED_DIRECTORY_URI",
} as const;

export const PICKERVALIDATEMESSAGE = {
	MIN_MAX: {
		BOTH_REQUIRED: "Both_min_and_max_are_required",
		EMPTY_VALUES: "Values_cannot_be_empty",
		MAX_LESS_THAN_MIN: "Max_value_must_be_greater_than_min",
	},
	DATE: {
		INVALID_DATES: "Please_enter_valid_start_and_end_dates",
		END_BEFORE_START: "The_end_date_must_be_later_than_start_date",
	},
} as const;

export const ROUTES: Href[] = [
	"/",
	"/(auth)/forgot-password",
	"/(auth)/login",
	"/+not-found",
	"/dashboard",
	"/dashboard/(tabs)/loaddata",
	"/dashboard/(tabs)/pfc",
	"/dashboard/(tabs)/portfolio",
	"/dashboard/(tabs)/prices",
	"/dashboard/(tabs)/signals",
	"/dashboard/feedback/contact",
	"/dashboard/feedback/rate",
	"/dashboard/legalnotes/imprint",
	"/dashboard/legalnotes/privacypolicy",
	"/dashboard/legalnotes/termscondition",
	"/dashboard/(tabs)/prices/settings",
	"/_sitemap",
];

export const ROUTEKEYS = {
	INITIAL: "/",
	LOGIN: "/(auth)/login",
	FORGOT_PASSWORD: "/(auth)/forgot-password",
	DASHBOARD: "/dashboard",
	SETTINGS: "/dashboard/settings",
	LOADDATA: "/dashboard/(tabs)/loaddata",
	PFC: "/dashboard/(tabs)/pfc",
	PORTFOLIO: "/dashboard/(tabs)/portfolio",
	PRICES: "/dashboard/(tabs)/prices",
	SIGNALS: "/dashboard/(tabs)/signals",
	LOADDATA_ID: "/dashboard/(tabs)/loaddata/[id]",
	PFC_ID: "/dashboard/(tabs)/pfc/[id]",
	PORTFOLIO_ID: "/dashboard/(tabs)/portfolio/[id]",
	PRICES_SETTINGS: "/dashboard/(tabs)/prices/settings",
	PRICES_ID: "/dashboard/(tabs)/prices/[id]",
	SIGNALS_ID: "/dashboard/(tabs)/signals/[id]",
	CONTACT_US: "/dashboard/feedback/contact",
	RATE: "/dashboard/feedback/rate",
	IMPRINT: "/dashboard/legalnotes/imprint",
	POLICY_PRIVACY: "/dashboard/legalnotes/privacypolicy",
	TERMS_CONDITIONS: "/dashboard/legalnotes/termscondition",
	ENEXION_WEB_LINK: "http://test-eec.enexion-sys.de/Cockpit.aspx",
	SITE_MAP: "/_sitemap",
} as const satisfies Record<string, Href>;
