function initializeChallenge3() {
	const cardContainer = document.getElementById("card-container-3");
	const cards = document.querySelectorAll(".card-3");
	const paddingInput = document.getElementById("padding-3");
	const marginInput = document.getElementById("margin-3");
	const boxSizingSelect = document.getElementById("box-sizing-3");
	const overflowSelect = document.getElementById("container-overflow-3");

	console.log("Elementos encontrados:", {
		cardContainer,
		cards: cards.length,
		paddingInput,
		marginInput,
		boxSizingSelect,
		overflowSelect,
	});

	if (
		!cardContainer ||
		!cards.length ||
		!paddingInput ||
		!marginInput ||
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
		const boxSizingValue = boxSizingSelect.value;
		const overflowValue = overflowSelect.value;

		console.log("updateStyles ejecutado con valores:", {
			paddingValue,
			marginValue,
			boxSizingValue,
			overflowValue,
		});

		const isValidUnit = (value) =>
			/^\d+(\.\d+)?(%|px|em|rem|vw|vh|ch)$/.test(value) || value === "0";

		cards.forEach((card) => {
			if (isValidUnit(paddingValue)) {
				card.style.padding = paddingValue;
			} else {
				card.style.padding = "1rem";
				console.warn(`Valor de padding inválido: ${paddingValue}`);
			}

			if (isValidUnit(marginValue)) {
				card.style.margin = marginValue;
			} else {
				card.style.margin = "1rem";
				console.warn(`Valor de margin inválido: ${marginValue}`);
			}

			card.style.boxSizing = boxSizingValue;
		});

		cardContainer.style.overflow = overflowValue;
	}

	// Añadir listeners con depuración
	paddingInput.addEventListener("input", () => {
		console.log("Evento input en padding-3");
		updateStyles();
	});
	marginInput.addEventListener("input", () => {
		console.log("Evento input en margin-3");
		updateStyles();
	});
	boxSizingSelect.addEventListener("change", () => {
		console.log("Evento change en box-sizing-3");
		updateStyles();
	});
	overflowSelect.addEventListener("change", () => {
		console.log("Evento change en container-overflow-3");
		updateStyles();
	});

	console.log("Listeners añadidos, ejecutando updateStyles inicial");
	updateStyles();
}
