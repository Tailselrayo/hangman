import { useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import en from '@/json/en.json'
import { PlayerData } from "@/types/PlayerData";
import { MantineColor } from "@mantine/core";


export function useHangman(nbPlayer: number) {
    const [isOnStart, setIsOnStart] = useState(true)
    const [playerData, handlers] = useListState<PlayerData>(
        Array.from({ length: nbPlayer }).map(() => ({
            lives: 6,
            letters: [],
            pseudo: "",
            color: "red",
        }))
    );
    const [gameWord, setGameWord] = useState("");
    const [easyMode, setEasyMode] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isNextPlayerReady, setIsNextPlayerReady] = useState(true);

    const possibleWords = en.words.filter((elem) => elem.englishWord.length > 4);

    const changeCurrent = () => {
        setCurrent((current + 1) % nbPlayer);
        setIsNextPlayerReady(true);
    }

    const setPlayerData = (pseudo: string, color: MantineColor) => {
        handlers.setItem(current, { ...playerData[current], pseudo, color })
    }

    const loseALife = () => {
        if (playerData[current].lives > 0)
            handlers.setItemProp(current, "lives", playerData[current].lives - 1)
    }

    const suicide = () => {
        handlers.setItemProp(current, "lives", 0);
    }

    const testVictory = () => {
        let word = gameWord.toUpperCase();
        const i = easyMode ? 1 : 0;
        return word.slice(i).split('').filter((elem) => playerData[current].letters.includes(elem)).length + i === gameWord.length;
    }

    const onRetry = () => {
        setIsOnStart(false);
        setGameWord(possibleWords[Math.floor(Math.random() * possibleWords.length)].englishWord);
        handlers.apply((elem) => ({ ...elem, lives: 6, letters: [] }))
    }

    const onClick = (letter: string) => {
        if (playerData[current].letters.includes(letter))
            return;
        if (!gameWord.toUpperCase().split('').includes(letter))
            loseALife();
        handlers.setItemProp(current, "letters", playerData[current].letters.concat([letter]));
        setTimeout(() => setIsNextPlayerReady(false), 1000);
    }

    const onKeyPress = (e: KeyboardEvent) => {
        const letter = e.key.toUpperCase();
        if (letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0) && letter.length === 1)
            onClick(letter);
    }

    useEffect(() => {
        if (playerData[current].pseudo) {
            window.addEventListener("keypress", onKeyPress)
            return (() => window.removeEventListener("keypress", onKeyPress))
        }
    })

    return ({
        values: { playerData, currentPlayer: playerData[current], isOnStart, gameWord, easyMode, isNextPlayerReady },
        handlers: { setEasyMode, testVictory, onRetry, onClick, suicide, changeCurrent, setPlayerData },
    })
}