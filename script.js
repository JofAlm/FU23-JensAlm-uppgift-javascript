// Skapar en variabel med API-nyckeln
const apiKey = "solaris-2ngXkR6S02ijFrTP";

// Skapar en asynkron funktion för att hämta data från API
async function fetchData() {
  try {
    // Utför ett GET-anrop till API URL med header för att inkludera API-nyckeln
    let resp = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": apiKey }, // Header som innehåller API-nyckeln
      }
    );

    // Kontrollera om svaret är OK, om inte, "kasta ut" ett fel
    if (!resp.ok) {
      throw new Error("Något gick fel");
    }

    // Konvertera svaret till JSON-format
    let data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    // Hantera eventuella fel som kan uppstå under hämtningen av data
    console.error("Det blev fel", error);
    throw error; // Kasta vidare felet för att låta det hanteras av andra delar av koden
  }
}

// Hämta referens till inputfältet och sökknappen
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const planetInfoContainer = document.getElementById("planet-info");

// Lägg till en händelselyssnare för sökknappen
searchButton.addEventListener("click", () => {
  searchBody(searchInput.value, planetInfoContainer);
});

// Lägg till en händelselyssnare för Enter-tangenten i inputfältet
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBody(searchInput.value, planetInfoContainer);
  }
});

// Funktion för att visa planetinformationen
function displayBodyInfo(planet) {
  // Skapa HTML-element för varje bit av information och lägg till dem i containern
  const planetName = document.createElement("h2");
  planetName.textContent = `Namn: ${planet.name}`;

  const latinName = document.createElement("p");
  latinName.textContent = `Latinskt namn: ${planet.latinName}`;

  const description = document.createElement("p");
  description.textContent = `Beskrivning: ${planet.desc}`;

  const circumference = document.createElement("p");
  circumference.textContent = `Storlek: ${planet.circumference}`;

  const distance = document.createElement("p");
  distance.textContent = `Avstånd till Solen: ${planet.distance}`;

  const moons = document.createElement("p");
  moons.textContent = `Månar: ${
    planet.moons.length > 0 ? planet.moons.join(", ") : "Ingen"
  }`;

  // Rensa containern för att visa bara den nya informationen
  planetInfoContainer.innerHTML = "";

  // Lägg till alla skapade element i containern
  planetInfoContainer.appendChild(planetName);
  planetInfoContainer.appendChild(latinName);
  planetInfoContainer.appendChild(description);
  planetInfoContainer.appendChild(circumference);
  planetInfoContainer.appendChild(distance);
  planetInfoContainer.appendChild(moons);
}

// Funktion för att söka efter en planet eller solen baserat på användarens inmatning
function searchBody(bodyName, planetInfoContainer) {
  // Hämta data från API:et och jämför med användarens inmatning
  fetchData()
    .then((data) => {
      // Sök efter både planeter och stjärnor
      const bodies = data.bodies.filter(
        (body) => body.type === "planet" || body.type === "star"
      );
      const body = bodies.find(
        (body) => body.name.toLowerCase() === bodyName.toLowerCase()
      );

      if (body) {
        // Om planeten eller solen hittades, visa informationen
        displayBodyInfo(body);
      } else {
        // Om planeten eller solen inte hittades, visa ett meddelande
        const errorMessage = document.createElement("p");
        errorMessage.textContent =
          "Ingen himlakropp med det namnet hittades i vårt solsystem. Prova igen!";
        planetInfoContainer.innerHTML = "";
        planetInfoContainer.appendChild(errorMessage);
      }
    })
    .catch((error) => {
      // Vid fel, visa ett felmeddelande på sidan
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Det blev fel: " + error.message;
      planetInfoContainer.innerHTML = "";
      planetInfoContainer.appendChild(errorMessage);
    });
}
