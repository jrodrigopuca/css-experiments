// Función para calcular la especificidad de un selector
function calculateSpecificity(selector) {
	let specificity = [0, 0, 0, 0]; // [inline, id, class/attr/pseudo-class, element/pseudo-element]

	if (selector === "inline") {
		specificity[0] = 1;
		return specificity;
	}

	const parts = selector.trim().split(/\s+/);
	parts.forEach((part) => {
		const idCount = (part.match(/#[^\s#.:[\]]+/g) || []).length;
		specificity[1] += idCount;

		const classAttrPseudoCount =
			(part.match(/\.[^\s#.:[\]]+/g) || []).length +
			(part.match(/\[.*?\]/g) || []).length +
			(part.match(/:[^\s#.:[\]](?!:)/g) || []).length;
		specificity[2] += classAttrPseudoCount;

		const elementCount = (part.match(/^[a-z]+|\*[^\s#.:[\]]/gi) || []).length;
		const pseudoElementCount = (part.match(/::[^\s#.:[\]]/g) || []).length;
		specificity[3] += elementCount + pseudoElementCount;
	});

	return specificity;
}

// Función para comparar especificidades
function compareSpecificity(spec1, spec2) {
	for (let i = 0; i < 4; i++) {
		if (spec1[i] !== spec2[i]) {
			return spec1[i] - spec2[i];
		}
	}
	return 0;
}

// Función para verificar si un selector coincide con un elemento
function selectorMatchesElement(selector, element) {
	try {
		// Manejar inline styles
		if (selector === "inline") {
			return element.hasAttribute("style");
		}
		// Usar matches() para verificar si el selector aplica al elemento
		return element.matches(selector);
	} catch (e) {
		console.warn(`Selector inválido: ${selector}`, e);
		return false;
	}
}

function removeComments(css) {
	return css.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

// Función principal
async function determineResultingStyle(
	elementId,
	htmlFile,
	cssFile,
	targetProperty = "color"
) {
	try {
		// Cargar el archivo HTML
		const htmlResponse = await fetch(htmlFile);
		if (!htmlResponse.ok)
			throw new Error(`HTML no encontrado: ${htmlResponse.status}`);
		const htmlText = await htmlResponse.text();

		// Crear un DOM virtual para analizar el HTML
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, "text/html");
		const element = doc.getElementById(elementId);

		if (!element) {
			return {
				error: `No se encontró ningún elemento con id="${elementId}" en ${htmlFile}`,
			};
		}

		// Obtener estilos inline si existen
		const inlineStyle = element.getAttribute("style") || "";
		const inlineRules = inlineStyle
			? [{ selector: "inline", styles: inlineStyle }]
			: [];

		// Cargar el archivo CSS
		const cssResponse = await fetch(cssFile);
		if (!cssResponse.ok)
			throw new Error(`CSS no encontrado: ${cssResponse.status}`);
		const cssText = await cssResponse.text();
		const cssPure = removeComments(cssText);

		// Parsear las reglas CSS
		const rules = cssPure
			.split("}")
			.map((rule) => rule.trim())
			.filter((rule) => rule.length > 0)
			.map((rule) => {
				const [selectorPart, stylesPart] = rule.split("{");
				return {
					selector: selectorPart.trim(),
					styles: stylesPart.trim(),
				};
			});

		// Combinar reglas inline y externas
		const allRules = [...inlineRules, ...rules];

		// Analizar cada regla
		const parsedRules = allRules.map((rule) => {
			const styles = rule.styles
				.split(";")
				.map((s) => s.trim())
				.filter((s) => s);
			let value = "";
			let hasImportant = false;

			styles.forEach((style) => {
				const [prop, val] = style.split(":").map((s) => s.trim());
				if (prop === targetProperty) {
					value = val.replace("!important", "").trim();
					hasImportant = val.includes("!important");
				}
			});

			return {
				selector: rule.selector,
				specificity: calculateSpecificity(rule.selector),
				value,
				hasImportant,
				matches: selectorMatchesElement(rule.selector, element),
			};
		});

		// Filtrar reglas que aplican al elemento
		const applicableRules = parsedRules.filter(
			(rule) => rule.matches && rule.value
		);

		if (applicableRules.length === 0) {
			return {
				rules: parsedRules,
				resultingStyle: `No se encontraron estilos para ${targetProperty}`,
				winningSelector: null,
				winningSpecificity: null,
			};
		}

		// Determinar la regla ganadora
		let winner = null;
		let maxSpecificity = [0, 0, 0, 0];

		applicableRules.forEach((rule, index) => {
			const isInline = rule.selector === "inline";
			const specComparison = compareSpecificity(
				rule.specificity,
				maxSpecificity
			);

			if (rule.hasImportant) {
				if (
					!winner ||
					!winner.hasImportant ||
					index > applicableRules.indexOf(winner)
				) {
					winner = rule;
					maxSpecificity = rule.specificity;
				}
			} else if (!winner?.hasImportant) {
				if (
					isInline ||
					specComparison > 0 ||
					(specComparison === 0 && index > applicableRules.indexOf(winner))
				) {
					winner = rule;
					maxSpecificity = rule.specificity;
				}
			}
		});

		return {
			rules: parsedRules,
			resultingStyle: `${targetProperty}: ${winner.value}`,
			winningSelector: winner.selector,
			winningSpecificity: winner.specificity,
		};
	} catch (error) {
		return {
			error: `Error al procesar: ${error.message}`,
		};
	}
}

// Ejemplo de uso
async function testAnalyzer(idElement, targetHTML, targetCSS, property) {
	const result = await determineResultingStyle(
		idElement, // ID del elemento
		targetHTML, // Archivo HTML
		targetCSS, // Archivo CSS
		property // Propiedad a analizar
	);

	if (result.error) {
		console.error(result.error);
		return;
	}

	const paraLog = result.rules.map((r) => {
		const row = {
			selector: r.selector,
			spec1: r.specificity[0] !== 0 ? r.specificity[0] : null,
			spec2: r.specificity[1] !== 0 ? r.specificity[1] : null,
			spec3: r.specificity[2] !== 0 ? r.specificity[2] : null,
			spec4: r.specificity[3] !== 0 ? r.specificity[3] : null,
			value: r.value || "N/A",
			matches: r.matches ? "✔️" : "❌",
			hasImportant: r.hasImportant ? "✔️" : "❌",
		};

		return row;
	});

	console.info("Reglas analizadas:");
	console.table(paraLog);
	console.info("Resultado:");
	console.table({
		"Elemento analizado": idElement,
		"Estilo resultante": result.resultingStyle,
		"Selector ganador": result.winningSelector,
		"Especificidad ganadora": result.winningSpecificity.join(", "),
	});
}
