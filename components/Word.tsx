import { Group, Title } from "@mantine/core";

interface WordProps {
    word: string;
    imputedChara: string[];
    hint: boolean;
}

export function Word(props: WordProps) {
    const wordTab = props.word.toUpperCase().split('');

    return (
        <Group align="center">
            {wordTab.map((elem, index) => {
                if (props.imputedChara.includes(elem)||(props.hint&&index===0)) {
                    return (
                    <Title key={index} fz={40}>{elem}</Title>
                )
                    }
                else {
                    return (
                        <Title key={index}>_</Title>
                    )
                }
                }
            )}
        </Group>
    )
}