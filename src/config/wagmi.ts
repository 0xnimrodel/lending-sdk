import { http, createConfig } from '@wagmi/core'
import { linea } from '@wagmi/core/chains'

export const wagmiConfig = createConfig({
  chains: [linea],
  transports: {
    [linea.id]: http('https://rpc.linea.build'),
  },
})
