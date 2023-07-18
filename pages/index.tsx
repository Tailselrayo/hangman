'use client'
import { ModalHeaderless } from '@/components/ModalHeaderless';
import { Button, Group, Modal, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link'
import { useState } from 'react';

export default function Home() {
  const [opened, modalHandlers] = useDisclosure();
  const [nbSelected, setNbSelected] = useState(0);

  const countries = ["uk", "fr", "es", "de"];

  return (
    <Stack align="center" justify="space-between" bg="dark">
      <Modal
        opened={opened && !nbSelected}
        onClose={modalHandlers.close}
        title={"Choose a number of players"}
      >
        <Group align="center">
          {
            Array.from({ length: 3 }).map((_, index) => {
              return (
                <Button key={index} onClick={() => { setNbSelected(index) }} variant="gradient" gradient={{ from: "green", to: "lime" }}>
                  {index + 2} Players
                </Button>
              )
            })
          }
        </Group>
      </Modal>
      <ModalHeaderless opened={nbSelected !== 0} onClose={modalHandlers.close}>
        <Title fz="md">Choose the words' language</Title>
        {Array.from({ length: 4 }).map((_, index) => {
          //conidtion in href cause flag url (uk) and data extension (en) don't match
          return (
            <Link key={index} href={`/game/${nbSelected}/${countries[index]==="uk"?"en":countries[index]}`}>
              <Image
                src={`https://hatscripts.github.io/circle-flags/flags/${countries[index]}.svg`}
                alt={`${countries[index]} flag`}
                width={24}
                height={24}
              >
              </Image>
            </Link>
          )
        })}
      </ModalHeaderless>
      <Title>Hangman</Title>

      <Group>
        <Button onClick={() => { setNbSelected(1) }} variant="gradient" gradient={{ from: "orange", to: "red" }}>
          Single Player
        </Button>
        <Button onClick={modalHandlers.open} variant="gradient" gradient={{ from: "blue", to: "teal" }}>
          Multiplayer
        </Button>
      </Group>
    </Stack>
  )
}
