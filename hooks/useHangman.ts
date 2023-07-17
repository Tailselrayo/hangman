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
            color: "dark",
            hasFinished: 0,
        }))
    );
    const [gameWord, setGameWord] = useState("");
    const [easyMode, setEasyMode] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isNextPlayerReady, setIsNextPlayerReady] = useState(true);

    const possibleWords = en.words.filter((elem) => elem.englishWord.length > 4);

    const changeCurrent = () => {
        let counter = 1;
        while (counter < nbPlayer + 1 && playerData[(current + counter) % nbPlayer].hasFinished) {
            counter++;
        }
        setCurrent((current + counter) % nbPlayer);
        setIsNextPlayerReady(true);
    }

    const setPlayerData = (pseudo: string, color: MantineColor) => {
        handlers.setItem(current, { ...playerData[current], pseudo, color })
    }

    const computePosition = (hasWon: boolean) => {
        const playerFinished = playerData.filter((elem) => elem.hasFinished)
        const countDead = playerFinished.filter((elem) => elem.lives === 0).length
        if (!hasWon) {
            return 4 - countDead
        }
        return 1 + (playerFinished.length - countDead)
    }

    const loseALife = () => {
        if (playerData[current].lives > 0)
            handlers.setItemProp(current, "lives", playerData[current].lives - 1)
    }

    const suicide = () => {
        handlers.setItemProp(current, "lives", 0);
        setTimeout(() => setIsNextPlayerReady(false), 500);
        handlers.setItemProp(current, "hasFinished", computePosition(false))
    }

    const testVictory = () => {
        let word = gameWord.toUpperCase();
        const i = easyMode ? 1 : 0;
        return word.slice(i).split('').filter((elem) => playerData[current].letters.includes(elem)).length + i === gameWord.length;
    }

    const isGameFinished = () => {
        return playerData.filter((_, index) => !playerData[index].hasFinished).length === 0
    }

    const onRetry = () => {
        setIsOnStart(false);
        setGameWord(possibleWords[Math.floor(Math.random() * possibleWords.length)].englishWord);
        handlers.apply((elem) => ({ ...elem, lives: 6, letters: [], hasFinished: 0 }))
    }

    const onClick = (letter: string) => {
        if (playerData[current].letters.includes(letter))
            return;
        if (!gameWord.toUpperCase().split('').includes(letter))
            loseALife();
        handlers.setItemProp(current, "letters", playerData[current].letters.concat([letter]));
        if (playerData.filter((elem) => !elem.hasFinished).length > 1)
            setTimeout(() => setIsNextPlayerReady(false), 1000);
    }

    const onKeyPress = (e: KeyboardEvent) => {
        const letter = e.key.toUpperCase();
        if (letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0) && letter.length === 1)
            onClick(letter);
    }

    useEffect(() => {
        if (!playerData[current].hasFinished) {
            if (playerData[current].lives === 0 || testVictory())
                handlers.setItemProp(current, "hasFinished", computePosition(testVictory()))
        }
        console.log(testVictory(), playerData[current].letters)
    }, [playerData, current, handlers])

    useEffect(() => {
        if (playerData[current].pseudo) {
            window.addEventListener("keypress", onKeyPress)
            return (() => window.removeEventListener("keypress", onKeyPress))
        }
    })

    return ({
        values: { playerData, currentPlayer: playerData[current], isOnStart, gameWord, easyMode, isNextPlayerReady, current },
        handlers: { setEasyMode, isGameFinished, onRetry, onClick, suicide, changeCurrent, setPlayerData, computePosition },
    })
}