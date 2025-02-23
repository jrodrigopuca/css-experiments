document.addEventListener("DOMContentLoaded", () => {
	const links = document.querySelectorAll(".sidebar a");
	const challengeContainer = document.getElementById("challenge-container");

	// Cargar el primer desafío por defecto
	loadChallenge(links[0].getAttribute("data-challenge"));
	links[0].classList.add("active");

	links.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();

			// Remover clase active de todos los links
			links.forEach((l) => l.classList.remove("active"));
			link.classList.add("active");

			// Cargar el desafío correspondiente
			const challengePath = link.getAttribute("data-challenge");
			loadChallenge(challengePath);
		});
	});

	function loadChallenge(path) {
		fetch(path)
			.then((response) => response.text())
			.then((html) => {
				challengeContainer.innerHTML = html;
				// Cargar CSS específico del desafío
				const stage = path.split("/")[1]; // Ej: stage-1
				const challenge = path.split("/")[2]; // Ej: challenge-1
				loadStylesheet(`components/${stage}/${challenge}/${challenge}.css`);
			})
			.catch((err) => {
				challengeContainer.innerHTML = "<p>Error al cargar el desafío.</p>";
				console.error(err);
			});
	}

	function loadStylesheet(path) {
		// Remover estilos previos si existen
		const oldLink = document.querySelector("link[data-challenge-style]");
		if (oldLink) oldLink.remove();

		// Añadir nuevo stylesheet
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		link.dataset.challengeStyle = true;
		document.head.appendChild(link);
	}
});
