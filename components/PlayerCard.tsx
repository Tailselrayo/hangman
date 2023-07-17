import { PlayerData } from "@/types/PlayerData";
import { Stack, Title, Group, Text, useMantineTheme } from "@mantine/core";
import { IconHeart, IconHeartBroken } from "@tabler/icons-react";
import { ProgressionBar } from "./ProgressionBar";

interface PlayerCardProps extends PlayerData {
    isCurrent: boolean;
    gameWord: string;
    easyMode: boolean;
}

export function PlayerCard(props: PlayerCardProps) {
    const theme = useMantineTheme()

    return (
        <Stack

            px="sm"
            style={{
                borderColor: props.isCurrent ? theme.colors["yellow"][5] : undefined,
                borderWidth: 2,
                borderStyle: "solid",
                borderRadius: theme.radius.lg,
            }}
        >
            <Title ta="center" fz="lg" color="white">{props.pseudo}</Title>
            <ProgressionBar
                word={props.gameWord}
                imputedChara={props.letters}
                hint={props.easyMode}
                color={props.color}
            />
            <Group position="apart">
                <Group>
                    {props.lives ?
                        <>
                            <IconHeart fill="red" color="red" />
                            <Text>{` x${props.lives}`}</Text>
                        </> :
                        <IconHeartBroken color="cyan" />}
                </Group>
                <Title ta="right" color="white">{props.hasFinished?`#${props.hasFinished}`:"#0"}</Title>
            </Group>
        </Stack>
    )
}