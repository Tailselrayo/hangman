'use client'
import { Button, Stack, Title } from '@mantine/core'
import Link from 'next/link'

export default function Home() {

  return (
    <Stack align="center" justify="space-between" bg="dark">
      <Title>Hangman</Title>
      <Link href="/game">
        <Button variant="gradient" gradient={{from:"orange",to:"red"}}>
          Start
        </Button>
      </Link>
    </Stack>
  )
}
