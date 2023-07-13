import { SimpleGrid } from "@mantine/core"
import {  IconHeart, IconHeartBroken } from "@tabler/icons-react";



interface LifebarProps {
    lives: number
}

export function Lifebar(props: LifebarProps) {

    return(
        <SimpleGrid cols={3}>
            {Array.from({length: 6}).map((_, index) => {
                if (index<props.lives) {
                    return <IconHeart color="red" key={index}/>
                }
                else {
                    return <IconHeartBroken color="cyan" key={index}/>
                }
            })}
        </SimpleGrid>
    )
}