function handle(event) {
    if (event.key === "Enter") {
        const word = event.target.value.trim();
        if (word) {
            searchWord(word);
        }
    }
}

async function searchWord(word) {
    const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        const entry = data[0];

        // Word & phonetics
        document.querySelector('.word').textContent = entry.word;
        document.querySelector('.phonetics').textContent = entry.phonetics[0]?.text || 'Phonetics unavailable';
        document.querySelector('audio').src =
            entry.phonetics[0]?.audio || '';

        // Definition (first one shown)
        const definition = entry.meanings[0]?.definitions[0]?.definition || 'Definition not found.';
        document.querySelector('.word-definition').textContent = definition;

        // === Get ALL synonyms ===
        const allSynonyms = new Set(); // Use Set to avoid duplicates

        entry.meanings.forEach(meaning => {
            meaning.definitions.forEach(def => {
                if (def.synonyms && def.synonyms.length > 0) {
                    def.synonyms.forEach(syn => allSynonyms.add(syn));
                }
            });
        });

        const synonymList = Array.from(allSynonyms);
        const synonymsContainer = document.querySelector('.synonyms');
synonymsContainer.innerHTML = ''; // Clear previous content

if (synonymList.length > 0) {
    synonymList.forEach(syn => {
        const span = document.createElement('span');
        span.className = 'pills';
        span.textContent = syn;
        synonymsContainer.appendChild(span);
    });
} else {
    synonymsContainer.textContent = 'No synonyms found.';
}

    } catch (error) {
        document.querySelector('.word').textContent = word;
        document.querySelector('.phonetics').textContent = '';
        document.querySelector('audio').src = '';
        document.querySelector('.word-definition').textContent = 'No definition found.';
        document.querySelector('.synonyms').textContent = '';
        console.error(error);
    }
}
