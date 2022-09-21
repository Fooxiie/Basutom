let IsGame = false
let TypeGame = "unknown"
let mots = MOTS

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let domain = (new URL(tabs[0].url));
    domain = domain.hostname;

    switch (domain) {
        case "sutom.nocle.fr":
            TypeGame = "sutom"
            defineWichGameIs(true)
            InitGame()
            break;
        case "www.tusmo.xyz":
            TypeGame = "tusmo"
            defineWichGameIs(true)
            InitGame()
            break;
        default:
            TypeGame = "unknown"
            defineWichGameIs(false)
            break;
    }
});

InitGame = async function () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: TypeGame == "sutom" ? Sutom_FindFirstMask : Tusmo_FindFirstMask,
    }, (injectionResults) => {
        word_to_find = injectionResults[0].result
        document.getElementById('word_to_find').innerHTML = `${word_to_find.letter_count} lettres commencant par : ${word_to_find.start_letter}`

        best_start = meilleurs_choix(MOTS, word_to_find.start_letter, word_to_find.letter_count)[0][0];
        document.getElementById('best_start').innerHTML = best_start
    });
}

defineWichGameIs = function (goodUrl) {
    diode = document.getElementById('diode')
    status_text = document.getElementById('status_text')
    document.getElementById('info_game').style.display = (goodUrl) ? 'block' : 'none'
    diode.style.backgroundColor = goodUrl ? "green" : "red"
    status_text.innerHTML = goodUrl ? `On Game : ${TypeGame}` : "Impossible d'interpréter le site"
}

Finish = function () {
    document.getElementById('info_game').style.display = 'none'
    document.getElementById('finish').style.display = 'block'
}

// Boutton résoudre
document.getElementById('testFirstWord').addEventListener("click", async () => {
    best_start = document.getElementById('best_start').innerHTML
    await TestWord(best_start)
    time_to_wait = TypeGame == "sutom" ? 400 : 120
    await new Promise(r => setTimeout(r, time_to_wait * best_start.length));
    EstimateMask(best_start)
})

Boucle = async function (mask, previous) {
    if (mots == null)
        mots = MOTS
    mots = traiter(mots, previous, mask)

    new_best_start = meilleurs_choix(mots, previous[0], previous.length)[0][0];
    if (previous == new_best_start) {
        Finish();
        return;
    }

    document.getElementById('best_start').innerHTML = new_best_start
    await TestWord(new_best_start)
    time_to_wait = TypeGame == "sutom" ? 400 : 120
    await new Promise(r => setTimeout(r, time_to_wait * best_start.length));
    EstimateMask(new_best_start)
}

TestWord = async function (best_start) {
    console.log("I'm writing master !")
    best_start = best_start.substring(1);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: TypeGame == "sutom" ? await Sutom_WriteWord : await Tusmo_WriteWord,
        args: [best_start]
    });
}

EstimateMask = async function (previous) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    maskGetted = "ahah bouuuuh"

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: TypeGame == "sutom" ? Sutom_LastRow : Tusmo_LastRow,
    }, (injectionResults) => {
        maskGetted = injectionResults[0].result
        Boucle(maskGetted, previous)
    });
}
