'use client'
import { Keyboard } from '@/components/Keyboard'
import { Lifebar } from '@/components/Lifebar'
import { ModalHeaderless } from '@/components/ModalHeaderless'
import { Word } from '@/components/Word'
import { useHangman } from '@/hooks/useHangman'
import { Button, Checkbox, ColorPicker, Group, MantineColor, Modal, Stack, Text, TextInput, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

interface GameProps {
    params: { nbPlayer: number };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const params = context.params;
    if (!params || !params.nbPlayer || Array.isArray(params.nbPlayer) || isNaN(parseInt(params.nbPlayer))) {
        return (
            {
                redirect: "/",
                permanent: false,
            }
        )
    }
    return ({
        props: {
            nbPlayer: parseInt(params.nbPlayer),
        }
    })
}

export default function Game(props: GameProps) {
    const { values, handlers } = useHangman(props.params.nbPlayer);
    const [pseudo, setPseudo] = useInputState("");
    const [color, setColor] = useInputState("#FFFFFF");

    const theme = useMantineTheme()

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        handlers.setPlayerData(pseudo, color);
    }


    return (
        <>
            <ModalHeaderless
                opened={!values.currentPlayer.lives || values.isOnStart || handlers.testVictory()}
                onClose={handlers.onRetry}
            >
                <Stack>
                    <Text>{(values.isOnStart ? "Welcome to the hangman game !" :
                        (values.currentPlayer.lives !== 0 ? "Congrats, you won !" : ("You lose ! The word was " + values.gameWord)))}
                    </Text>
                    <Group h="100%" align="center">
                        <Button onClick={handlers.onRetry} color="green">
                            {values.isOnStart ? "Start" : "Retry"}
                        </Button>
                        <Link href="/"><Button color="blue">Home</Button></Link>
                    </Group>
                    <Checkbox
                        checked={values.easyMode}
                        onChange={() => handlers.setEasyMode(!values.easyMode)}
                        label="Easy Mode"
                    />
                </Stack>
            </ModalHeaderless>
            <ModalHeaderless opened={!values.isNextPlayerReady} onClose={()=>{}}>
                <Title fz="sm">
                    Is next player ready ?
                </Title>
                <Button onClick={handlers.changeCurrent}>
                    Ready
                </Button>
            </ModalHeaderless>
            <ModalHeaderless
                opened={!values.currentPlayer.pseudo && !values.isOnStart}
                onClose={()=>{}}
            >
                <form onSubmit={onSubmit}>
                <Stack>
                <TextInput value={pseudo} onChange={setPseudo} label="Enter pseudo"/>
                <ColorPicker
                    value={color}
                    onChange={setColor}
                    withPicker={false}
                    swatches={Object.keys(theme.colors).map((key)=>theme.colors[key][5])}
                    fullWidth
                    swatchesPerRow={Object.keys(theme.colors).length}
                />
                <Button type="submit" style={{backgroundColor: color}}>
                    Submit
                </Button>
                </Stack>
                </form>
            </ModalHeaderless>
            <Stack align="center" justify="flex-start">
                <Title color="white">Hangman</Title>
                <Lifebar lives={values.currentPlayer.lives} />
                <Group>
                    <Button onClick={handlers.suicide} color="red">Kill yourself</Button>
                </Group>
                <Word word={values.gameWord} imputedChara={values.currentPlayer.letters} hint={values.easyMode} />
                <Keyboard
                    imputedChar={(values.isNextPlayerReady)?values.currentPlayer.letters:[]}
                    correctChar={values.gameWord.toUpperCase().split('')}
                    onClick={handlers.onClick}
                />
            </Stack>
        </>
    )
}