IsGame = false
TypeGame = "unknown"

document.getElementById('testFirstWord').addEventListener("click", async () => {
    await TestBestStart()
    best_start = document.getElementById('best_start').innerHTML
    setTimeout(EstimateMask, 4000);
})

defineIsGame = function (goodUrl) {
    diode = document.getElementById('diode')
    status_text = document.getElementById('status_text')
    diode.style.backgroundColor = goodUrl ? "green" : "red"
    status_text.innerHTML = goodUrl ? `On Game : ${TypeGame}` : "Impossible d'interpréter le site"
}

LastRow = function () {
    console.log('Gettins Last row')
    rows = document.getElementById('grille').childNodes[0].childNodes

}

EstimateMask = async function (previousword) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: LastRow,
    }, (injectionResults) => {
        line = injectionResults[0].result
    });
}

TestBestStart = async function () {
    console.log("I'm writing master !")
    best_start = document.getElementById('best_start').innerHTML
    best_start = best_start.substring(1);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: await WriteWord,
        args: [best_start]
    });
}

WriteWord = function (letters) {
    for (l in letters) {
        document.dispatchEvent(new KeyboardEvent('keypress', { 'key': letters.charAt(l) }));
    }
    document.getElementsByClassName('input-lettre-entree')[0].click()
    return;
}

FindMasqueSutom = async function () {
    grille = document.getElementById('grille')
    letter_count = grille.childNodes[0].childNodes[0].childElementCount;
    start_letter = grille.childNodes[0].childNodes[0].childNodes[0].innerHTML;
    return { letter_count, start_letter }
}

InitGame = async function () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: TypeGame == "sutom" ? FindMasqueSutom : null,
    }, (injectionResults) => {
        word_to_find = injectionResults[0].result
        document.getElementById('word_to_find').innerHTML = `${word_to_find.letter_count} lettres commencant par : ${word_to_find.start_letter}`

        best_start = meilleurs_choix(MOTS, word_to_find.start_letter, word_to_find.letter_count)[0][0];
        document.getElementById('best_start').innerHTML = best_start
    });
}

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let domain = (new URL(tabs[0].url));
    domain = domain.hostname;

    switch (domain) {
        case "sutom.nocle.fr":
            TypeGame = "sutom"
            defineIsGame(true)
            InitGame()
            break;
        case "www.tusmo.xyz":
            TypeGame = "tusmo"
            defineIsGame(true)
            break;
        default:
            TypeGame = "unknown"
            defineIsGame(false)
            break;
    }
});