type TranslationValue = string | { [nestedKey: string]: string };

type TranslationMap = {
	[key: string]: TranslationValue;
};

type SupportedLanguages = "en" | "de";

type Translations = {
	[lang in SupportedLanguages]: TranslationMap;
};
export const TranslationKeys: Translations = {
	en: {
		unit: "kWh",
		tooltip: "Tooltip",
		xaxisUnit: "Date / Time",
		Month: "Month",
		Week: "Week",
		Day: "Day",
		Year: "Year",
		Year_3: "3 Year",
		Quarter: "Quarter",
		M: "M",
		W: "W",
		D: "D",
		Y: "Y",
		Q: "Q",
		Y3: "3Y",
		gas: "Gas",
		power: "Power",
		show: "Show Chart",
		January: "January",
		February: "February",
		March: "March",
		April: "April",
		May: "May",
		June: "June",
		July: "July",
		August: "August",
		September: "September",
		October: "October",
		November: "November",
		December: "December",
		All: "All",
		comingsoon: "Coming Soon!",
		login: "login",
		logout: "logout",
		forgotyourpassword: "Forgot your password?",
		prices: "Prices",
		pfc: "PFC",
		loaddata: "Load Data",
		load: "load data",
		signals: "Signals",
		portfolio: "portfolio",
		settings: "settings",
		start: "start",
		marketinfo: "Market Info",
		consumption: "Consumption",
		feedback: "Feedback",
		rateus: "Rate Us",
		contactus: "Contact Us",
		visitwebsite: "Visit Website",
		imprintLegalNotes: "Imprint & Legal Notes",
		imprint: "Imprint",
		termsConditions: "Terms & Conditions",
		privacypolicy: "Privacy Policy",
		We_re_working_hard_to_bring_you_something_amazing:
			"We're working hard to bring you something amazing.",
		language: "Language",
		notifications: "Notifications",
		save: "save",
		cancel: "CANCEL",
		send: "send",
		show_notifications: "Show Notifications",
		how_is_your_experience_with_our_app_so_far:
			"How is your experience with our app so far?",
		what_could_we_improve: "What could we improve?",
		name: "Name",
		phone: "Phone",
		email: "Email",
		message: "Message",
		poor: "Poor",
		Page_Not_Found: "Page Not Found",
		below_average: "Below Average",
		fair: "Fair",
		almost_average: "Almost Average",
		average: "Average",
		above_average: "Above Average",
		good: "Good",
		very_good: "Very Good",
		excellent: "Excellent",
		datetime: "Date / Time",
		Energy_Use: "Energy Use",
		Energy: "Energy",
		Average: "Average",
		Customize_View: "Customize View",
		View_Signal_Settings: "View Signal Settings",
		View_Signal_Chart: "View Signal Chart",
		Load_Data_Details: "Load Data Details",
		Traded_Transaction: "handelsgeschafte",
		View_Deals: "View Deals",
		View_Portfolio: "View Portfolio",
		Please_enter_your_username_and_password:
			"Please enter your username and password.",
		Please_enter_your_username: "Please enter your username.",
		Please_enter_your_password: "Please enter your password.",
		Username_should_not_contain_special_characters:
			"Username should not contain special characters.",
		An_error_occurred_Please_try_again:
			"An error occurred. Please try again.",
		username: "Username",
		password: "Password",
		Enter_your_registered_email_address_to_reset_your_password:
			"Enter your registered email address to reset your password.",
		"Login failed. Please try again.": "Login failed. Please try again.",
		portfolio_overview: "Portfolio Overview",
		Login_failed_Please_check_your_credentials:
			"Login failed.Please check your credentials.",
		Login_failed_Please_try_again: "Login failed. Please try again",
		Please_enter_a_valid_email_address:
			"Please enter a valid email address",
		Both_min_and_max_are_required:
			"Both minimum and maximum values are required. If unsure, enter at least 0.",
		Values_cannot_be_empty:
			"Values cannot be empty. If unsure, enter at least 0.",
		Max_value_must_be_greater_than_min:
			"Maximum value must be greater than minimun.",
		Please_enter_valid_start_and_end_dates:
			"Please enter valid start and end dates.",
		The_end_date_must_be_later_than_start_date:
			"The end date must be later than start date.",
		PFC_Details: "PFC Details",
		Prices_Setting: "Prices Settings",
		Prices_Details: "Prices Details",
		Signals_Details: "Signals Details",
		Low_Soft: "Low Soft",
		Low_Hard: "Low Hard",
		Negative: "Negative",
		High_Soft: "High Soft",
		High_Hard: "High Hard",
		Days: "Days",
		Yes: "Yes",
		No: "No",
		Direction: "Direction",
		Amount: "Amount",
		Price: "Price",
		Trader: "Trader",
		Date: "Date",
		State: "State",
		Period_of_Time: "Period of Time",
		From: "From",
		To: "To",
		Value_Range: "Value Range",
		Cancel: "CANCEL",
		OK: "OK",
		submit: "Submit",
		select: "Select",
		today: "Today",
		message_sent_successfully: "Message sent successfully!",
		thank_you_for_your_feedback: "Thank you for your feedback!",
		Data_not_available: "Data not available",
		Select_Start_Date: "Select Start Date",
		Select_End_Date: "Select End Date",
		Select_Date_Range: "Select Date Range",
		No_Internet_Connection: "No Internet Connection",
		Waiting_for_reconnection: "Waiting for reconnection...",
		logout_title: "Logout",
		logout_message: "Are you sure you want to logout?",
		exit_app: "Exit App",
		exit_msg: "Are you sure you want to exit?",
		//toast message
		Cannot_Open_CSV: "Cannot Open CSV",
		Make_sure_a_CSV_viewer_is_installed:
			"Make sure a CSV viewer is installed.",
		Cannot_Open_File: "Cannot Open File",
		install_a_file_viewer:
			"Install a file viewer app (e.g., Google Files) to open PNGs.",
		Sharing_isnot_available_on_your_platform:
			"Sharing isn't available on your platform",
		Unabled_to_shared: "Unabled to shared",
		Failed_to_Share_PNG: "Failed to Share PNG",
		Ensure_your_device_supports_sharing:
			"Ensure your device supports sharing",
		LoggedIn_Successful: "LoggedIn Successful",
		File_Downloading: "Downloading File",
		Download_Failed: "Download Failed!",
		Open_Settings: "Open Settings",
		Ask_Me_Later: "Ask Me Later",
		Permission_Required: "Permission Required",
		Please_enable_notifications_in_system_settings:
			"Please enable notifications in system settings",
		Permission_Denied: "Permission Denied",
		Media_library_access_required: "Media library access required.",
		Chart_saved: "Chart saved!",
		Tap_to_open: "Tap to open",
		Storage_access_not_granted: "Storage access not granted!",
		File_Saved: "File Saved",
		Save_Failed: "Save Failed",
		An_error_occurred_while_saving: "An error occurred while saving.",
		Please_enable_permission_from_settings:
			"Please enable permission from settings.",
		Open: "Open",
		Share: "Share",
		Update_Available: "Update Available",
		Tap_to_roload_or_restart_the_app: "Tap to roload or restart the app",
		Update_Failed: "Update_Failed",
		Please_try_again_later: "Please try again later.",
		An_unknown_error_occurred_Please_try_again:
			"An unknown error occurred. Please try again.",
		Invalid_response_data_from_API: "Invalid response data from API.",
		Service_is_currently_unavailable_Please_try_again_later:
			"Service is currently unavailable. Please try again later",
		Were_experiencing_technical_issues_Please_try_again_later:
			"We're experiencing technical issues. Please try again later.",
		Your_session_has_expired_Please_log_in_again:
			"Your session has expired. Please log in again.",
		You_dont_have_permission_to_perform_this_action:
			"You don’t have permission to perform this action.",
		The_request_timed_out_Please_try_again:
			"The request timed out. Please try again.",
		Too_many_requests_Please_wait_a_moment_and_try_again:
			"Too many requests. Please wait a moment and try again.",
		Network_error_Please_check_your_internet_connection:
			"Network error. Please check your internet connection.",
		Something_went_wrong: "Something went wrong",
		error_page_not_found:
			"The page you’re looking for doesn’t exist or has been moved.",
		go_to_home: "Go to Home",
		imprints: {
			company: "enexion GmbH",
			address1: "Am Kronberger Hang 2A,",
			address2: "65824 Schwalbach am Taunus",
			phone: "Tel: +49 (0) 61 73 93 59 0",
			fax: "Fax: +49 (0) 61 73 93 59 55",
			mail: "Mail: mailto:info@enexion.de",
			web: "Web: https://www.enexion.de",
			court: "Amtsgericht Königstein TS",
			hrb: "HRB: 7220",
			taxId: "USt-Id.Nr.: DE260459436",
			directors: "Managing Directors: Björn Vortisch / Theo Parpan",
			responsibleContent:
				"Responsible for the content in accordance with § 55 par. 2 RStV: Björn Vortisch / Theo Parpan, Managing directors",
			liability:
				"Liability note: Despite careful checking, we assume no liability for the content of external links. The content of linked pages is the exclusive responsibility of their operators.",
		},
		termsAndConditions: {
			terms: "Terms and Conditions",
			contractPartiesAndObject: "Contract Parties and Object",
			term: "Term",
			scope: "Scope",
			services: "Services to be provided by enexion",
			usersCommitments: "User's Commitments",
			intellectualProperty: "Intellectual Property",
			enexionRights: "enexion Rights",
			termination: "Termination",
			supplementaryAgreements: "Supplementary Agreements",
			applicableLaw: "Applicable Law",
			severabilityClause: "Severability Clause",
			contractPartiesAndObjectDescription1:
				"This Agreement is entered into by and between the Customer ('User') and enexion GmbH, represented by Björn Vortisch / Theo Parpan, with its registered office in Am Kronberger Hang 2A, 65824, Schwalbach am Taunus ('enexion', 'we', 'us', 'our'), Amtsgericht Königstein TS, HRB: 7220, VAT ID: DE260459436, with an aim to determine the conditions for using enexion energy Cockpit® eeC mobile application (‘App’). The User shall be considered to have agreed to the terms and conditions of this Agreement by starting to use the services available on the App.",
			contractPartiesAndObjectDescription2:
				"This User Agreement and all other rules indicated on the App set forth the conditions for the services provided by enexion. All the rules, terms of use, privacy policy and all other regulations available in the App form attachment to and an inseparable part of this Agreement which shall be binding for all Users.",
			termDescription:
				"This User Agreement shall enter into force as the User downloads and starts using the App and remain valid as long as the membership status continues. The Agreement shall remain binding for the User with respect to the obligations which remain even after the termination of the membership due to their nature.",
			scopeDescription:
				"enexion presents a mobile application meant to provide energy management system for the User.",
			servicesDescription:
				"The services provided at the App could be summarized as follows:",
			servicesPoints:
				" • Providing news, \n • Providing current and historical price data,  \n • Calculating and providing current and historical PFC data,  \n • Providing technical analysis indicators & signals, \n • Providing load data, \n • Providing portfolios, \n • Providing Total Energy Cost (TEC) Report.",
			usersCommitmentsDescription:
				"The User represents and warrants that he shall comply with the following terms of use by downloading and using the App and that he shall be personally liable for the direct and indirect losses to be incurred by enexion owing to any breach of the terms of use.",
			usercommitmentPoint1:
				"In that respect, the User:\n1. warrants that the information and data he provides to enexion for subscription purposes are accurate, up-to-date, complete and lawful.",
			usercommitmentPoint2:
				"2. represents and warrants that he gives consent to enexion so that it may keep, process and disclose to third parties, if necessary, the user related information and data they provide to the App so as to ensure the functioning of the App and perform the services undertaken by enexion in line with the provisions of the relevant regulations including the EU General Data Protection Regulation (EU-GDPR).",
			usercommitmentPoint3:
				"3. warrants that he shall not infringe the rights of third persons (including but not limited to copyrights, trademark and/or intellectual and industrial property rights) and/or the provisions of this Agreement or other terms of use presented to him as provided in the App.",
			usercommitmentPoint4:
				"4. warrants that he shall not transfer the User account without receiving written consent from enexion.",
			usercommitmentPoint5:
				"5. warrants that he shall not distribute or spread malware or similar harmful technologies that may be detrimental to enexion or App Users and damage the infrastructure or system of enexion.",
			usercommitmentPoint6:
				"6. warrants that he shall not enter the App through robot or automatic entry methods for any purpose.",
			usercommitmentPoint7:
				"7. warrants that he shall not resell, share, distribute, reproduce or undertake derivative processing works on any component of the App to any intellectual and/or industrial property right (including but not limited to designs, texts, images, software codes and other codes).",
			usercommitmentPoint8:
				"8. The User agrees and warrants that in case of breach of those obligations, enexion shall be entitled to revoke the User’s membership and not readmit it to membership by reserving all its rights to claim for losses and indemnification and that it shall not be entitled to claim any indemnification or losses including but not limited to loss of profit from enexion for that reason.",

			intellectualPropertyDescription:
				"All App content created by enexion including but not limited to the App design, images, visuals and source codes as well as enexion trademark and logo exclusively belong to enexion. The User may not use, share, distribute, display, reproduce and undertake derivative works of the works and their components that are subject to industrial and intellectual property rights of enexion.",
			enexionRightsDescription:
				"enexion may prevent access of third parties to the services available on the App, remove and delete the same at any time based on its own discretion and it may exercise those rights without informing the User in advance or determining any time span for the use of those rights.",
			enexionRight1:
				"1. The User agrees and warrants that enexion shall not be responsible for any judicial or administrative proceedings to be referred to enexion for any service they shall procure or any transaction they shall conduct through the App and that the User shall provide enexion with all the information and documentation required for enabling enexion to defend itself in the best manner possible under any such legal proceeding, investigation or litigation as soon as possible.",
			enexionRight2:
				"2. enexion may prevent access of third parties to the services available on the App, remove and delete the same at any time based on its own discretion and it may exercise those rights without informing the User in advance or determining any time span for the use of those rights. The User shall not be entitled to make claims for any losses or indemnification or acquire any other rights owing to enexion’s use of the rights provided herein.",
			enexionRight3:
				"3. enexion may suspend or, in its own discretion, revoke the membership status of the User that is found to be in breach of the contractual provisions and other rules stated in the App. The User agrees that he shall not be entitled to make claims for any losses or indemnification or acquire any other rights for that reason.",
			terminationDescription1:
				"Each party may terminate this User Agreement and appendices unilaterally at any time. In case of any such termination, the parties shall mutually fulfill the rights and obligations incurred till the termination date. If enexion terminates this Agreement unilaterally, it shall not be obliged to pay any indemnification.",
			terminationDescription2:
				"If the User is found to be in breach of this Agreement, the existing or future appendices to be provided to the User or other rules available in the App, the Agreement and membership status of the User may immediately be terminated unilaterally. In case of any such termination, enexion shall reserve the right to claim for the losses it shall incur due to the breach.Supplementary Agreements",
			supplementaryAgreementsDescription1:
				"1. Any one of the parties shall not be liable to the other party for failure or delay in performing any contractual obligation due to a force majeure condition. Force majeure condition shall refer to any unforeseeable and unpreventable incident that occurs outside the reasonable control of the parties.",
			supplementaryAgreementsDescription2:
				"2. The User may not assign their contractual rights and obligations to third parties.",
			supplementaryAgreementsDescription3:
				"3. enexion shall reserve the right to modify this Agreement at any time. The variations to be introduced will be announced in the App. Any such variation shall become effective as of the date of announcement in the App after the User has agreed to it.",
			supplementaryAgreementsDescription4:
				"4. Failure or delay of enexion in exercising any of the rights arising from this Agreement shall not be construed as a waiver from that right.",
			applicableLawDescription:
				"It exclusively applies the law of the Federal Republic of Germany. The place of jurisdiction is the seat of enexion in disputes with customers who are not legal entities under public law or public law special funds.",
			severabilityClauseDescription:
				"Should individual terms of this Agreement be ineffective or lose their effectiveness due to later circumstances, the legal effectiveness of the remaining provisions is not affected.",
		},
		privacyAndPolicy: {
			privacypolicy: "Privacy Policy",
			effectivedate: "Effective Date: June 1, 2019",
			para1: "enexion GmbH ('we', 'our', 'us') operates the mobile application enexion energy Cockpit® app ('app').",
			para2: "We appreciate your use of the enexion energy Cockpit eeC® app. Protecting your personal information is important to us and we want you to feel secure when using our app.",
			para3: "This Privacy Policy statement informs you about our policies regarding the collection, use and storage of personal data when using our app and your rights regarding the personal data concerning you.",
			para4: "We use your data to provide and use our app. By using this App, you consent to the collection and use of personal information in accordance with this Policy. Unless otherwise specified in this notice, terms used in this Privacy Policy have the same meaning as in our Terms and Conditions.",
			h1: "§ 1 Information about the collection of personal data",
			h1p1: "(1) In the following we inform you about the collection of personal data when using our app.",
			h1p2: "(2) Responsible accordingly to the Art. 4 (7) of the EU General Data Protection Regulation (DSGVO) is:",
			h1s1: "enexion GmbH",
			h1s1p1: "Datenschutzbeauftragter\nAm Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h1s1p2: "",
			h1s1p3: "",
			h1p3: "(3) When you contact us by e-mail or through a contact form, we will store the information you have provided like your e-mail address, your name and your telephone number if necessary to answer your request. The legal basis is Art. 6 (1) (f) of the GDPR. We delete the data that arises in this context after the storage is no longer required, or limit the processing if any statutory retention requirements exist.",
			h2: "§ 2 Your Rights",
			h2p1: "(1) You have the following rights with respect to the personal data concerning you:\n- Right to information according to Art. 15 GDPR,\n-  Right to rectification according to Art. 16 GDPR,\n-  Right to deletion according to Art. 17 of the GDPR,\n-  Right to restriction of data processing according to Art. 18 GDPR,\n- Right to data portability according to Art. 20 DSGVO,\n- Right to object to the processing according to Art. 21 GDPR.",
			h2p2: "(2) Please direct your requests exclusively by the post stating your name, your address and, if available, your customer number and your context of the personal data to the following address:",
			h2s1: "enexion GmbH",
			h2s1p1: "Datenschutz\n Am Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h1s1d: "In the absence of such information, it is not possible to authenticate you and thus we do not guarantee a claim of your rights under the GDPR",
			h2p3: "(3) You also have the right to complain to us about the processing of your personal data by a data protection supervisory authority. A list of the regulatory authorities can be found at https://www.bfdi.bund.de/DE/Infothek/ Anschriften_Links/anschriften_links-node.html.",
			h2p4: "(4) If you have given us your consent, you can revoke it at any time with effect for the future.",
			h3: "§ 3 Collection of personal data when using our app",
			h3p1: "(1) When using our app, we may ask you to provide us with certain personal information that we may use to contact you or identify you ('Personal data'). Personal data is defined as any information which refers to you personally. Personal data may include:",
			h3p1p: "• First name and name\n• Address\n• Email address\n• User behavior",
			h3p2: "(2) We may also collect information that your browser sends when you use our app or when you access our app from a mobile device ('Usage data'). Usage data may include:",
			h3p2p: "• Type of mobile device used\n• Your mobile operating system\n• Internal device memory\n• ID of your mobile device\n• IP address of your mobile device",
			h4: "§ 4 Use of personal data",
			h4p1: "(1) We process your personal data in particular for the following purposes:\n• Provision and maintenance of our app\n• Providing customer service\n• Providing analysis, so we can improve the app\n• Enabling participation in interactive app features\n• Detection and elimination of technical problems\n• For further administrative purposes\nWe will not use your data to draw conclusions on your person. The processing is carried out in accordance with Art. 6 Para. 1 lit. a, b or c DSGVO.",
			h5: "§ 5 Storage of personal data",
			h5d: "In the case of an existing contractual relationship, we are subject to the legal retention periods according to the German Commercial Code (HGB). Personal data is stored as long as the corresponding consent is available to us and deleted after expiry of the specified deadlines.",
			h6: "§ 6 Transfer of personal data to third parties",
			h6p1: "We may use third-party companies and individuals ('service providers') to run app-related services or to assist us in analyzing the use of our app.",
			h6p2: "These third parties only have access to your personal information in order to perform these tasks on our behalf and are under an obligation not to use them for any other purpose.",
			h7: "§ 7 Contradiction or revocation of your data processing",
			h7p1: "(1) If you have given consent to the processing of your personal data, you can revoke this at any time. Such revocation will affect the admissibility of the processing of your personal data after you have given it to us.",
			h7p2: "(2) If we base the processing of your personal data on the balance of interests, you may object to the processing. This is the case if, in particular, the processing is not required to fulfill a contract with you. In the event of such a contradiction, we ask you to explain the reasons why we should not process your personal data as performed by us. In the case of your justified objection, we will examine the situation and will either discontinue or adapt the data processing or point out to you our compelling legitimate reasons on which we will continue the processing.",
			h7p3: "(3) Of course, you may object to the processing of your personal data for advertising and data analysis purposes at any time. You can inform us about your objection by post to:",
			h7s1: "enexion GmbH",
			h7s1d1: "Datenschutz\nAm Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h7s1d2: "Please address your objection exclusively via the postal route stating your name, your address and, if available, your customer number.",
			h8: "§ 8 Changes to this Privacy Policy",
			h8d1: "We reserve the right to update our privacy policy regularly. We will notify you by posting a new privacy policy in our app and on our website and pointing it out. Accordingly, we will adjust the effective date at the beginning of our Privacy Policy.",
			h8d2: "Changes to this privacy policy take effect as soon as they are published on our website and in our app.",
		},
	},
	de: {
		unit: "kWh",
		tooltip: "Tooltip",
		xaxisUnit: "Datum / Uhrzeit",
		Month: "Monat",
		Week: "Woche",
		Day: "Tag",
		Year: "Jahr",
		Year_3: "3 Jahr",
		Quarter: "Quartal",
		M: "M",
		W: "W",
		D: "T",
		Y: "J",
		Q: "Q",
		Y3: "3J",
		gas: "Gas",
		power: "Strom",
		show: "Chart Anzeigen",
		January: "Januar",
		February: "Februar",
		March: "Marsch",
		April: "April",
		May: "Mai",
		June: "Juni",
		July: "Juli",
		August: "August",
		September: "September",
		October: "Oktober",
		November: "November",
		December: "Dezember",
		All: "Alle",
		comingsoon: "Bald erhältlich!",
		login: "anmelden",
		logout: "Abmelden",
		forgotyourpassword: "Passwort vergessen?",
		prices: "Preise",
		pfc: "PFC",
		loaddata: "Lastdaten",
		load: "lastdaten",
		signals: "Signale",
		portfolio: "portfolio",
		settings: "Einstellungen",
		start: "start",
		marketinfo: "Marktdaten",
		consumption: "Verbrauchdaten",
		feedback: "Feedback",
		rateus: "Bewerten Sie Uns",
		contactus: "Kontaktieren Sie Uns",
		visitwebsite: "Unsere Website",
		imprintLegalNotes: "Impressum und rechtliches",
		imprint: "Impressum",
		termsConditions: "AGB",
		privacypolicy: "Datenschutzerklarung",
		We_re_working_hard_to_bring_you_something_amazing:
			"Wir arbeiten hart daran, Ihnen etwas Erstaunliches zu bieten.",
		language: "Sprache",
		notifications: "mitteilungen",
		save: "SPEICHERN",
		cancel: "Abbrechen",
		send: "Schicken",
		show_notifications: "mitteilungen anzeigen",
		how_is_your_experience_with_our_app_so_far:
			"Wie Wurden Sie lhre bisheringe Erfahrung mit unserer App bewerten?",
		what_could_we_improve: "Was konnten wir verbessern?",
		name: "Name",
		phone: "Telefon",
		email: "E-Mail",
		message: "Ihre Nachricht",
		poor: "Schlecht",
		Page_Not_Found: "Seite nicht gefunden",
		below_average: "Unterdurchschnittlich",
		fair: "Fair",
		almost_average: "Beinahe Durchschnittlich",
		average: "Durchschnittlich",
		above_average: "Überdurchschnittlich",
		good: "Gut",
		very_good: "Sehr Gut",
		excellent: "Ausgezeichnet",
		datetime: "Datum / Uhrzeit",
		Energy_Use: "Energie gebruik",
		Energy: "Energie",
		Average: "Durchschnitt",
		Customize_View: "Ansicht anpassen",
		View_Signal_Settings: "Signaleinstellungen anzeigen",
		View_Signal_Chart: "Signaldiagramm anzeigen",
		Load_Data_Details: "Details Lastdaten",
		Traded_Transaction: "Traded Transaction",
		View_Deals: "Deals Anzeigen",
		View_Portfolio: "Portfolio anzeigen",
		PFC_Details: " Details PFC",
		Prices_Setting: " Preise Einstellungen",
		Prices_Details: "Details Preise",
		Signals_Details: "Details Signal",
		Please_enter_your_username_and_password:
			"Bitte geben Sie Ihren Benutzernamen und Ihr Passwort ein.",
		Please_enter_your_username: "Bitte geben Sie Ihren Benutzernamen ein.",
		Please_enter_your_password: "Bitte geben Sie Ihr Passwort ein.",
		Username_should_not_contain_special_characters:
			"Der Benutzername sollte keine Sonderzeichen enthalten.",
		An_error_occurred_Please_try_again:
			"Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
		username: "Benutzername",
		password: "Passwort",
		Enter_your_registered_email_address_to_reset_your_password:
			"Geben Sie Ihre registrierte E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.",
		"Login failed. Please try again.":
			"Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
		Login_failed_Please_try_again:
			"Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
		portfolio_overview: "Portfolio Übersicht",
		Login_failed_Please_check_your_credentials:
			"Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldeinformationen.",
		Please_enter_a_valid_email_address:
			"Bitte geben Sie eine gültige E-Mail-Adresse ein",
		Both_min_and_max_are_required:
			"Sowohl Mindest- als auch Höchstwert sind erforderlich. Geben Sie mindestens 0 ein, wenn Sie unsicher sind.",
		values_cannot_be_empty:
			"Werte dürfen nicht leer sein. Geben Sie mindestens 0 ein, wenn Sie unsicher sind.",
		Max_value_must_be_greater_than_min:
			"Der Höchstwert muss größer als der Mindestwert sein.",
		Please_enter_valid_start_and_end_dates:
			"Bitte geben Sie gültige Start- und Enddaten ein.",
		The_end_date_must_be_later_than_start_date:
			"Das Enddatum muss nach dem Startdatum liegen.",
		Low_Soft: "Tief Weich",
		Low_Hard: "Tief Hart",
		Negative: "Negieren",
		High_Soft: "Hoch Weich",
		High_Hard: "Hoch Hart",
		Days: "Tage",
		Yes: "Ja",
		No: "Nein",
		Direction: "Kauf/Verkauf",
		Amount: "Menge",
		Price: "Preis",
		Trader: "Handler",
		Date: "Datum",
		State: "Status",
		Period_of_Time: "Zeitraum",
		From: "Von",
		To: "Bis",
		Value_Range: "Wertebereich",
		Cancel: "ABBRECHEN",
		OK: "OK",
		submit: "Senden",
		select: "wählen",
		today: "Heute",
		message_sent_successfully: "Nachricht erfolgreich gesendet!",
		thank_you_for_your_feedback: "Vielen Dank für Ihr Feedback!",
		Data_not_available: "Daten nicht verfugbar",
		Select_Start_Date: "Wählen Sie Startdatum",
		Select_End_Date: "Wählen Sie Enddatum aus",
		Select_Date_Range: "Wählen Sie Datumsbereich aus",
		No_Internet_Connection: "Keine Internetverbindung",
		Waiting_for_reconnection: "Warten auf erneute Verbindung...",
		logout_title: "Abmelden",
		logout_message: "Möchten Sie sich wirklich abmelden?",
		exit_app: "App beenden",
		exit_msg: "Möchten Sie wirklich beenden?",
		//toast messages
		Cannot_Open_CSV: "CSV kann nicht geöffnet werden",
		Make_sure_a_CSV_viewer_is_installed:
			"Stellen Sie sicher, dass ein CSV-Viewer installiert ist.",
		Cannot_Open_File: "Datei kann nicht geöffnet werden",
		install_a_file_viewer:
			"Installieren Sie eine Dateianzeige-App (z. B. Google Files), um PNGs zu öffnen.",
		Sharing_isnot_available_on_your_platform:
			"Teilen ist auf Ihrer Plattform nicht verfügbar",
		Unabled_to_shared: "Kann nicht geteilt werden",
		Failed_to_Share_PNG: "PNG konnte nicht freigegeben werden",
		Ensure_your_device_supports_sharing:
			"Stellen Sie sicher, dass Ihr Gerät die Freigabe unterstützt",
		LoggedIn_Successful: "Eingeloggt erfolgreich",
		File_Downloading: "Datei wird heruntergeladen",
		Download_Failed: "Download fehlgeschlagen!",
		Open_Settings: "Einstellungen öffnen",
		Ask_Me_Later: "Frag mich später",
		Permission_Required: "Berechtigung erforderlich",
		Please_enable_notifications_in_system_settings:
			"Bitte aktivieren Sie Benachrichtigungen in den Systemeinstellungen",
		Permission_Denied: "Zugriff verweigert",
		Media_library_access_required:
			"Zugriff auf die Mediathek erforderlich.",
		Chart_saved: "Diagramm gespeichert!",
		Tap_to_open: "Zum Öffnen tippen",
		Storage_access_not_granted: "Speicherzugriff nicht gewährt!",
		File_Saved: "Datei gespeichert",
		Save_Failed: "Speichern fehlgeschlagen",
		An_error_occurred_while_saving:
			"Beim Speichern ist ein Fehler aufgetreten.",
		Please_enable_permission_from_settings:
			"Bitte aktivieren Sie die Berechtigung in den Einstellungen.",
		Open: "offen",
		Share: "Aktie",
		Update_Available: "Update verfügbar",
		Tap_to_roload_or_restart_the_app:
			"Tippen, um die App neu zu laden oder neu zu starten",
		Update_Failed: "Update_Failed",
		Please_try_again_later: "Bitte versuchen Sie es später erneut.",
		An_unknown_error_occurred_Please_try_again:
			"Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
		Invalid_response_data_from_API: "Ungültige Antwortdaten von der API.",
		Service_is_currently_unavailable_Please_try_again_later:
			"Der Dienst ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
		Were_experiencing_technical_issues_Please_try_again_later:
			"Wir haben technische Probleme. Bitte versuchen Sie es später noch einmal.",
		Your_session_has_expired_Please_log_in_again:
			"Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
		You_dont_have_permission_to_perform_this_action:
			"Sie haben keine Berechtigung, diese Aktion auszuführen.",
		The_request_timed_out_Please_try_again:
			"Die Anfrage ist abgelaufen. Bitte versuchen Sie es erneut.",
		Too_many_requests_Please_wait_a_moment_and_try_again:
			"Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
		Network_error_Please_check_your_internet_connection:
			"Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.",
		Something_went_wrong: "Etwas ist schiefgelaufen",
		error_page_not_found:
			"Die gesuchte Seite existiert nicht oder wurde verschoben.",
		go_to_home: "Zur Startseite",
		imprints: {
			company: "enexion GmbH",
			address1: "Am Kronberger Hang 2A, ",
			address2: "65824 Schwalbach am Taunus",
			phone: "Tel: +49 (0) 61 73 93 59 0",
			fax: "Fax: +49 (0) 61 73 93 59 55",
			mail: "Mail: mailto:info@enexion.de",
			web: "Web: https://www.enexion.de",
			court: "Amtsgericht Königstein TS",
			hrb: "HRB: 7220",
			taxId: "USt-Id.Nr.: DE260459436",
			directors: "Geschäftsführer: Björn Vortisch / Theo Parpan",
			responsibleContent:
				"Inhaltlich Verantwortliche gemäß § 55 Abs. 2 RStV: Björn Vortisch / Theo Parpan, Geschäftsführer",
			liability:
				"Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle kann keine Haftung für die Inhalte externer Links übernommen werden. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
		},
		termsAndConditions: {
			terms: "Allgemeine Geschäftsbedingungen (AGB)",
			contractPartiesAndObject: "Vertragsparteien und Vertragsgegenstand",
			term: "Vertragslaufzeit",
			scope: "Anwendungsbereich",
			services: "Leistungsumfang",
			usersCommitments: "Verpflichtungen des Nutzers",
			intellectualProperty: "Geistiges Eigentum",
			enexionRights: "Rechte von enexion",
			termination: "Kündigung",
			supplementaryAgreements: "Zusatzvereinbarungen",
			applicableLaw: "Anwendbares Recht",
			severabilityClause: "Salvatorische Klausel",
			contractPartiesAndObjectDescription1:
				"Dieser Vertrag wird geschlossen zwischen dem Kunden (nachfolgend “Nutzer”) und der enexion GmbH, vertreten durch Björn Vortisch / Theo Parpan, mit Sitz in Am Kronberger Hang 2A, 65824, Schwalbach am Taunus, (nachfolgend “enexion”), Amtsgericht Königstein TS, HRB: 7220, VAT ID: DE260459436, mit dem Ziel, die Bedingungen für die Nutzung von enexion energy Cockpit® eeC mobile application (nachfolgend 'App') festzulegen. Der Nutzer stimmt den Bedingungen dieser Vereinbarung zu, sobald er die in der App verfügbaren Dienste zu nutzen beginnt.",
			contractPartiesAndObjectDescription2:
				"Dieser Vertrag und alle anderen in der App angegebenen Vereinbarungen legen die Bedingungen für die von enexion bereitgestellten Dienste fest. Alle Regeln, Nutzungsbedingungen, Datenschutzerklärung und alle anderen in der App verfügbaren Bestimmungen sind Anhang und ein untrennbarer Bestandteil dieses Vertrags, der für den Nutzer verbindlich ist.",
			termDescription:
				"Diese Vereinbarung tritt in Kraft, sobald der Nutzer die App herunterlädt und startet und bleibt solange bestehen, wie der Mitgliedschaftsstatus fortbesteht. Der Vertrag bleibt für den Nutzer bindend in Bezug auf seine Verpflichtungen, die aufgrund deren Art auch nach Beendigung seiner Mitgliedschaft fortbestehen.",
			scopeDescription:
				"enexion stellt eine mobile Anwendung zur Verfügung mit dem Ziel, dem Nutzer ein Energiemanagementsystem anzubieten.",
			servicesDescription:
				"Die in der App angebotenen Dienste können wie folgt zusammengefasst werden:",
			servicesPoints:
				"• Bereitstellung von Nachrichten \n • Bereitstellung aktueller und historischer Preisdaten \n • • Berechnung und Bereitstellung aktueller und historischer PFC-Daten  \n • Bereitstellung von technischen Indikatoren und Signalen \n • Bereitstellung von Lastdaten \n • Bereitstellung von Portfolien \n• Bereitstellung von Total Energy Cost (TEC) Report",
			usersCommitmentsDescription:
				"Der Nutzer erklärt hiermit und hat zu gewährleisten, dass er die folgenden Nutzungsbedingungen einhält, indem er die App herunterlädt und verwendet, und dass er persönlich für die direkten und indirekten Verluste haftbar ist, die enexion aufgrund eines Verstoßes gegen diese Nutzungsbedingungen entstehen.",
			usercommitmentPoint1:
				"In dieser Hinsicht ist der Nutzer verpflichtet, Folgendes einzuhalten:\n1. der Nutzer gewährleistet, dass die Informationen und Daten, die er zur Anmeldung zur Verfügung stellt, korrekt, aktuell, vollständig und rechtmäßig sind.",
			usercommitmentPoint2:
				"2. der Nutzer stimmt zu, dass enexion die nötigen Informationen und Daten, die der Nutzer der App zur Verfügung stellt, aufbewahren, verarbeiten und an Dritte weitergeben kann, um das Funktionieren der App sicherzustellen und die von enexion durchgeführten Dienstleistungen in Übereinstimmung mit den Bestimmungen der einschlägigen Verordnungen einschließlich der EU-Datenschutz-Grundverordnung (EU-DSGVO) zu erbringen.",
			usercommitmentPoint3:
				"3. der Nutzer garantiert, dass er die Rechte Dritter (einschließlich, aber nicht beschränkt auf Urheberrechte, Marken und / oder Rechte an geistigem und gewerblichem Eigentum) und / oder die Bestimmungen dieser Vereinbarung oder andere Nutzungsbedingungen, die dem Nutzer in der App zur Verfügung gestellt werden, nicht verletzen wird.",
			usercommitmentPoint4:
				"4. der Nutzer garantiert, dass er sein Benutzerkonto nicht ohne schriftliche Zustimmung von enexion an Dritte übertragen wird.",
			usercommitmentPoint5:
				"5. der Nutzer garantiert, dass er keine Software und / oder andere Technologien verbreiten wird, die für enexion und / oder andere App-Nutzer schädlich sind und die Infrastruktur oder das System der enexion schädigen könnten.",
			usercommitmentPoint6:
				"6. der Nutzer garantiert, dass er die App nicht mithilfe von automatischen Eingabemethoden oder anderen technischen Mitteln zu irgendeinem Zweck starten oder analysieren wird.",
			usercommitmentPoint7:
				"7. der Nutzer garantiert, dass er keine Rechte an geistigem und / oder gewerblichem Eigentum an der App (einschließlich, aber nicht beschränkt auf Designs, Texte, Bilder, Softwarecodes und andere) weiterveräußern, teilen, reproduzieren oder verändern wird.",
			usercommitmentPoint8:
				"8. der Nutzer stimmt zu, dass im Falle der Verletzung einer dieser Verpflichtungen enexion dazu berechtigt ist, die Mitgliedschaft des Nutzers zu widerrufen und den Nutzer nicht wieder in die Mitgliedschaft aufzunehmen, unter Vorbehalt aller seinen Ansprüchen auf Verluste sowie Entschädigungen und dass der Nutzer keine Ansprüche geltend machen kann hinsichtlich einer Entschädigung oder Verluste, die dem Nutzer dadurch entstehen könnten.",

			intellectualPropertyDescription:
				"Alle von enexion erstellten App-Inhalte, einschließlich, aber nicht beschränkt auf das App-Design, die Bilder, Grafiken und Quellcodes sowie Markenzeichen und Logos, gehören ausschließlich enexion. Der Nutzer darf weder Werke noch Teile dessen, die gewerblichen und geistigen Eigentumsrechten von enexion unterliegen, verwenden, teilen, verteilen, ausstellen, reproduzieren oder davon abgeleitete Handlungen ausführen.",
			enexionRightsDescription: "",
			enexionRight1:
				"1. Der Nutzer stimmt zu und garantiert, dass enexion nicht für Gerichts- oder Verwaltungsverfahren verantwortlich ist und angeklagt werden kann, die für die Erbringung von Dienstleistungen oder für die Transaktionen, die der Nutzer über die App durchführt, notwendig sind. Der Nutzer erklärt sich damit einverstanden, dass er alle Informationen und Unterlagen zur Verfügung stellen wird, die erforderlich sind, damit enexion sich so schnell wie möglich in der bestmöglichen Weise im Rahmen eines solchen Gerichtsverfahrens, einer Untersuchung oder eines Rechtsstreits verteidigen kann.",
			enexionRight2:
				"2. enexion kann den Zugriff Dritter auf die in der App verfügbaren Dienste verhindern, sie jederzeit nach eigenem Ermessen entfernen und löschen und diese Rechte ausüben, ohne die Benutzer im Voraus zu informieren oder eine Zeitspanne für die Nutzung dieser Rechte festzulegen. Der Nutzer ist nicht berechtigt, wegen der Ausübung der hier genannten Rechte durch enexion irgendwelche Verluste oder Entschädigungsansprüche geltend zu machen oder sonstige Rechte zu erwerben.",
			enexionRight3:
				"3. enexion kann den Mitgliedsstatus von dem Nutzer, der gegen die vertraglichen Bestimmungen oder andere in der App genannten Regeln verstoßt, sperren oder nach eigenem Ermessen widerrufen. Der Nutzer ist damit einverstanden, dass er aus diesem Grund keine Ansprüche auf Verluste oder Entschädigungen geltend machen oder sonstige Rechte erwerben kann.",
			terminationDescription1:
				"Jede Partei kann diese Nutzungsvereinbarung und ihre Anhänge jederzeit einseitig kündigen. Im Falle einer solchen Kündigung erfüllen die Parteien gegenseitig die Rechte und Pflichten, die bis zum Kündigungstermin entstanden sind. Wenn enexion diese Vereinbarung einseitig beendet, ist enexion nicht dazu verpflichtet, eine Entschädigung zu leisten.",
			terminationDescription2:
				"Falls festgestellt wird, dass ein Nutzer gegen diese Vereinbarung oder gegen die bestehenden oder zukünftigen Ergänzungen oder andere in dieser App verfügbaren Bedingungen, die dem Nutzer zur Verfügung gestellt werden, verstößt, kann der Mitgliedsstatus des Nutzers sofort einseitig durch enexion gekündigt werden. Im Falle einer solchen Kündigung behält sich enexion das Recht vor, die Verluste geltend zu machen, die aufgrund solch eines Verstoßes entstehen.",
			supplementaryAgreementsDescription1:
				"1. Jede der Parteien haftet gegenüber der anderen Partei nicht für die Nichterfüllung oder Verzögerungen bei der Erfüllung der vertraglichen Verpflichtungen aufgrund höherer Gewalt. Als höhere Gewalt gelten alle unvorhersehbaren und nicht abwendbaren Vorfälle, die außerhalb der angemessenen Kontrolle der Vertragspartnern liegen. Als höhere Gewalt gelten unter anderem Krieg, Aufruhr, Unruhen, Ein-/Ausfuhrbeschränkungen, behördliche Maßnahmen, Embargos, unverschuldete Betriebsstörungen, Streik, negative Beeinflussungen der Internetgeschwindigkeit durch Störungen innerhalb der digitalen Netzwerktechnologie, Naturkatastrophen wie Sturm, Feuer, Erdbeben und weitere, sowie Unfall, Sabotage, Explosion, Terroranschläge und ähnliche Ereignisse.",
			supplementaryAgreementsDescription2:
				"2. Der Nutzer darf seine vertraglichen Rechte und Pflichten nicht an Dritte übertragen.",
			supplementaryAgreementsDescription3:
				"3. enexion behält sich das Recht vor, diese Vereinbarung jederzeit zu ändern. Die einzuführenden Varianten werden in der App bekannt gegeben. Eine solche Änderung wird nach der Zustimmung des Nutzers ab dem Datum der Bekanntmachung in der App wirksam.",
			supplementaryAgreementsDescription4:
				"4. Die Nichteinhaltung oder Verspätung bei der Ausübung eines der Rechte aus diesem Vertrag ist nicht als Verzicht auf dieses Recht auszulegen.",
			applicableLawDescription:
				"Es gilt ausschließlich das Recht der Bundesrepublik Deutschland. Der Gerichtsstand ist bei Streitigkeiten mit dem Nutzer, der keine juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen sind, der Sitz der enexion.",
			severabilityClauseDescription:
				"Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder ihre Wirksamkeit verlieren, so bleibt dadurch die Rechtswirksamkeit der übrigen Bestimmungen unberührt.",
		},
		privacyAndPolicy: {
			privacypolicy: "Datenschutzerklärung",
			effectivedate: "Datum des Inkrafttretens: 1. Juni 2019",
			para1: "enexion GmbH ('wir', 'uns', 'unser' oder 'unsere') betreibt die mobile Anwendung enexion energy Cockpit® App ('App').",
			para2: "Wir freuen uns über Ihre Nutzung der enexion energy Cockpit eeC® App. Der Schutz Ihrer personenbezogenen Daten ist uns wichtig und wir wollen, dass Sie sich bei der Nutzung unserer App sicher fühlen.",
			para3: "Diese Datenschutzerklärung informiert Sie über unsere Richtlinien bezüglich der Erfassung, Verwendung und Speicherung von personenbezogenen Daten bei der Nutzung unserer App und Ihren Rechten hinsichtlich der Sie betreffenden personenbezogenen Daten.",
			para4: "Wir verwenden Ihre Daten zur Bereitstellung und Verwendung unserer App. Durch die Nutzung der App erklären Sie sich mit der Erfassung und Nutzung von personenbezogenen Daten gemäß dieser Richtlinie einverstanden. Sofern in dieser Datenschutzerklärung nicht anders festgelegt, haben die in dieser Datenschutzrichtlinie verwendeten Begriffe die gleiche Bedeutung wie in unseren Nutzungsbedingungen / Allgemeinen Geschäftsbedingungen (AGB).",
			h1: "§ 1 Information über die Erhebung personenbezogener Daten",
			h1p1: "(1) Im Folgenden informieren wir Sie über die Erhebung personenbezogener Daten bei der Nutzung unserer App.",
			h1p2: "(2) Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung (DSGVO) ist:",
			h1s1: "enexion GmbH",
			h1s1p1: "Am Kronberger Hang 2A\n65824 Schwalbach am Taunus\nTel: +49 (0) 61 73 93 59 0\nFax: +49 (0) 61 73 93 59 55\nMail: mailto:info@enexion.de",
			h1s1p2: "Unseren Datenschutzbeauftragten erreichen Sie unter mailto:datenschutz@enexion.de oder postalisch über",
			h1s1p3: "Datenschutzbeauftragter\nAm Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h1p3: "(3) Bei Ihrer Kontaktaufnahme mit uns per E-Mail oder über ein Kontaktformular werden die von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) von uns gespeichert, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 f DS-GVO. Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.",
			h2: "§ 2 Ihre Rechte",
			h2p1: "(1) Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:\n-  Recht auf Auskunft gemäß Art. 15 DSGVO,\n-  Recht auf Berichtigung gemäß Art. 16 DSGVO,\n-  Recht auf Löschung gemäß Artikel Art. 17 DSGVO,\n-  Recht auf Einschränkung der Datenverarbeitung gemäß Art. 18 DSGVO,\n-  Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO,\n-  Recht auf Widerspruch gegen die Verarbeitung gemäß Art. 21 DSGVO.",
			h2p2: "(2) Ihre Anfragen richten Sie bitte ausschließlich über den postalischen Weg unter Angabe Ihres Namens, Ihrer Adresse und falls vorhanden, Ihrer Kundennummer und Ihres Kontextes der personenbezogenen Daten an folgende Adresse:",
			h2s1: "enexion GmbH",
			h2s1p1: "Datenschutz\n Am Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h1s1d: "Sollten diese Angaben fehlen, so können wir Sie nicht authentifizieren und einen Anspruch Ihrer Rechte nach der DSGVO nicht gewährleisten.",
			h2p3: "(3) Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Eine Liste der Aufichtsbehörden finden Sie unter https://www.bfdi.bund.de/DE/Infothek/ Anschriften_Links/anschriften_links-node.html.",
			h2p4: "(4) Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.",
			h3: "§ 3 Erhebung personenbezogener Daten bei der Nutzung unserer App",
			h3p1: "(1) Bei der Nutzung unserer App bitten wir Sie möglicherweise, uns bestimmte personenbezogene Daten zur Verfügung zu stellen, die von uns genutzt werden können, um Sie zu kontaktieren oder zu identifizieren ('personenbezogene Daten'). Personenbezogene Daten sind alle Daten, die auf Sie persönlich beziehbar sind. Personenbezogene Daten können unter anderem sein:",
			h3p1p: "• Vorname und Name\n• Adresse\n• E-Mail-Adressen\n• Nutzerverhalten",
			h3p2: "(2) Wir erfassen möglicherweise auch Informationen, die Ihr Browser sendet, wenn Sie unsere App verwenden oder wenn Sie über ein Mobilgerät auf unsere App zugreifen ('Nutzungsdaten'). Nutzungsdaten können unter anderem sein:",
			h3p2p: "• Typ des verwendeten mobilen Geräts\n• Ihr mobiles Betriebssystem\n• Interner Gerätespeicher\n• ID Ihres mobilen Geräts\n• IP-Adresse Ihres mobilen Geräts",
			h4: "§ 4 Nutzung personenbezogener Daten",
			h4p1: "(1) Wir verarbeiten Ihre personenbezogene Daten insbesondere zu folgenden Zwecken:\n• Bereitstellung und Wartung unserer App\n• Bereitstellung von Kundenbetreuung\n• Bereitstellung von Analysen, damit wir die App verbessern können\n• Ermöglichung einer Teilnahme an interaktiven App Funktionen\n• Erkennung und Behebung technischer Probleme\n• Zu weiteren administrativen Zwecken\nWir verwenden Ihre Daten nicht, um Rückschlüsse auf Ihre Person zu ziehen. Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. a, b oder c DSGVO.",
			h5: "§ 5 Speicherdauer personenbezogener Daten",
			h5d: "Bei einem bestehenden Vertragsverhältnis unterliegen wir den gesetzlichen Aufbewahrungsfristen nach HGB. Personenbezogene Daten werden gespeichert solangedie entsprechende Einwilligung uns vorliegt und nach Ablauf der vorgegebenen Fristen gelöscht.",
			h6: "§ 6 Übermittlung personenbezogener Daten an Dritte",
			h6p1: "Wir könnten Drittunternehmen und Einzelpersonen ('Dienstanbieter') einsetzen, um App-bezogene Dienste auszuführen oder um uns bei der Analyse der Nutzung unserer App zu unterstützen.",
			h6p2: "Diese Dritten haben nur Zugang zu Ihren personenbezogenen Daten, um diese Aufgaben in unserem Auftrag auszuführen, und sind verpflichtet, sie nicht für andere Zwecke zu verwenden.",
			h7: "§ 7 Widerspruch oder Widerruf gegen die Verarbeitung Ihrer Daten",
			h7p1: "(1) Falls Sie eine Einwilligung zur Verarbeitung Ihrer personenbezogenen Daten erteilt haben, können Sie diese jederzeit widerrufen. Ein solcher Widerruf beeinflusst die Zulässigkeit der Verarbeitung Ihrer personenbezogenen Daten, nachdem Sie ihn gegenüber uns ausgesprochen haben",
			h7p2: "(2) Soweit wir die Verarbeitung Ihrer personenbezogenen Daten auf die Interessenabwägung stützen, können Sie Widerspruch gegen die Verarbeitung einlegen. Dies ist der Fall, wenn die Verarbeitung insbesondere nicht zur Erfüllung eines Vertrags mit Ihnen erforderlich ist. Bei Ausübung eines solchen Widerspruchs bitten wir um Darlegung der Gründe, weshalb wir Ihre personenbezogenen Daten nicht wie von uns durchgeführt verarbeiten sollten. Im Falle Ihres begründeten Widerspruchs prüfen wir die Sachlage und werden entweder die Datenverarbeitung einstellen bzw. anpassen oder Ihnen unsere zwingenden schutzwürdigen Gründe aufzeigen, aufgrund derer wir die Verarbeitung fortführen.",
			h7p3: "(3) Selbstverständlich können Sie der Verarbeitung Ihrer personenbezogenen Daten für Zwecke der Werbung und Datenanalyse jederzeit widersprechen. Über Ihren Widerspruch können Sie uns unter folgenden Kontaktdaten informieren:",
			h7s1: "enexion GmbH",
			h7s1d1: "Datenschutz\nAm Kronberger Hang 2A\n65824 Schwalbach am Taunus",
			h7s1d2: "Adressieren Sie Ihren Widerspruch bitte ausschließlich über den postalischen Weg unter Angabe Ihres Namens, Ihrer Adresse und falls vorhanden, Ihrer Kundennummer.",
			h8: "§ 8 Änderungen dieser Datenschutzerklärung",
			h8d1: "Wir behalten uns vor, unsere Datenschutzerklärung regelmäßig zu aktualisieren. Wir werden Sie informieren, indem wir eine neue Datenschutzerklärung in unserer App sowie auf unserer Website veröffentlichen und Sie darauf hinweisen. Entsprechend werden wir das Datum des des Inkrafttretens am Anfang unserer Datenschutzerklärung anpassen.",
			h8d2: "Änderungen an dieser Datenschutzerklärung werden wirksam, sobald sie auf unserer Webseite und in unserer App veröffentlicht werden.",
		},
	},
};
