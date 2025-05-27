//global variables
let bottomInset = 40;
let locale = "en";

//setters
export const setBottomInset = (val: number) => {
	bottomInset = val;
};
export const setLocalebyhook = (val: string) => {
	locale = val;
};

//getters
export const getBottomInset = () => bottomInset;
export const getLocale = () => locale;
