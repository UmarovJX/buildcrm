const cyrillicCollection = [
    "Ё",
    "Й",
    "Ц",
    "У",
    "К",
    "Е",
    "Н",
    "Г",
    "Ш",
    "Щ",
    "З",
    "Х",
    "Ъ",
    "ё",
    "й",
    "ц",
    "у",
    "к",
    "е",
    "н",
    "г",
    "ш",
    "щ",
    "з",
    "х",
    "ъ",
    "Ф",
    "Ы",
    "В",
    "А",
    "П",
    "Р",
    "О",
    "Л",
    "Д",
    "Ж",
    "Э",
    "ф",
    "ы",
    "в",
    "а",
    "п",
    "р",
    "о",
    "л",
    "д",
    "ж",
    "э",
    "Я",
    "Ч",
    "С",
    "М",
    "И",
    "Т",
    "Ь",
    "Б",
    "Ю",
    "я",
    "ч",
    "с",
    "м",
    "и",
    "т",
    "ь",
    "б",
    "ю"
]

console.log(cyrillicCollection)


function symbolIsCyrillic(event) {
    return event
        .replace(/[^а-яё ҚқЎўҲҳҒғ]/i, "")
        .replace(/(\..*?)\..*/g, "$1");
}

function symbolIsLatin(event) {
    return event.replace(/[^a-z. ']/i, "").replace(/(\..*?)\..*/g, "$1");
}

function symbolCyrillicToLatin(word) {
    symbolIsCyrillic(word)

    let result = '';
    const A = {};

    A["Ё"] = "YO";
    A["Й"] = "I";
    A["Ц"] = "TS";
    A["У"] = "U";
    A["К"] = "K";
    A["Е"] = "E";
    A["Н"] = "N";
    A["Г"] = "G";
    A["Ш"] = "SH";
    A["Щ"] = "SCH";
    A["З"] = "Z";
    A["Х"] = "H";
    A["Ъ"] = "'";
    A["ё"] = "yo";
    A["й"] = "i";
    A["ц"] = "ts";
    A["у"] = "u";
    A["к"] = "k";
    A["е"] = "e";
    A["н"] = "n";
    A["г"] = "g";
    A["ш"] = "sh";
    A["щ"] = "sch";
    A["з"] = "z";
    A["х"] = "h";
    A["ъ"] = "'";
    A["Ф"] = "F";
    A["Ы"] = "I";
    A["В"] = "V";
    A["А"] = "A";
    A["П"] = "P";
    A["Р"] = "R";
    A["О"] = "O";
    A["Л"] = "L";
    A["Д"] = "D";
    A["Ж"] = "ZH";
    A["Э"] = "E";
    A["ф"] = "f";
    A["ы"] = "i";
    A["в"] = "v";
    A["а"] = "a";
    A["п"] = "p";
    A["р"] = "r";
    A["о"] = "o";
    A["л"] = "l";
    A["д"] = "d";
    A["ж"] = "zh";
    A["э"] = "e";
    A["Я"] = "YA";
    A["Ч"] = "CH";
    A["С"] = "S";
    A["М"] = "M";
    A["И"] = "I";
    A["Т"] = "T";
    A["Ь"] = "'";
    A["Б"] = "B";
    A["Ю"] = "YU";
    A["я"] = "ya";
    A["ч"] = "ch";
    A["с"] = "s";
    A["м"] = "m";
    A["и"] = "i";
    A["т"] = "t";
    A["ь"] = "'";
    A["б"] = "b";
    A["ю"] = "yu";


    for (let i in word) {
        if (word.hasOwnProperty(i)) {
            if (A[word[i]] === undefined) {
                result += word[i];
            } else {
                result += A[word[i]];
            }
        }
    }

    return result;
}

function symbolLatinToCyrillic(word) {
    word = symbolIsLatin(word);

    let result = '';
    const a = {};

    a["Q"] = "Қ";
    a["q"] = "қ";

    a["O'"] = "Ў";
    a["o'"] = "ў";

    a["H"] = "Ҳ";
    a["h"] = "ҳ";

    a["G'"] = "Ғ";
    a["g'"] = "ғ";

    a["I"] = "И";
    a["U"] = "У";
    a["K"] = "К";
    a["N"] = "Н";
    a["G"] = "Г";
    a["Z"] = "З";
    a["i"] = "и";
    a["u"] = "у";
    a["k"] = "к";
    a["E"] = "Е";
    a["e"] = "е";
    a["n"] = "н";
    a["g"] = "г";
    a["z"] = "з";
    a["F"] = "Ф";
    a["V"] = "В";
    a["P"] = "П";
    a["R"] = "Р";
    a["O"] = "О";
    a["L"] = "Л";
    a["D"] = "Д";
    a["J"] = "Ж";
    a["f"] = "ф";
    a["v"] = "в";
    a["a"] = "а";
    a["y"] = "й";
    a["A"] = "А";
    a["p"] = "п";
    a["r"] = "р";
    a["o"] = "о";
    a["l"] = "л";
    a["d"] = "д";
    a["j"] = "ж";

    a["S"] = "С";
    a["M"] = "М";
    a["I"] = "И";
    a["T"] = "Т";
    a["B"] = "Б";

    a["s"] = "с";
    a["m"] = "м";
    a["i"] = "и";
    a["t"] = "т";
    a["b"] = "б";


    word = word.replaceAll("Sh", "Ш");
    word = word.replaceAll("sh", "ш");

    word = word.replaceAll("Ch", "Ч");
    word = word.replaceAll("ch", "ч");

    word = word.replaceAll("Q", "Қ");
    word = word.replaceAll("q", "қ");

    word = word.replaceAll("O'", "Ў");
    word = word.replaceAll("o'", "ў");

    word = word.replaceAll("G'", "Ғ");
    word = word.replaceAll("g'", "ғ");

    word = word.replaceAll("Yu", "Ю");
    word = word.replaceAll("yu", "ю");

    word = word.replaceAll("Ya", "Я");
    word = word.replaceAll("Ya", "я");

    word = word.replaceAll("Yo", "Ё");
    word = word.replaceAll("yo", "ё");

    word = word.replaceAll("Ye", "Е");
    word = word.replaceAll("ye", "е");

    word = word.replaceAll("Kh", "Х");
    word = word.replaceAll("kh", "х");

    word = word.replaceAll("H", "Ҳ");
    word = word.replaceAll("h", "ҳ");


    for (let i in word) {
        if (word.hasOwnProperty(i)) {
            if (a[word[i]] === undefined) {
                result += word[i];
            } else {
                result += a[word[i]];
            }
        }
    }
    return result;
}

export default {
    symbolIsCyrillic,
    symbolCyrillicToLatin,
    symbolLatinToCyrillic,
}