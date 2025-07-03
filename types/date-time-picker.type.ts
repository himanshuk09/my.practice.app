/**
 * Picker Model For Date Time
 */

import { ScreenName } from "./chart.type";
import { DateType, ModeType } from "react-native-ui-datepicker";

export type initialDatePickerViewProps = "day" | "month" | "year" | "time";

export type DateTimeRange = {
	startDate?: DateType | string;
	endDate?: DateType | string;
};

export interface PickerModelProps {
	screenName?: ScreenName;
	maxMinValues?: any;
	setMaxMinValues?: any;
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	handleRangeDataFilter?: any;
	range?: DateTimeRange;
	setRange: (range: DateTimeRange | any) => void;
}

export type DateTimePickerComponentsProps = {
	title?: string;
	timePicker?: boolean;
	pickerMode?: ModeType;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	setSingleDate?: React.Dispatch<React.SetStateAction<DateType>>;
	defaultDate?: DateType;
	initialView?: initialDatePickerViewProps;
	range?: DateTimeRange;
	setRange?: (range: DateTimeRange) => void;
};
