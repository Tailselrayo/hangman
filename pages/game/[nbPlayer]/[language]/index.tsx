'use client'
import { GameModal } from '@/components/GameModal'
import { Keyboard } from '@/components/Keyboard'
import { Lifebar } from '@/components/Lifebar'
import { ModalHeaderless } from '@/components/ModalHeaderless'
import { PlayerCard } from '@/components/PlayerCard'
import { Word } from '@/components/Word'
import { useHangman } from '@/hooks/useHangman'
import { Language } from '@/types/Language'
import { cutSpecialChar } from '@/utils/cutSpecialChar'
import { Affix, Button, ColorPicker, Group, Stack, TextInput, Title, useMantineTheme } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { GetServerSidePropsContext } from 'next'
import { FormEvent } from 'react'

interface GameProps {
    nbPlayer: number;
    language: Language;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const params = context.params;
    const langTab = ["en", "fr", "de", "es"];
    const nbPlayer = parseInt(params?.nbPlayer as string)
    //Verify params gotten are of correct type, go back to home is they're not
    const isNbPlayerNOK = (!params || !params.nbPlayer || Array.isArray(params.nbPlayer) || isNaN(nbPlayer))
    const isLanguageNOK = (!params || !params.language || Array.isArray(params.language) || !langTab.includes(params.language))

    if (isNbPlayerNOK || isLanguageNOK) {
        return ({
            redirect: {
                destination: "/",
                permanent: false,
            }
        })
    }
    if (nbPlayer < 1) {
        return ({
            redirect: {
                destination: `/game/1/${params.language}`,
                permanent: false,
            }
        })
    }
    else if (nbPlayer > 4) {
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
            <GameModal
                playerData={values.playerData}
                nbPlayer={props.nbPlayer}
                opened={(values.isOnStart||handlers.isGameFinished())}
                isOnStart={values.isOnStart}
                word={values.gameWord}
                easyMode={values.easyMode}
                onClose={handlers.onRetry}
                onRestart={handlers.onRetry}
                onChangeEasyMode={handlers.setEasyMode}
            />
            <ModalHeaderless opened={!values.isNextPlayerReady} onClose={() => { }}>
                <Stack align="center">
                    <Title fz="lg">
                        Is {nextPlayer ? nextPlayer : "next player"} ready ?
                    </Title>
                    <Button onClick={handlers.changeCurrent} variant="gradient" gradient={{from:"green",to:"lime"}}>
                        Ready
                    </Button>
                </Stack>
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
                    <Affix key={index} position={positions[index]} zIndex={100}>
                        <PlayerCard
                            {...values.playerData[index]}
                            isCurrent={values.current === index}
                            gameWord={values.gameWord}
                            easyMode={values.easyMode}
                            nbPlayer={props.nbPlayer}
                        />
                    </Affix>

                )
            })}
        </>
    )
}