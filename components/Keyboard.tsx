import { Button, SimpleGrid } from "@mantine/core";

interface KeyboardProps {
    imputedChar: string[];
    correctChar: string[];
    onFail: (letter: string) => void;
    onSuccess: (letter: string) => void;
}

export function Keyboard(props: KeyboardProps) {

    const unUsed = { from: "dark", to: "gray" };
    const rightChar = { from: "lime", to: "green" };
    const wrongChar = { from: "red", to: "red.8" };

    const onClick = (letter: string) => {
        if (props.imputedChar.includes(letter)) {
            return;
        }
        if (props.correctChar.includes(letter)) {
            props.onSuccess(letter);
        }
        else {
            props.onFail(letter);
        }

    }

    return (
        <SimpleGrid cols={10}>
            {Array.from({ length: 26 }).map((_, index) => {
                const letter = String.fromCharCode('A'.charCodeAt(0) + index);
                return (
                    <Button
                        key={index}
                        onClick={() => onClick(letter)}
                        variant="gradient"
                        gradient={props.imputedChar.includes(letter) ?
                            (props.correctChar.includes(letter) ? rightChar : wrongChar) :
                            unUsed}
                    >
                        {letter}
                    </Button>
                )
            })}
        </SimpleGrid>
    )
}