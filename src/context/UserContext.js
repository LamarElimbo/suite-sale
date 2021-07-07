import React, { useContext, useState, useEffect } from "react"
import { firebase, auth, firestore } from "../components/firebase"

const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {
  const [userAuth, setUserAuth] = useState()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password, apartment) {
    return auth.createUserWithEmailAndPassword(email, password).then((response) => {
      if (response.user.uid) {
        firestore
          .collection('users')
          .doc(response.user.uid)
          .set({
            id: response.user.uid,
            email: email,
            apartment: apartment,
            itemsInProgress: [],
            itemsPosted: [],
            itemsPurchased: [],
            itemsSaved: []
          })
      }
    })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function deleteAccount() {
    return auth.delete()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return userAuth.updateEmail(email)
  }

  function updatePassword(password) {
    return userAuth.updatePassword(password)
  }

  async function getUserDocument(userAuth) {
    if (!userAuth?.uid) return null;
    try {
      const userDocument = await firestore
        .collection('users')
        .doc(userAuth.uid)
        .get()
      setUserData(userDocument.data())
    } catch (error) {
      console.log("Error fetching user", error)
    }
  }

  function updateUserItems(action, array, itemId) {
    var userDoc = firestore.collection('users').doc(userAuth.uid)

    if (action === "add") {
      switch (array) {
        default:
          return null
        case 'itemsInProgress':
          userDoc.update({ itemsInProgress: firebase.firestore.FieldValue.arrayUnion(itemId) })
          break
        case 'itemsPosted':
          userDoc.update({ itemsPosted: firebase.firestore.FieldValue.arrayUnion(itemId) })
          break
        case 'itemsPurchased':
          userDoc.update({ itemsPurchased: firebase.firestore.FieldValue.arrayUnion(itemId) })
          break
        case 'itemsSaved':
          userDoc.update({ itemsSaved: firebase.firestore.FieldValue.arrayUnion(itemId) })
          break
      }
    } else {
      switch (array) {
        default:
          return null
        case 'itemsInProgress':
          userDoc.update({ itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemId) })
          break
        case 'itemsSaved':
          userDoc.update({ itemsSaved: firebase.firestore.FieldValue.arrayRemove(itemId) })
          break
      }
    }

      getUserDocument(userAuth)
    }

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(userAuth => {
        setUserAuth(userAuth)
        getUserDocument(userAuth)
        setLoading(false)
      })

      return unsubscribe
    }, [])

    const value = {
      userAuth,
      userData,
      login,
      deleteAccount,
      signup,
      logout,
      resetPassword,
      updateEmail,
      updatePassword,
      updateUserItems
    }

    return (
      <UserContext.Provider value={value}>
        {!loading && children}
      </UserContext.Provider>
    )
  }