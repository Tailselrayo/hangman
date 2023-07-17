'use client'
import { Keyboard } from '@/components/Keyboard'
import { Lifebar } from '@/components/Lifebar'
import { ModalHeaderless } from '@/components/ModalHeaderless'
import { PlayerCard } from '@/components/PlayerCard'
import { ProgressionBar } from '@/components/ProgressionBar'
import { Word } from '@/components/Word'
import { useHangman } from '@/hooks/useHangman'
import { Affix, Box, Button, Checkbox, ColorPicker, Group, MantineColor, Modal, SimpleGrid, Stack, Text, TextInput, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { IconHeart, IconHeartBroken, IconHeartFilled } from '@tabler/icons-react'
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
    const [color, setColor] = useInputState("#000000");

    const theme = useMantineTheme()
    const positions = [
        { left: 0, top: 0 },
        { right: 0, top: 0 },
        { left: 0, bottom: 0 },
        { right: 0, bottom: 0 },
    ]
    const nextPlayer = values.playerData[(values.current+1)%props.params.nbPlayer].pseudo;
    // todo: prendre en compte les joueurs ayant terminé

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        handlers.setPlayerData(pseudo, color);
        setPseudo("");
        setColor("#000000")
    }


    return (
        <>
            <ModalHeaderless
                opened={values.isOnStart || handlers.isGameFinished()}
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
            <ModalHeaderless opened={!values.isNextPlayerReady} onClose={() => {}}>
                <Title fz="sm">
                    Is {nextPlayer} ready ?
                </Title>
                <Button onClick={handlers.changeCurrent}>
                    Ready
                </Button>
            </ModalHeaderless>
            <ModalHeaderless
                opened={!values.currentPlayer.pseudo && !values.isOnStart}
                onClose={() => { }}
            >
                <form onSubmit={onSubmit}>
                    <Stack>
                        <TextInput value={pseudo} onChange={setPseudo} label="Enter pseudo" />
                        <ColorPicker
                            value={color}
                            onChange={setColor}
                            withPicker={false}
                            swatches={Object.keys(theme.colors).map((key) => theme.colors[key][5])}
                            fullWidth
                            swatchesPerRow={Object.keys(theme.colors).length}
                        />
                        <Button type="submit" style={{ backgroundColor: color }}>
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
                <Word
                    word={values.gameWord}
                    imputedChara={values.currentPlayer.letters}
                    hint={values.easyMode}
                />
                <Keyboard
                    imputedChar={(values.isNextPlayerReady) ? values.currentPlayer.letters : []}
                    correctChar={values.gameWord.toUpperCase().split('')}
                    onClick={handlers.onClick}
                />

            </Stack>
            {Array.from({ length: props.params.nbPlayer }).map((_, index) => {
                return (
                    <Affix key={index} position={positions[index]}>
                        <PlayerCard
                            {...values.playerData[index]}
                            isCurrent={values.current === index}
                            gameWord={values.gameWord}
                            easyMode={values.easyMode}
                        />
                    </Affix>

                )
            })}
        </>
    )
}