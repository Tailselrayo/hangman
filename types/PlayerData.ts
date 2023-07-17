import { MantineColor } from "@mantine/core";

export interface PlayerData {
    lives: number;
    letters: string[];
    pseudo: string;
    color: string;
    hasFinished: number;
}