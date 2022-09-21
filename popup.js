IsGame = false
TypeGame = "unknown"
mots = null

Finish = function () {
    document.getElementById('info_game').style.display = 'none'
    document.getElementById('finish').style.display = 'block'
}

document.getElementById('testFirstWord').addEventListener("click", async () => {
    await TestBestStart()
    best_start = document.getElementById('best_start').innerHTML
    await new Promise(r => setTimeout(r, 300 * best_start.length));
    EstimateMask(best_start)
})

brainingThings = async function (mask, previous) {
    if (mots == null)
        mots = MOTS
    mots = traiter(mots, previous, mask)

    new_best_start = meilleurs_choix(mots, previous[0], previous.length)[0][0];
    if (previous == new_best_start) {
        Finish();
        return;
    }
    document.getElementById('best_start').innerHTML = new_best_start
    await TestBestStart()
    best_start = document.getElementById('best_start').innerHTML
    await new Promise(r => setTimeout(r, 300 * best_start.length));
    EstimateMask(best_start)
}

defineIsGame = function (goodUrl) {
    diode = document.getElementById('diode')
    status_text = document.getElementById('status_text')
    diode.style.backgroundColor = goodUrl ? "green" : "red"
    status_text.innerHTML = goodUrl ? `On Game : ${TypeGame}` : "Impossible d'interpréter le site"
}

LastRow = function () {
    rows = document.getElementById('grille').childNodes[0].childNodes
    line = 0

    lastElementChecked = null
    for (elmt in rows) {
        if (!isNaN(parseFloat(elmt)) && isFinite(elmt) && rows[elmt].childNodes[0].classList.length == 0) {
            break;
        }
        lastElementChecked = rows[elmt].childNodes
        line += 1;
    }

    mask = "";
    for (detail in lastElementChecked) {
        if (typeof (lastElementChecked[detail]) == "object") {
            x = lastElementChecked[detail]
            if (x.classList.contains('bien-place')) {
                mask += "1"
                continue
            }
            if (x.classList.contains('mal-place')) {
                mask += "2"
                continue
            }
            if (x.classList.contains('non-trouve')) {
                mask += "0"
                continue
            }
        }
    }
    return mask
}

EstimateMask = async function (previous) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    maskGetted = "ahah bouuuuh"
    console.log('EstimateMask : ' + previous)

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: LastRow,
    }, (injectionResults) => {
        maskGetted = injectionResults[0].result
        brainingThings(maskGetted, previous)
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