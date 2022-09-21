Sutom_FindFirstMask = async function () {
    grille = document.getElementById('grille')
    letter_count = grille.childNodes[0].childNodes[0].childElementCount;
    start_letter = grille.childNodes[0].childNodes[0].childNodes[0].innerHTML;
    return { letter_count, start_letter }
}

Tusmo_FindFirstMask = async function () {
    grille = document.getElementsByClassName('motus-grid')[0]
    letter_count = grille.childElementCount / 6
    start_letter = grille.childNodes[0].nextElementSibling.outerText
    return { letter_count, start_letter }
}

Tusmo_LastRow = function () {
    grille = document.getElementsByClassName('motus-grid')[0]

    size_word = grille.childElementCount / 6 - 1

    lastElementChecked = null
    for (elmt in grille.childNodes) {
        if (typeof (grille.childNodes[elmt]) == "object"
            && grille.childNodes[elmt].tagName == "DIV") {
            if (grille.childNodes[elmt].childNodes[0].classList.contains('bg-sky-600')) {
                break;
            }
            lastElementChecked = elmt
        }
    }

    mask = "";
    id_to_start = lastElementChecked - size_word
    for (i = id_to_start; i <= lastElementChecked; i++) {
        if (grille.childNodes[i].childNodes[0].classList.contains('r')) {
            mask += 1
        } else if (grille.childNodes[i].childNodes[0].classList.contains('-')) {
            mask += 0
        } else if (grille.childNodes[i].childNodes[0].classList.contains('y')) {
            mask += 2
        }
    }

    return mask
}

Sutom_LastRow = function () {
    rows = document.getElementById('grille').childNodes[0].childNodes

    lastElementChecked = null
    for (elmt in rows) {
        if (!isNaN(parseFloat(elmt)) && isFinite(elmt) && rows[elmt].childNodes[0].classList.length == 0) {
            break;
        }
        lastElementChecked = rows[elmt].childNodes
    }

    mask = "";
    for (detail in lastElementChecked) {
        if (typeof (lastElementChecked[detail]) == "object") {
            x = lastElementChecked[detail]
            if (x.classList.contains('bien-place')) {
                mask += "1"
            } else if (x.classList.contains('mal-place')) {
                mask += "2"
            } else if (x.classList.contains('non-trouve')) {
                mask += "0"
            }
        }
    }
    return mask
}

Sutom_WriteWord = async function (letters) {
    for (l in letters) {
        document.dispatchEvent(new KeyboardEvent('keypress', { 'key': letters.charAt(l) }));
        await new Promise(r => setTimeout(r, 100));
    }
    document.getElementsByClassName('input-lettre-entree')[0].click()
    return;
}

Tusmo_WriteWord = async function (letters) {
    for (l in letters) {
        keys = document.querySelectorAll('div.keyboard div.key')
        for (key in keys) {
            if (typeof (keys[key]) == "object" && keys[key].childNodes[0].innerHTML.trim() != "") {
                if (keys[key].childNodes[0].innerHTML == letters[l]) {
                    keys[key].childNodes[0].click()
                }
            }
        }
        await new Promise(r => setTimeout(r, 100));
    }
    document.getElementsByClassName('fa-sign-in-alt')[0].click()
    return;
}