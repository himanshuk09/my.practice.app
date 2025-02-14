import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { i18n } from "@/localization/localConfig";
import { st } from "@/utils/Styles";

interface TabToggleButtonsProps {
	activeTab: string;
	setActiveTab: any;
	visibleTabs: any;
	setLoading?: any;
}

const TabToggleButtons: React.FC<TabToggleButtonsProps> = React.memo(
	({ activeTab, setActiveTab, visibleTabs, setLoading }) => {
		const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
		const tabs = visibleTabs || allTabs;
		return (
			<View className="flex-row justify-between  w-full">
				{tabs.map((tab: any) => (
					<TouchableOpacity
						key={tab}
						onPress={() => {
							setActiveTab(tab);
							setLoading(true);
							setTimeout(() => {
								setLoading(false);
							}, 5000);
						}}
						className={`flex-1 py-3 text-center rounded-sm h-14 ${
							activeTab === tab
								? "border-b-4 border-primary bg-white "
								: "bg-gray-100  "
						}`}
						style={st.tabShadow}
					>
						<Text
							className={`text-lg text-center font-semibold ${
								activeTab === tab
									? "text-primary"
									: "text-[#898a8c]"
							}`}
						>
							{i18n.t(tab)}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	}
);

export default TabToggleButtons;
