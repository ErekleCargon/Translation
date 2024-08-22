let generatedJSON = {};

// Function to fetch the translation.json and render the form
async function loadAndRenderForm() {
  try {
    const response = await fetch("translation.json");
    const json = await response.json();
    renderForm(json);
  } catch (error) {
    console.error("Error loading the translation.json file:", error);
  }
}

const aba = "ABABA";

let metaDescription = document.querySelector('meta[property="og:description"]');
if (!metaDescription) {
  metaDescription = document.createElement("meta");
  metaDescription.setAttribute("property", "og:description");
  document.head.appendChild(metaDescription);
}
metaDescription.setAttribute(
  "content",
  `Connecting shippers and carriers with our on-demand ${aba}.`
);

// Function to render input fields based on JSON keys
function renderForm(json) {
  const form = document.getElementById("jsonForm");
  form.innerHTML = ""; // Clear existing form content

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const container = document.createElement("div");
      container.classList.add("input-container");
      form.appendChild(container);

      const label = document.createElement("label");
      label.innerHTML = `${key}: `;
      label.classList.add("input-label");
      container.appendChild(label);

      const input = document.createElement("textarea");
      input.type = "text";
      input.classList.add("input-field");
      input.name = key;
      input.value = localStorage.getItem(key) || "";
      container.appendChild(input);
      input.addEventListener("blur", (event) => {
        localStorage.setItem(key, event.target.value);
      });
    }
  }
}

// Function to download the generated JSON as a file
function downloadJSON() {
  const form = document.getElementById("jsonForm");
  const formData = new FormData(form);
  generatedJSON = {};

  formData.forEach((value, key) => {
    generatedJSON[key] = value;
  });
  if (Object.keys(generatedJSON).length === 0) {
    alert("Please generate JSON first by filling the form and clicking Submit.");
    return;
  }

  const blob = new Blob([JSON.stringify(generatedJSON, null, 4)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "translation.json";
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);
  a.remove();
  localStorage.clear();
}

// Initialize the form by loading the translation.json
loadAndRenderForm();
