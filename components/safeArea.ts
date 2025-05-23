// components/safeArea.ts
let bottomInset = 40;

export const setBottomInset = (val: number) => {
	bottomInset = val;
};

export const getBottomInset = () => bottomInset;
