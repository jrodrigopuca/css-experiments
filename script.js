document.addEventListener("DOMContentLoaded", () => {
	if (typeof marked === "undefined") {
		console.error(
			"marked no está definido. Verifica la carga del CDN o usa una copia local."
		);
		document.getElementById("docs-container").innerHTML =
			"<p>Error: No se pudo cargar la biblioteca de Markdown. Prueba recargar la página o verifica tu conexión.</p>";
		return;
	}

	console.log(
		"marked cargado correctamente. Versión:",
		marked.version || "desconocida"
	);

	const challengeLinks = document.querySelectorAll(".challenge-nav a");
	const docsNav = document.querySelector(".docs-nav");
	const challengeContainer = document.getElementById("challenge-container");
	const docsContainer = document.getElementById("docs-container");

	loadChallenge(challengeLinks[0].getAttribute("data-challenge"));
	challengeLinks[0].classList.add("active");
	challengeContainer.classList.add("active");

	loadDocsList();

	challengeLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			resetActiveStates();
			link.classList.add("active");
			challengeContainer.classList.add("active");
			const challengePath = link.getAttribute("data-challenge");
			loadChallenge(challengePath);
		});
	});

	function loadChallenge(path) {
		fetch(path)
			.then((response) => response.text())
			.then((html) => {
				challengeContainer.innerHTML = html;
				const stage = path.split("/")[1];
				const challenge = path.split("/")[2];
				loadStylesheet(`components/${stage}/${challenge}/${challenge}.css`);
			})
			.catch((err) => {
				challengeContainer.innerHTML = "<p>Error al cargar el desafío.</p>";
				console.error("Error en desafío:", err);
			});
	}

	function loadStylesheet(path) {
		const oldLink = document.querySelector("link[data-challenge-style]");
		if (oldLink) oldLink.remove();
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		link.dataset.challengeStyle = true;
		document.head.appendChild(link);
	}

	function loadDocsList() {
		const docFiles = ["N01S01.md", "N01S02.md", "N01S03.md", "N01S04.md"];
		docFiles.forEach((file) => {
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.href = `#docs-${file}`;
			a.textContent = file.replace(".md", "");
			a.dataset.doc = `docs/${file}`;
			li.appendChild(a);
			docsNav.appendChild(li);

			a.addEventListener("click", (e) => {
				e.preventDefault();
				resetActiveStates();
				a.classList.add("active");
				docsContainer.classList.add("active");
				loadDoc(a.getAttribute("data-doc"));
			});
		});
	}

	function loadDoc(path) {
		console.log("Cargando documento:", path);
		fetch(path)
			.then((response) => {
				if (!response.ok)
					throw new Error("Respuesta no OK: " + response.status);
				return response.text();
			})
			.then((markdown) => {
				console.log("Markdown cargado:", markdown);
				docsContainer.innerHTML = marked.parse(markdown);
			})
			.catch((err) => {
				docsContainer.innerHTML =
					"<p>Error al cargar la documentación: " + err.message + "</p>";
				console.error("Error detallado:", err);
			});
	}

	function resetActiveStates() {
		challengeLinks.forEach((l) => l.classList.remove("active"));
		docsNav.querySelectorAll("a").forEach((l) => l.classList.remove("active"));
		challengeContainer.classList.remove("active");
		docsContainer.classList.remove("active");
	}
});
