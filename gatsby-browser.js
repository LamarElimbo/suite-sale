import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import React from "react"
import { UserProvider } from "./src/context/UserContext"

export const wrapRootElement = ({ element }) => (
  <UserProvider>{element}</UserProvider>
)