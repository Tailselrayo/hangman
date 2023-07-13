import { Button, SimpleGrid } from "@mantine/core";

interface KeyboardProps {
    imputedChar: string[];
    correctChar: string[];
    onClick: (letter: string) => void;
}

export function Keyboard(props: KeyboardProps) {

    const unUsed = { from: "dark", to: "gray" };
    const rightChar = { from: "lime", to: "green" };
    const wrongChar = { from: "red", to: "red.8" };

    return (
        <SimpleGrid cols={10}>
            {Array.from({ length: 26 }).map((_, index) => {
                const letter = String.fromCharCode('A'.charCodeAt(0) + index);
                return (
                    <Button
                        key={index}
                        onClick={() => props.onClick(letter)}
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