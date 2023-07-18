'use client'
import { Button, Group, Modal, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link'

export default function Home() {
  const [opened, modalHandlers] = useDisclosure();

  return (
    <Stack align="center" justify="space-between" bg="dark">
      <Modal
        opened={opened}
        onClose={modalHandlers.close}
        title={"Choose a number of players"}
      >
        <Group align="center">
          {
            Array.from({ length: 3 }).map((_, index) => {
              return (
                <Link href={`/game/${index+2}`}>
                  <Button variant="gradient" gradient={{from:"green",to:"lime"}}>
                    {index + 2} Players
                  </Button>
                </Link>
              )
            })
          }
        </Group>
      </Modal>
      <Title>Hangman</Title>

      <Group>
        <Link href="/game/1">
          <Button variant="gradient" gradient={{ from: "orange", to: "red" }}>
            Single Player
          </Button>
        </Link>
        <Button onClick={modalHandlers.open} variant="gradient" gradient={{ from: "blue", to: "teal" }}>
          Multiplayer
        </Button>
      </Group>
    </Stack>
  )
}
