function initializeChallenge3() {
	const cardContainer = document.getElementById("card-container-3");
	const cards = document.querySelectorAll(".card-3");
	const paddingInput = document.getElementById("padding-3");
	const marginInput = document.getElementById("margin-3");
	const borderWidthInput = document.getElementById("border-width-3");
	const fontSizeInput = document.getElementById("font-size-3");
	const gapInput = document.getElementById("gap-3");
	const widthInput = document.getElementById("width-3");
	const rootFontSizeInput = document.getElementById("root-font-size-3");
	const borderRadiusInput = document.getElementById("border-radius-3");
	const boxSizingSelect = document.getElementById("box-sizing-3");
	const overflowSelect = document.getElementById("container-overflow-3");

	console.log("Elementos encontrados:", {
		cardContainer,
		cards: cards.length,
		paddingInput,
		marginInput,
		borderWidthInput,
		fontSizeInput,
		gapInput,
		widthInput,
		rootFontSizeInput,
		borderRadiusInput,
		boxSizingSelect,
		overflowSelect,
	});

	if (
		!cardContainer ||
		!cards.length ||
		!paddingInput ||
		!marginInput ||
		!borderWidthInput ||
		!fontSizeInput ||
		!gapInput ||
		!widthInput ||
		!rootFontSizeInput ||
		!borderRadiusInput ||
		!boxSizingSelect ||
		!overflowSelect
	) {
		console.error(
			"No se encontraron todos los elementos necesarios para Challenge 3"
		);
		return;
	}

	function updateStyles() {
		const paddingValue = paddingInput.value.trim();
		const marginValue = marginInput.value.trim();
		const borderWidthValue = borderWidthInput.value.trim();
		const fontSizeValue = fontSizeInput.value.trim();
		const gapValue = gapInput.value.trim();
		const widthValue = widthInput.value.trim();
		const rootFontSizeValue = rootFontSizeInput.value.trim();
		const borderRadiusValue = borderRadiusInput.value.trim();
		const boxSizingValue = boxSizingSelect.value;
		const overflowValue = overflowSelect.value;

		const isValidUnit = (value) =>
			/^\d+(\.\d+)?(%|px|em|rem|vw|vh|ch)$/.test(value) ||
			value === "0" ||
			value.startsWith("clamp(");
		const isValidClamp = (value) =>
			/^clamp\(\s*\d+(\.\d+)?(%|px|em|rem|vw|vh|ch)\s*,\s*\d+(\.\d+)?(%|px|em|rem|vw|vh|ch)\s*,\s*\d+(\.\d+)?(%|px|em|rem|vw|vh|ch)\s*\)$/.test(
				value
			);

		cards.forEach((card) => {
			if (isValidUnit(paddingValue)) card.style.padding = paddingValue;
			else {
				card.style.padding = "1rem";
				console.error("Valor de padding no válido");
			}

			if (isValidUnit(marginValue)) card.style.margin = marginValue;
			else {
				card.style.margin = "1rem";
				console.error("valor de margin no válido");
			}

			if (isValidUnit(borderWidthValue))
				card.style.borderWidth = borderWidthValue;
			else {
				card.style.borderWidth = "2px";
				console.error("Valor de border no válido");
			}

			if (isValidUnit(fontSizeValue)) card.style.fontSize = fontSizeValue;
			else {
				card.style.fontSize = "1rem";
				console.error("Valor de font size no válido");
			}

			if (isValidUnit(widthValue) || isValidClamp(widthValue))
				card.style.width = widthValue;
			else {
				card.style.width = "clamp(200px, 25vw, 300px)";
				console.error("Valor de width no válido");
			}

			if (isValidUnit(borderRadiusValue))
				card.style.borderRadius = borderRadiusValue;
			else {
				card.style.borderRadius = "0.5rem";
				console.error("Valor de border radius no válido");
			}
			card.style.boxSizing = boxSizingValue;
		});

		if (isValidUnit(gapValue)) cardContainer.style.gap = gapValue;
		else {
			cardContainer.style.gap = "1rem";
			console.error("Valor de gap no válido");
		}

		if (isValidUnit(rootFontSizeValue))
			document.documentElement.style.fontSize = rootFontSizeValue;
		else {
			document.documentElement.style.fontSize = "16px";
			console.error("Valor de root font size no válido");
		}

		cardContainer.style.overflow = overflowValue;
	}

	paddingInput.addEventListener("input", updateStyles);
	marginInput.addEventListener("input", updateStyles);
	borderWidthInput.addEventListener("input", updateStyles);
	fontSizeInput.addEventListener("input", updateStyles);
	gapInput.addEventListener("input", updateStyles);
	widthInput.addEventListener("input", updateStyles);
	rootFontSizeInput.addEventListener("input", updateStyles);
	borderRadiusInput.addEventListener("input", updateStyles);
	boxSizingSelect.addEventListener("change", updateStyles);
	overflowSelect.addEventListener("change", updateStyles);

	updateStyles();
}
