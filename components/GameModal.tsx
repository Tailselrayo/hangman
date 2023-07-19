import { PlayerData } from "@/types/PlayerData";
import { Stack, Button, Checkbox, Text, List, Title, Flex } from "@mantine/core";
import Link from "next/link";
import { ModalHeaderless } from "./ModalHeaderless";

interface GameModalProps {
    playerData: PlayerData[]
    nbPlayer: number;
    opened: boolean;
    isOnStart: boolean;
    easyMode: boolean;
    word: string;
    onClose: () => void;
    onRestart: () => void;
    onChangeEasyMode: (isOnEasy: boolean) => void;
}

export function GameModal(props: GameModalProps) {
    return (
        <ModalHeaderless
            opened={props.opened}
            onClose={props.onClose}
        >
            <Flex
                justify="space-between"
                direction={(props.nbPlayer===1||props.isOnStart)?"column":"row"}
                gap="md"
            >
                
                    {(props.isOnStart ? <Text>Welcome to the hangman game !</Text> :
                        (props.nbPlayer === 1) ?
                            <Text>{
                                (props.playerData[0].lives !== 0) ? "Congrats, you won !" : ("You lose ! The word was " + props.word)
                            }</Text> :
                            <Stack>
                                <Title fz="lg" ta="center">The word was {props.word}</Title>
                                <List listStyleType="none" w="50%">
                                    {
                                        props.playerData.slice().sort((a, b) => a.hasFinished - b.hasFinished).map((elem) => {
                                            return (
                                                <List.Item key={elem.hasFinished}>
                                                    <Text ta="center" fw="bold" fz="md" color={(elem.hasFinished === 1) ? "yellow.7" : "dark"}>
                                                        #{elem.hasFinished} {elem.pseudo}
                                                    </Text>
                                                </List.Item>
                                            )
                                        })
                                    }
                                </List>
                            </Stack>)}
                    <Stack justify="center">
                        <Stack justify="center">
                            <Button onClick={props.onRestart} color="green">
                                {props.isOnStart ? "Start" : "Retry"}
                            </Button>
                            <Link href="/"><Button w="100%" color="blue">Home</Button></Link>
                        </Stack>
                        <Checkbox
                            checked={props.easyMode}
                            onChange={() => props.onChangeEasyMode(!props.easyMode)}
                            label="Easy Mode"
                        />
                    </Stack>
            </Flex>
        </ModalHeaderless>
    )
}