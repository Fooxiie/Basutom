'use strict'

function regle0(mot, lettre, position, nombre) {
    if (mot[position] == lettre)
        return false;
    let n = 0;
    for (const c of mot) {
        if (c == lettre)
            n += 1;
    }
    if (n > nombre)
        return false;
    return true;
}

function regle1(mot, lettre, position, nombre) {
    if (mot[position] != lettre)
        return false;
    let n = 0;
    for (const c of mot) {
        if (c == lettre)
            n += 1;
    }
    if (n < nombre)
        return false;
    return true;
}

function regle2(mot, lettre, position, nombre) {
    if (mot[position] == lettre)
        return false;
    let n = 0;
    for (const c of mot) {
        if (c == lettre)
            n += 1;
    }
    if (n < nombre)
        return false;
    return true;
}

function traiter(mots, mot, masque) {
    let lettres = {
        "A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "H": 0, "I": 0, "J": 0,
        "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "P": 0, "Q": 0, "R": 0, "S": 0, "T": 0,
        "U": 0, "V": 0, "W": 0, "X": 0, "Y": 0, "Z": 0
    };
    let nb = mot.length;
    for (let i = 0; i < nb; ++i) {
        if (masque[i] == '0')
            continue;
        const c = mot[i];
        lettres[c] += 1;
    }
    let result = [];
    for (const unmot of mots) {
        if (unmot.length != nb)
            continue;
        //if (unmot[0] != mot[0])
        //    continue;
        let ok = true;
        for (let i = 0; i < nb; ++i) {
            const c = mot[i];
            switch (masque[i]) {
                case '0':
                    ok = regle0(unmot, c, i, lettres[c]);
                    break;
                case '1':
                    ok = regle1(unmot, c, i, lettres[c]);
                    break;
                case '2':
                    ok = regle2(unmot, c, i, lettres[c]);
                    break;
            }
            if (!ok)
                break;
        }
        if (!ok)
            continue;
        result.push(unmot);
    }
    return result;
}

function calculer(solution, mot) {
    let nb = solution.length;
    let masques = [];
    for (let i = 0; i < nb; ++i) {
        masques.push('0');
    }
    let lettres = {};
    for (const c of solution) {
        if (!lettres[c])
            lettres[c] = 0;
        lettres[c] += 1;
    }
    for (let i = 0; i < nb; ++i) {
        let c = mot[i];
        if (solution[i] != c)
            continue;
        masques[i] = '1';
        lettres[c] -= 1;
    }
    for (let i = 0; i < nb; ++i) {
        let c = mot[i];
        if (masques[i] == '1')
            continue;
        if (!solution.includes(c))
            continue;
        if (lettres[c] <= 0)
            continue;
        masques[i] = '2';
        lettres[c] -= 1;
    }
    return masques.join('');
}

function meilleurs_choix(mots, lettre, longueur) {
    let stats = [];
    for (let i = 0; i < longueur; ++i) {
        stats.push({});
    }
    let facteurs = {
        6: [6, 4, 2, 1, 3, 5],
        7: [7, 5, 3, 1, 2, 4, 6],
        8: [8, 6, 4, 2, 1, 3, 5, 7],
        9: [9, 7, 5, 3, 1, 2, 4, 6, 8],
    };
    let choix = {};
    for (const mot of mots) {
        if (mot.length != longueur)
            continue;
        if (lettre != '_' && mot[0] != lettre)
            continue;
        if (mot.endsWith("EZ"))
            continue;
        let m = "";
        let nb = 0;
        for (let i = 0; i < longueur; ++i) {
            let c = mot[i];
            if (!stats[i][c])
                stats[i][c] = 0;
            let mul = 1
            if (!"AEIOUY".includes(c))
                mul = 3
            stats[i][c] += facteurs[longueur][i] * mul;
            if (m.includes(c))
                continue;
            nb += 1;
            m += c;
        }
        choix[mot] = nb;
    }
    let liste = [];
    for (const key in choix) {
        let cpt = 0;
        for (let i = 0; i < key.length; ++i) {
            let c = key[i];
            cpt += stats[i][c];
        }
        liste.push([key, choix[key], cpt]);
    }
    liste.sort(function (a, b) {
        if (a[1] > b[1])
            return -1;
        if (a[1] < b[1])
            return 1;
        if (a[2] > b[2])
            return -1;
        if (a[2] < b[2])
            return 1;
        if (a[0] > b[0])
            return 1;
        if (a[0] < b[0])
            return -1;
        return 0;
    })
    return liste;
}
