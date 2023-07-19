import { useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { PlayerData } from "@/types/PlayerData";
import { MantineColor } from "@mantine/core";
import { Language } from "@/types/Language";
import { cutSpecialChar } from "@/utils/cutSpecialChar";
import { choseRandomWord } from "@/utils/choseRandomWord";


export function useHangman(nbPlayer: number, language: Language) {
    const [gameWord, setGameWord] = useState("")
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
    const [easyMode, setEasyMode] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isNextPlayerReady, setIsNextPlayerReady] = useState(true);

    const changeCurrent = () => {
        setCurrent(computeNext());
        setIsNextPlayerReady(true);
    }

    const computeNext = () => {
        let counter = 1;
        while (counter < nbPlayer + 1 && playerData[(current + counter) % nbPlayer].hasFinished) {
            counter++;
        }
        return (current + counter) % nbPlayer
    }

    const setPlayerData = (pseudo: string, color: MantineColor) => {
        handlers.setItem(current, { ...playerData[current], pseudo, color })
    }

    const computePosition = (hasWon: boolean) => {
        const playerFinished = playerData.filter((elem) => elem.hasFinished)
        const countDead = playerFinished.filter((elem) => elem.lives === 0).length
        if (!hasWon) {
            return nbPlayer - countDead
        }
        return 1 + (playerFinished.length - countDead)
    }

    const loseALife = () => {
        if (playerData[current].lives > 0)
            handlers.setItemProp(current, "lives", playerData[current].lives - 1)
    }

    const suicide = () => {
        handlers.setItemProp(current, "lives", 0);
        if (nbPlayer !== 1 && !testVictory()) {
            setTimeout(() => setIsNextPlayerReady(false), 500);
        }
        handlers.setItemProp(current, "hasFinished", computePosition(false))
    }

    const testVictory = () => {
        let word = cutSpecialChar(gameWord).toUpperCase();
        const i = easyMode ? 1 : 0;
        return word.slice(i).split('').filter((elem) => playerData[current].letters.includes(elem)).length + i === gameWord.length;
    }


    const isGameFinished = () => {
        return playerData.filter((_, index) => !playerData[index].hasFinished).length === 0
    }

    const onRetry = () => {
        setIsOnStart(false);
        setGameWord(choseRandomWord(language))
        handlers.apply((elem) => ({ ...elem, lives: 6, letters: [], hasFinished: 0 }))
    }

    const onClick = (letter: string) => {
        console.log(gameWord)
        if (playerData[current].letters.includes(letter))
            return;
        if (!cutSpecialChar(gameWord).toUpperCase().split('').includes(letter))
            loseALife();
        handlers.setItemProp(current, "letters", playerData[current].letters.concat([letter]));
        if (playerData.filter((elem) => !elem.hasFinished).length > 1)
            setTimeout(() => setIsNextPlayerReady(false), 1000);
    }

    //Handling of the keyboard inputs (only the 26 alphabetical)
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
    }, [playerData, current, handlers])

    useEffect(() => {
        if (playerData[current].pseudo) {
            window.addEventListener("keypress", onKeyPress)
            return (() => window.removeEventListener("keypress", onKeyPress))
        }
    })

    return ({
        values: { playerData, currentPlayer: playerData[current], isOnStart, gameWord, easyMode, isNextPlayerReady, current },
        handlers: {
            setEasyMode,
            isGameFinished,
            onRetry,
            onClick,
            suicide,
            changeCurrent,
            setPlayerData,
            computePosition,
            computeNext,
        },
    })
}