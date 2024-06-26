// eslint-disable-next-line complexity
export function represent_value(
	value: string,
	type: string | undefined,
	lang: "js" | "py" | null = null
): string | null | number | boolean | Record<string, unknown> {
	if (type === undefined) {
		return lang === "py" ? "None" : null;
	}
	if (type === "string" || type === "str") {
		return lang === null ? value : '"' + value + '"';
	} else if (type === "number") {
		return lang === null ? parseFloat(value) : value;
	} else if (type === "boolean" || type == "bool") {
		if (lang === "py") {
			value = String(value);
			return value === "true" ? "True" : "False";
		} else if (lang === "js") {
			return value;
		}
		return value === "true";
	} else if (type === "List[str]") {
		value = JSON.stringify(value);
		return value;
	} else if (type.startsWith("Literal['")) {
		// a literal of strings
		return '"' + value + '"';
	}
	// assume object type
	if (lang === null) {
		return value === "" ? null : JSON.parse(value);
	} else if (typeof value === "string") {
		if (value === "") {
			return lang === "py" ? "None" : "null";
		}
		return value;
	}
	if (lang === "py") {
		value = replace_file_data_with_file_function(value);
	}
	return stringify_except_file_function(value);
}

export function is_potentially_nested_file_data(obj: any): boolean {
	if (typeof obj === "object" && obj !== null) {
		if (obj.hasOwnProperty("path") && obj.hasOwnProperty("meta")) {
			if (
				typeof obj.meta === "object" &&
				obj.meta !== null &&
				obj.meta._type === "gradio.FileData"
			) {
				return true;
			}
		}
	}
	if (typeof obj === "object" && obj !== null) {
		for (let key in obj) {
			if (typeof obj[key] === "object") {
				let result = is_potentially_nested_file_data(obj[key]);
				if (result) {
					return true;
				}
			}
		}
	}
	return false;
}

function replace_file_data_with_file_function(obj: any): any {
	if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
		if (
			"path" in obj &&
			"meta" in obj &&
			obj.meta?._type === "gradio.FileData"
		) {
			return `file('${obj.path}')`;
		}
	}
	if (Array.isArray(obj)) {
		obj.forEach((item, index) => {
			if (typeof item === "object" && item !== null) {
				obj[index] = replace_file_data_with_file_function(item); // Recurse and update array elements
			}
		});
	} else if (typeof obj === "object" && obj !== null) {
		Object.keys(obj).forEach((key) => {
			obj[key] = replace_file_data_with_file_function(obj[key]); // Recurse and update object properties
		});
	}
	return obj;
}

function stringify_except_file_function(obj: any): string {
	const jsonString = JSON.stringify(obj, (key, value) => {
		if (
			typeof value === "string" &&
			value.startsWith("file(") &&
			value.endsWith(")")
		) {
			return `UNQUOTED${value}`; // Flag the special strings
		}
		return value;
	});
	const regex = /"UNQUOTEDfile\(([^)]*)\)"/g;
	return jsonString.replace(regex, (match, p1) => `file(${p1})`);
}
