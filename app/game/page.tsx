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
    const [easyMode, setEasyMode] = useState(true);

    const possibleWords = en.words.filter((elem) => elem.englishWord.length > 4);

    const loseALife = () => {
        if (lives > 0) 
            setLives(lives - 1);
    }

    const testVictory = () => {
        let word = gameWord.toUpperCase();
        const i = easyMode ? 1 : 0;
        return word.slice(i).split('').filter((elem) => imputChars.includes(elem)).length + i === gameWord.length;
    }

    const onRetry = () => {
        setLives(6);
        handlers.setState([]);
        setIsOnStart(false);
        setGameWord(possibleWords[Math.floor(Math.random() * possibleWords.length)].englishWord);
    }

    const onClick = (letter: string) => {
        if (imputChars.includes(letter))
            return;
        if (!gameWord.toUpperCase().split('').includes(letter)) 
            loseALife();
        handlers.append(letter);
    }

    const onKeyPress = (e: KeyboardEvent) => {
        const letter = e.key.toUpperCase();
        if (letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0) && letter.length === 1)
            onClick(letter);
    }

    useEffect(() => {
        window.addEventListener("keypress", onKeyPress)
        return (() => window.removeEventListener("keypress", onKeyPress))
    })

    return (
        <>
            <Modal.Root closeOnClickOutside={false} opened={!lives || isOnStart || testVictory()} onClose={onRetry}>
                <Modal.Overlay />
                <Modal.Content >
                    <Modal.Body>
                        <Stack>
                            <Text>{(isOnStart ? "Welcome to the hangman game !" :
                                (lives !== 0 ? "Congrats, you won !" : ("You lose ! The word was " + gameWord)))}
                            </Text>
                            <Group h="100%" align="center">
                                <Button onClick={onRetry} color="green">
                                    {isOnStart ? "Start" : "Retry"}
                                </Button>
                                <Link href="/"><Button color="blue">Home</Button></Link>
                            </Group>
                            <Checkbox
                                checked={easyMode}
                                onChange={() => setEasyMode(!easyMode)}
                                label="Easy Mode"
                            />
                        </Stack>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
            <Stack align="center" justify="flex-start">
                <Title color="white">Hangman</Title>
                <Lifebar lives={lives} />
                <Group>
                    <Button onClick={() => setLives(0)} color="red">Kill yourself</Button>
                </Group>
                <Word word={gameWord} imputedChara={imputChars} hint={easyMode} />
                <Keyboard
                    imputedChar={imputChars}
                    correctChar={gameWord.toUpperCase().split('')}
                    onClick={onClick}
                />
            </Stack>
        </>
    )
}