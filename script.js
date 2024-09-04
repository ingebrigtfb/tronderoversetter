// Firebase-konfigurasjon
const firebaseConfig = {
    apiKey: "AIzaSyAVk1jfkxXNmBZAwsbNTCOCo72EnavIzRY",
    authDomain: "tronderskoversetter.firebaseapp.com",
    projectId: "tronderskoversetter",
    storageBucket: "tronderskoversetter.appspot.com",
    messagingSenderId: "6045176022",
    appId: "1:6045176022:web:3115f8ca94030f5f2eb977"
};

// Vent til dokumentet er ferdig lastet
document.addEventListener("DOMContentLoaded", function () {
    // Initialiser Firebase
    const app = firebase.initializeApp(firebaseConfig);

    // Initialiser Firestore-databasen
    const db = firebase.firestore();

    // Lokal ordbok for trøndersk til østlandsk oversettelse
    let dictionary = {
        "gje": "gi",
        "me": "meg",
        "pils": "pils"
    };

    // Hent ord fra Firestore ved start
    db.collection("dictionary").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dictionary[doc.data().trondersk] = doc.data().ostlandsk;
        });
    });

    function translate() {
        const inputText = document.getElementById('inputText').value;
        const translatedText = translateToOstlandsk(inputText);
        document.getElementById('translatedText').innerText = translatedText;
    }

    function translateToOstlandsk(sentence) {
        const words = sentence.split(' ');
        const translatedWords = words.map(word => {
            return dictionary[word.toLowerCase()] || word;
        });
        return translatedWords.join(' ');
    }

    function addWord() {
        const tronderskWord = document.getElementById('tronderskWord').value.toLowerCase();
        const ostlandskWord = document.getElementById('ostlandskWord').value.toLowerCase();

        if (tronderskWord && ostlandskWord) {
            // Lagre til Firestore
            db.collection("dictionary").doc(tronderskWord).set({
                trondersk: tronderskWord,
                ostlandsk: ostlandskWord
            })
            .then(() => {
                alert(`Ordet "${tronderskWord}" er lagt til som "${ostlandskWord}"`);
                document.getElementById('tronderskWord').value = '';
                document.getElementById('ostlandskWord').value = '';

                // Legg også til i lokal ordbok
                dictionary[tronderskWord] = ostlandskWord;
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        } else {
            alert("Vennligst fyll inn begge feltene.");
        }
    }

    // Bind event-lyttene til knappene
    document.getElementById('addWordBtn').addEventListener('click', addWord);
    document.getElementById('translateBtn').addEventListener('click', translate);
});