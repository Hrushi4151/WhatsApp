import "@/styles/globals.css";
import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";

export default function App({ Component, pageProps }) {
  return <>
    <StateProvider initialState={initialState} reducer={reducer}>

  <Component {...pageProps} />

  </StateProvider>
  </>
  
}
