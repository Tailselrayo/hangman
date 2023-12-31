import { cutSpecialChar } from "@/utils/cutSpecialChar";
import { Group, Title } from "@mantine/core";

interface WordProps {
    word: string;
    imputedChara: string[];
    hint: boolean;
    isUI?: boolean;
}

export function Word(props: WordProps) {
    const wordTab = cutSpecialChar(props.word).toUpperCase().split('');

    return (
        <Group align="center">
            {wordTab.map((elem, index) => {
                if (props.imputedChara.includes(elem) || (props.hint && index === 0)) {
                    return (
                        <Title key={index} fz={40} color="white">{props.word.charAt(index).toUpperCase()}</Title>
                    )
                }
                else {
                    return (
                        <Title key={index} fz={40} color="white">_</Title>
                    )
                }
            }
            )}
        </Group>
    )
}