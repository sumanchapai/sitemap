import {Container, Text, ThemeProvider, studioTheme} from '@sanity/ui'
import {useClient} from 'sanity'

export default function Tool() {
  return (
    <ThemeProvider theme={studioTheme}>
      <Container width={4}>
        <Text size={2}>Goo1</Text>
        <Sitemap />
      </Container>
    </ThemeProvider>
  )
}

function Sitemap() {
  const client = useClient()
  return (
    <div>
      Client <div>{JSON.stringify(client, null, 2)}</div>
    </div>
  )
}
