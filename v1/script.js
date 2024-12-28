const CATEGORIES = [
  {
    name: "technology",
    color: "#3b82f6",
  },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  {
    name: "entertainment",
    color: "#db2777",
  },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

// Selecting DOM Elements
const btn = document.querySelector(
  ".btn-open"
);
const form = document.querySelector(
  ".fact-form"
);
const factsList =
  document.querySelector(".facts-list");

// Create DOM elements: Render facts in list
factsList.innerHTML = "";

// Load data from Supbase
async function loadFacts() {
  const res = await fetch(
    "https://fnbpbvwcuufabmcapdfa.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          process.env.SUPABASE_API_KEY,
        authorization: `Bearer ${process.env.SUPABASE_TOKEN}`,
      },
    }
  );
  const data = await res.json(); // await keyword used for functions that return promises
  createFactsList(data);
}

loadFacts();
function createFactsList(dataArray) {
  const htmlArray = dataArray.map(
    (fact) => `<li class="fact">
                      <p>
                        ${fact.text}
                        <a
                          class="source"
                          href=${
                            fact.source
                          }
                          target="_blank"
                          >(Source)</a
                        >
                      </p>
                      <!--- "span" tag creates a new text element without a new line, allows for separate styling -->
                      <span class="tag" style="background-color: ${
                        CATEGORIES.find(
                          (category) =>
                            category.name ===
                            fact.category
                        ).color
                      }"
                        >${
                          fact.category
                        }</span
                      ></li>`
  );

  const html = htmlArray.join("");
  factsList.insertAdjacentHTML(
    "afterbegin",
    html
  );
}

btn.addEventListener("click", () => {
  if (
    form.classList.contains("hidden")
  ) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a Fact";
  }
});
