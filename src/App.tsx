import { Container, Flex, NativeSelect, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Provider } from "./components/ui/provider"
import { CURRENCIES } from "./constants"

type CoinData = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string // ISO 8601 datetime string
  atl: number
  atl_change_percentage: number
  atl_date: string // ISO 8601 datetime string
  roi: null // adjust to appropriate type if ROI is ever not null
  last_updated: string // ISO 8601 datetime string
}

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState("")

  const [coinData, setCoinData] = useState<CoinData | undefined>(undefined)

  const fetchCoinData = async () => {
    if (!selectedCurrency) return

    const url = `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}&ids=sei-network`
    const options = {
      method: "GET",
      headers: { accept: "application/json", "x-cg-pro-api-key": "CG-14z8KdXsNvQ6vkSpKG7YtDAv" },
    }
    fetch(url, options)
      .then((res) => res.json())
      .then((json: CoinData[]) => {
        setCoinData(json[0])
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    const interval = 5 * 1000 // 5 seconds
    fetchCoinData()
    const inter = setInterval(() => {
      fetchCoinData()
    }, interval)

    return () => {
      clearInterval(inter)
    }
  }, [selectedCurrency])

  return (
    <Provider>
      <Container mt="4">
        <Text fontSize="xl">Select Currency to compare with SEI</Text>

        <NativeSelect.Root>
          <NativeSelect.Field onChange={(e) => setSelectedCurrency(e.currentTarget.value)}>
            {CURRENCIES.map((currency) => {
              return (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              )
            })}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {selectedCurrency && coinData && (
          <>
            <Text fontSize="xl" mt="4">
              Selected Currency: {selectedCurrency}
            </Text>

            <Flex direction="row" gap="4" alignItems="center">
              <Text p="2" bgColor={coinData.price_change_24h > 0 ? "green.200" : "red.200"}>
                Price 24h: {coinData?.price_change_24h}
              </Text>
              <Text>
                Price in {selectedCurrency}: {coinData?.current_price} {selectedCurrency}
              </Text>
            </Flex>
          </>
        )}
      </Container>
    </Provider>
  )
}

export default App
