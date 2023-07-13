'use client'
import { Keyboard } from '@/components/Keyboard'
import { Lifebar } from '@/components/Lifebar'
import { Word } from '@/components/Word'
import en from '@/json/en.json'
import { Button, Checkbox, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Game() {
    const [lives, setLives] = useState(6);
    const [isOnStart, setIsOnStart] = useState(true)
    const [imputChars, handlers] = useListState<string>([]);
    const [gameWord, setGameWord] = useState("");
    const [hasWon, setHasWon] = useState(false);
    const [easyMode, setEasyMode] = useState(true);

    const possibleWords = en.words.filter((elem) => elem.englishWord.length > 4);

    const loseALife = () => {
        if (lives > 0) {
            setLives(lives - 1);
        }
    }

    const testVictory = () => {
        let word = gameWord.toUpperCase();
        const i = easyMode ? 1:0;
        console.log(word.slice(i).split('').filter((elem)=>imputChars.includes(elem)).length)
        if (word.slice(i).split('').filter((elem)=>imputChars.includes(elem)).length + i=== gameWord.length) {
            setHasWon(true);
        }
    }

    const onRetry = () => {
        setLives(6);
        handlers.setState([]);
        setIsOnStart(false);
        setGameWord(possibleWords[Math.floor(Math.random() * possibleWords.length)].englishWord);
        setHasWon(false);
    }

    const onFail = (letter: string) => {
        handlers.append(letter);
        loseALife();
    }

    const onSuccess = (letter: string) => {
        handlers.append(letter);
    }

    const addALife = () => {
        if (lives < 6) {
            setLives(lives + 1);
        }
    }

    console.log(gameWord)
    useEffect(()=>testVictory(), [imputChars])

    return (
        <>
            <Modal opened={!lives || isOnStart || hasWon} onClose={onRetry}>
                <Stack>
                    <Text>{(isOnStart?"Welcome to the hangman game !":
                        (hasWon?"Congrats, you won !":("You lose ! The word was " + gameWord)))}
                    </Text>
                    <Group h="100%" align="center">
                        <Button onClick={onRetry} color="green">
                            {isOnStart ? "Start" : "Retry"}
                        </Button>
                        <Link href="/"><Button color="blue">Home</Button></Link>
                    </Group>
                    <Checkbox 
                        checked={easyMode} 
                        onChange={()=>setEasyMode(!easyMode)}
                        label="Easy Mode"
                    />
                </Stack>
            </Modal>
            <Stack align="center" justify="flex-start">
                <Title>Hangman</Title>
                <Lifebar lives={lives} />
                <Group>
                    <Button onClick={addALife} color="green">Gain a life</Button>
                    <Button onClick={loseALife} color="red">Lose a life</Button>
                </Group>
                <Word word={gameWord} imputedChara={imputChars} hint={easyMode}/>
                <Keyboard
                    imputedChar={imputChars}
                    correctChar={gameWord.toUpperCase().split('')}
                    onFail={onFail}
                    onSuccess={onSuccess}
                />
            </Stack>
        </>
    )
}