import { Language } from "@/types/Language";
import en from '@/json/en.json'
import de from '@/json/de.json'
import es from '@/json/de.json'
import fr from '@/json/fr.json'

export function choseRandomWord(language: Language) {
    const langs = {en,de, es, fr}
    const key = language==="en"?"englishWord":"targetWord";
    const possibleWords = langs[language].words.filter((elem) => elem[key].length > 4);
    return possibleWords[Math.floor(Math.random() * possibleWords.length)][key]
}