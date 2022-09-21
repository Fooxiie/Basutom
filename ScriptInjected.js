Sutom_FindFirstMask = async function () {
    grille = document.getElementById('grille')
    letter_count = grille.childNodes[0].childNodes[0].childElementCount;
    start_letter = grille.childNodes[0].childNodes[0].childNodes[0].innerHTML;
    return { letter_count, start_letter }
}

Sutom_LastRow = function () {
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

WriteWord = async function (letters) {
    for (l in letters) {
        document.dispatchEvent(new KeyboardEvent('keypress', { 'key': letters.charAt(l) }));
        await new Promise(r => setTimeout(r, 100));
    }
    document.getElementsByClassName('input-lettre-entree')[0].click()
    return;
}