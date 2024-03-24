export default {
	color: {
		foreground: {
			bright: {
				red: "\x1b[91m",
				green: "\x1b[92m",
				yellow: "\x1b[93m",
				blue: "\x1b[94m",
				magenta: "\x1b[95m",
				cyan: "\x1b[96m",
				white: "\x1b[97m",
			},
			normal: {
				red: "\x1b[31m",
				green: "\x1b[32m",
				yellow: "\x1b[33m",
				blue: "\x1b[34m",
				magenta: "\x1b[35m",
				cyan: "\x1b[36m",
				white: "\x1b[37m",
			},

			rgb: (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`,
			reset: "\x1b[39m",
		},
		background: {
			bright: {
				red: "\x1b[101m",
				green: "\x1b[102m",
				yellow: "\x1b[103m",
				blue: "\x1b[104m",
				magenta: "\x1b[105m",
				cyan: "\x1b[106m",
				white: "\x1b[107m",
			},
			normal: {
				red: "\x1b[41m",
				green: "\x1b[42m",
				yellow: "\x1b[43m",
				blue: "\x1b[44m",
				magenta: "\x1b[45m",
				cyan: "\x1b[46m",
				white: "\x1b[47m",
			},
			rgb: (r: number, g: number, b: number) => `\x1b[48;2;${r};${g};${b}m`,
			reset: "\x1b[49m",
		},
		reset: "\x1b[0m",
	},
	position: {
		save: "\x1b[s",
		restore: "\x1b[u",
		absolute: (x: number, y: number) => `\x1b[${y};${x}H`,
		absoluteX: (x: number) => `\x1b[${x}G`,
		absoluteY: (y: number) => `\x1b[${y}d`,
		up: (n: number) => `\x1b[${n}A`,
		down: (n: number) => `\x1b[${n}B`,
		right: (n: number) => `\x1b[${n}C`,
		left: (n: number) => `\x1b[${n}D`,
		scroll: {
			up: (n: number) => `\x1b[${n}S`,
			down: (n: number) => `\x1b[${n}T`,
		},
	},
	cursorVisibility: {
		hide: "\x1b[?25l",
		show: "\x1b[?25h",
		blinking: {
			start: "\x1b[?12h",
			stop: "\x1b[?12l",
		},
	},
	alternateScreenBuffer: {
		open: "\x1b[?1049h",
		exit: "\x1b[?1049l",
	},
	textModification: {
		delete: {
			characters: (n: number) => `\x1b[${n}P`,
			lines: (n: number) => `\x1b[${n}M`,
		},
	},
	title: (title: string) => `\x1b]0;${title}\x07`,
};