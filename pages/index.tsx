'use client'
import { Box, Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link'
import { useState } from 'react';

export default function Home() {
  const [opened, modalHandlers] = useDisclosure();
  const [nbSelected, setNbSelected] = useState(0);

  const countries = ["uk", "fr", "es", "de"];

  const onClose = () => {
    setNbSelected(0);
    modalHandlers.close();
  }

  return (
    <Stack align="center" justify="center" bg="dark" h={400}>
      <Modal
        opened={opened && !nbSelected}
        onClose={modalHandlers.close}
        title={<Text fw="bold">Choose a number of players</Text>}
        yOffset={100}
      >
        <Group align="center">
          {
            Array.from({ length: 3 }).map((_, index) => {
              return (
                <Button key={index} onClick={() => setNbSelected(index + 2)} variant="gradient" gradient={{ from: "green", to: "lime" }}>
                  {index + 2} Players
                </Button>
              )
            })
          }
        </Group>
      </Modal>
      <Modal 
        opened={nbSelected!==0} 
        onClose={onClose}
        title={<Text fw="bold">Choose the words' language</Text>}
        yOffset={100}
      >
          
          <Group w="100%" position="center">
            {Array.from({ length: 4 }).map((_, index) => {
              //conidtion in href cause flag url (uk) and data extension (en) don't match
              return (
                <Link key={index} href={`/game/${nbSelected}/${countries[index] === "uk" ? "en" : countries[index]}`}>
                  <Image
                    src={`https://hatscripts.github.io/circle-flags/flags/${countries[index]}.svg`}
                    alt={`${countries[index]} flag`}
                    width={50}
                    height={50}
                    
                  >
                  </Image>
                </Link>
              )
            })}
          </Group>
      </Modal>
      <Title color="gray.2" fz={80}>Hangman</Title>
      <Box h="10%"></Box>
      <Group position="center" w="100%">
        <Button onClick={() => { setNbSelected(1) }} variant="gradient" gradient={{ from: "orange", to: "red" }} size="xl">
          Single Player
        </Button>
        <Box w="5%"></Box>
        <Button onClick={modalHandlers.open} variant="gradient" gradient={{ from: "blue", to: "teal" }} size="xl">
          Multiplayer
        </Button>
      </Group>
    </Stack>
  )
}
