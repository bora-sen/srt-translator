import { Box, Button, Card, CardBody, CardFooter, CardHeader, Container, FormLabel, Heading, Image, InputGroup, Link, Select, Text } from "@chakra-ui/react"
import languages from "./languages.json"
import { useEffect, useState } from "react"

function App() {
  const [srtText, setSrtText] = useState("")
  const [baseLang, setBaseLang] = useState("")
  const [targetLang, setTargetLang] = useState("")

  function getCodeFromLanguage(lang) {
    return languages.find((item) => {
      return item.Language === lang
    }).code
  }
  useEffect(() => {
    console.log("Base Language is Set To => ", baseLang)
  }, [baseLang])

  useEffect(() => {
    console.log("Base Language is Set To => ", targetLang)
  }, [targetLang])

  function handleClick(e) {
    e.preventDefault()
    const srtInput = document.getElementById("srt_file_input")
    const srtFile = srtInput.files[0]
    const reader = new FileReader()
    reader.readAsText(srtFile, "UTF-8")
    reader.onload = function (evt) {
      console.log(evt.target.result)
      setSrtText(evt.target.result)
    }
  }
  return (
    <Container maxW="full" h="100dvh" backgroundColor="red.200" display="flex" justifyContent="center" alignItems="center">
      <Card maxW="50rem">
        <CardHeader>
          <Heading>Test</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, pariatur? Blanditiis tempora autem magnam reiciendis voluptas molestiae harum,
            ipsam aspernatur consectetur sint ad illum illo nulla impedit sed natus inventore aperiam necessitatibus ratione cumque quas cupiditate magni
            placeat. Nihil ducimus amet, facere cum nesciunt consequuntur!
          </Text>
        </CardHeader>
        <CardBody>
          <Image src="https://loremflickr.com/1280/720" />
          <Box display="flex" marginY={3}>
            <Box>
              <FormLabel>Select Base Language</FormLabel>
              <Select onChange={(e) => setBaseLang(getCodeFromLanguage(e.target.value))} name="base_language_select" placeholder="Base Language">
                {languages.map((language, index) => {
                  return <option key={index}>{language.Language}</option>
                })}
              </Select>
            </Box>
            <Box>
              <FormLabel>Select Target Language</FormLabel>
              <Select onChange={(e) => setTargetLang(getCodeFromLanguage(e.target.value))} name="target_language_select" placeholder="Target Language">
                {languages.map((language, index) => {
                  return <option key={index}>{language.Language}</option>
                })}
              </Select>
            </Box>
          </Box>
          <InputGroup display="grid" gap={3}>
            <input type="file" name="srt_file_input" id="srt_file_input" />
            <Button onClick={(e) => handleClick(e)}>Translate Srt File</Button>
          </InputGroup>
        </CardBody>
        <CardFooter>
          <Link href="https://github.com/bora-sen" fontWeight="bold" colorScheme="teal">
            @github
          </Link>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default App
