import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Container, FormLabel, Heading, InputGroup, Link, Select, Text } from "@chakra-ui/react"
import languages from "./languages.json"
import { useEffect, useState } from "react"
import * as srtparser from "srtparsejs"

function App() {
  async function translateText(baseLang, targetLang, text) {
    const req = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${baseLang}&tl=${targetLang}&dt=t&q=${encodeURI(text)}`)
    const resp = await req.json()
    const translated = resp[0][0][0]
    return translated
  }

  async function translateQuoteObject(baseLang, targetLang, quote) {
    const translatedText = await translateText(baseLang, targetLang, quote.text)
    quote.text = translatedText
    quote.id = parseInt(quote.id)
    return quote
  }

  async function translateSrt(srt, baseLang, targetLang) {
    const parsed = srtparser.parse(srt)
    const translatedArr = []
    for (let i = 0; i < parsed.length; i++) {
      let translatedQuote = await translateQuoteObject(baseLang, targetLang, parsed[i])
      translatedArr.push(await translatedQuote)
    }
    const renderedSrt = srtparser.toSrt(translatedArr)
    return renderedSrt
  }

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

  async function handleClick(e) {
    e.preventDefault()
    const srtInput = document.getElementById("srt_file_input")
    console.log(srtInput.value)
    const srtFile = srtInput.files[0]
    const reader = new FileReader()
    reader.readAsText(srtFile, "UTF-8")
    reader.onload = async function (evt) {
      setSrtText(evt.target.result)
      let translatedSrt = await translateSrt(evt.target.result, baseLang, targetLang)
      console.log(await translatedSrt)
      const link = document.createElement("a")
      const file = new Blob(await [translatedSrt], { type: "text/plain" })
      link.href = URL.createObjectURL(await file)
      link.download = `${srtInput.nodeValue}.srt`
      link.click()
      URL.revokeObjectURL(await link.href)
    }
  }
  return (
    <Container maxW="full" h="100dvh" backgroundColor="red.200" display="flex" justifyContent="center" alignItems="center">
      <Card maxW="50rem">
        <CardHeader>
          <Heading marginBottom={2}>Test</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, pariatur? Blanditiis tempora autem magnam reiciendis voluptas molestiae harum,
            ipsam aspernatur consectetur sint ad illum illo nulla impedit sed natus inventore aperiam necessitatibus ratione cumque quas cupiditate magni
            placeat. Nihil ducimus amet, facere cum nesciunt consequuntur!
          </Text>
        </CardHeader>
        <CardBody>
          <Box display="flex" marginBottom={4}>
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
            <input accept=".srt" type="file" name="srt_file_input" id="srt_file_input" />
            <Button onClick={(e) => handleClick(e)}>Translate Srt File</Button>
          </InputGroup>
          <Box id="download_link_container"></Box>
        </CardBody>
        <CardFooter>
          <Link display="flex" justifyContent="center" alignItems="center" href="https://github.com/bora-sen" fontWeight="bold" colorScheme="teal">
            <Avatar width={12} height={12} marginRight={1} name="Bora Şen" src="https://github.com/bora-sen.png" />
            @github
          </Link>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default App
