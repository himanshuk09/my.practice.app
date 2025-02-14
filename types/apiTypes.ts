interface loginPayloadProps {
	username?: string | undefined;
	password?: string | undefined;
}
interface AuthResponse {
	expires?: number;
	issued?: string;
	ApiApkVersion?: string | undefined | any;
	ApkPlayStoreLink?: string;
	ClientName?: string;
	IpaAppStoreLink?: string;
	IsTermsConAccepted?: string;
	UserId?: string;
	access_token?: string;
	clientId?: string;
	culture?: string;
	cultureId?: string;
	expires_in?: number;
	firstName?: string;
	lastName?: string;
	timeZoneDescription?: string;
	token_type?: string;
	userName?: string;
}

export { loginPayloadProps, AuthResponse };
