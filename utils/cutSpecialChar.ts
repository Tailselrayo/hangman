export function cutSpecialChar(word: string) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}