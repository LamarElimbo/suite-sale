import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import "@fontsource/rubik/400.css"
import "@fontsource/rubik/700.css"

import React from "react"
import { UserProvider } from "./src/context/UserContext"

export const wrapRootElement = ({ element }) => <UserProvider>{element}</UserProvider>