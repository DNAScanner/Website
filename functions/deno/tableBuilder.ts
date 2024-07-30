export {};

// Declare the method in the global scope
declare global {
	interface Number {
		toShort(): string;
	}
}

// Define the method on the Number prototype
Number.prototype.toShort = function (): string {
	if (this >= 1_000_000_000) return (this / 1_000_000_000).toFixed(1) + "B";
	if (this >= 1_000_000) return (this / 1_000_000).toFixed(1) + "M";
	if (this >= 1_000) return (this / 1_000).toFixed(1) + "K";
	return this.toFixed(1);
};

export enum ForegroundColor {
	BLACK = "30",
	RED = "31",
	GREEN = "32",
	YELLOW = "33",
	BLUE = "34",
	MAGENTA = "35",
	CYAN = "36",
	WHITE = "37",
	GRAY = "90",
	LIGHT_RED = "91",
	LIGHT_GREEN = "92",
	LIGHT_YELLOW = "93",
	LIGHT_BLUE = "94",
	LIGHT_MAGENTA = "95",
	LIGHT_CYAN = "96",
	LIGHT_WHITE = "97",
}

export enum BackgroundColor {
	BLACK = "40",
	RED = "41",
	GREEN = "42",
	YELLOW = "43",
	BLUE = "44",
	MAGENTA = "45",
	CYAN = "46",
	WHITE = "47",
	GRAY = "100",
	LIGHT_RED = "101",
	LIGHT_GREEN = "102",
	LIGHT_YELLOW = "103",
	LIGHT_BLUE = "104",
	LIGHT_MAGENTA = "105",
	LIGHT_CYAN = "106",
	LIGHT_WHITE = "107",
}

export enum TextStyle {
	RESET = 0,
	BOLD = 1,
	ITALIC = 3,
	UNDERLINE = 4,
	STRIKETHROUGH = 9,
	BLINK = 7,
}

export type TableItem = {
	text: string | number;
	color?: ForegroundColor;
	colorRGB?: [number, number, number];
	backgroundColor?: BackgroundColor;
	backgroundColorRGB?: [number, number, number];
	bold?: boolean; // Default: false
	italic?: boolean; // Default: false
	underline?: boolean; // Default: false
	strikethrough?: boolean; // Default: false
	blink?: boolean; // Default: false
	link?: string;
};

export type TableBuilderOptions = {
	showIndex?: boolean;
	gap?: number;
	items: TableItem[][][];
};

export const table = ({showIndex = true, gap = 1, items}: TableBuilderOptions) => {
	let text = "";

	// Convert all item#.texts to strings; if they are numbers, format them
	for (const item of items)
		for (const row of item)
			for (const column of row) {
				if (typeof column.text === "number") {
					const text = column.text.toShort();
					column.text = text;
				}
			}

	// Get the maximum length of each column and save them in an array
	const maxLengths: number[] = [];
	for (const item in items)
		for (const row in items[item])
			for (const column in items[item][row]) {
				const length = items[item][row][column].text.toString().length + 1;
				if (maxLengths[column] === undefined || length > maxLengths[column]) maxLengths[column] = length;
			}

	// Add the index column
	if (showIndex) maxLengths.unshift(items.length.toString().length + 2);

	// Create the table
	for (const itemIndex in items) {
		const item = items[itemIndex];
		if (showIndex) {
			const segment = parseInt(itemIndex) + 1 + ".";
			const spaces = " ".repeat(maxLengths[0] - segment.length);

			text += segment + spaces;
		}

		for (const rowIndex in item) {
			const row = item[rowIndex];

			if (rowIndex !== "0") text += "\n" + " ".repeat(maxLengths[0]);

			for (const columnIndex in row) {
				const column = row[columnIndex];

				// Move the cursor to the right position
				const segment = column.text.toString();
				const spaces = " ".repeat(maxLengths[parseInt(columnIndex) + (showIndex ? 1 : 0)] - segment.length);

				if (column.color) text += "\x1b[" + column.color + "m";
				if (column.colorRGB) text += `\x1b[38;2;${column.colorRGB[0]};${column.colorRGB[1]};${column.colorRGB[2]}m`;
				if (column.backgroundColor) text += "\x1b[" + column.backgroundColor + "m";
				if (column.backgroundColorRGB) text += `\x1b[48;2;${column.backgroundColorRGB[0]};${column.backgroundColorRGB[1]};${column.backgroundColorRGB[2]}m`;
				if (column.bold) text += "\x1b[" + TextStyle.BOLD + "m";
				if (column.italic) text += "\x1b[" + TextStyle.ITALIC + "m";
				if (column.underline) text += "\x1b[" + TextStyle.UNDERLINE + "m";
				if (column.strikethrough) text += "\x1b[" + TextStyle.STRIKETHROUGH + "m";
				if (column.blink) text += "\x1b[" + TextStyle.BLINK + "m";
				if (column.link) text += `\x1b]8;;${column.link}\x1b\\`;

				text += segment;

				if (column.color || column.colorRGB || column.backgroundColor || column.backgroundColorRGB || column.bold || column.italic || column.underline || column.strikethrough || column.blink) text += "\x1b[" + TextStyle.RESET + "m";
				if (column.link) text += "\x1b]8;;\x1b\\";

				text += spaces;
			}
		}

		text += "\n".repeat(gap + 1);
	}

	return text;
};