'use client'
import { Keyboard } from '@/components/Keyboard'
import { Lifebar } from '@/components/Lifebar'
import { ModalHeaderless } from '@/components/ModalHeaderless'
import { PlayerCard } from '@/components/PlayerCard'
import { Word } from '@/components/Word'
import { useHangman } from '@/hooks/useHangman'
import { Language } from '@/types/Language'
import { cutSpecialChar } from '@/utils/cutSpecialChar'
import { Affix, Button, Checkbox, ColorPicker, Group, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { FormEvent} from 'react'

interface GameProps {
    nbPlayer: number;
    language: Language;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const params = context.params;
    const langTab = ["en","fr","de","es"];
    const nbPlayer = parseInt(params?.nbPlayer as string)
    //Verify params gotten are of correct type, go back to home is they're not
    const isNbPlayerNOK = (!params||!params.nbPlayer||Array.isArray(params.nbPlayer)||isNaN(nbPlayer))
    const isLanguageNOK = (!params||!params.language||Array.isArray(params.language)||!langTab.includes(params.language))

    if (isNbPlayerNOK||isLanguageNOK) {
        return ({
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            })
    }
    if (nbPlayer<1) {
        return ({
            redirect: {
                destination: `/game/1/${params.language}`,
                permanent: false,
            }
        })
    }
    else if (nbPlayer>4) {
        return ({
            redirect: {
                destination: `/game/4/${params.language}`,
                permanent: false,
            }
        })
    }
    return ({
        props: {
            nbPlayer: nbPlayer,
            language: params.language,
        }
    })
}

export default function Game(props: GameProps) {
    const { values, handlers } = useHangman(props.nbPlayer, props.language);
    const [pseudo, setPseudo] = useInputState("");
    const [color, setColor] = useInputState("#000000");

    const theme = useMantineTheme()
    const positions = [
        { left: 0, top: 0 },
        { right: 0, top: 0 },
        { left: 0, bottom: 0 },
        { right: 0, bottom: 0 },
    ]
    const nextPlayer = values.playerData[handlers.computeNext()].pseudo;
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
                    Is {nextPlayer?nextPlayer:"next player"} ready ?
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
                    correctChar={cutSpecialChar(values.gameWord).toUpperCase().split('')}
                    onClick={handlers.onClick}
                />

            </Stack>
            {Array.from({ length: props.nbPlayer }).map((_, index) => {
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