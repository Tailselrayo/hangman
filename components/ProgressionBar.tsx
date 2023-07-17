import { Group, Title } from "@mantine/core";
import { IconSquare, IconSquareCheckFilled } from "@tabler/icons-react";

interface ProgressionBarProps {
    word: string;
    imputedChara: string[];
    hint: boolean;
    color: string;
}

export function ProgressionBar(props: ProgressionBarProps) {
    const wordTab = props.word.toUpperCase().split('');

    return (
        <Group align="center" spacing="xs">
            {wordTab.map((elem, index) => {
                if (props.imputedChara.includes(elem) || (props.hint && index === 0)) {
                    return (
                        <IconSquareCheckFilled key={index} style={{color: props.color}}/>
                    )
                }
                else {
                    return (
                        <IconSquare key={index}/>
                    )
                }
            }
            )}
        </Group>
    )
}