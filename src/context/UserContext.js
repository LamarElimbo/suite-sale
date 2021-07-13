import React, { useContext, useState, useEffect } from "react"
import { firebase, auth, firestore } from "../components/firebase"

const UserContext = React.createContext()

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }) {
  const [userAuth, setUserAuth] = useState(null)
  const [userData, setUserData] = useState(null)
  const [allItems, setAllItems] = useState(null)
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
            itemsSaved: [],
            notifications: []
          })
      }
    })
  }

  const login = (email, password) => auth.signInWithEmailAndPassword(email, password)

  const logout = () => auth.signOut()

  const deleteAccount = () => auth.delete()

  const resetPassword = email => auth.sendPasswordResetEmail(email)

  const updateEmail = email => userAuth.updateEmail(email)

  const updatePassword = password => userAuth.updatePassword(password)

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
        case 'sellerNotifications':
          userDoc.update({
            notifications: firebase.firestore.FieldValue.arrayRemove({
              message: "You have a buyer!",
              itemId
            })
          })
          break
        case 'buyerNotifications':
          userDoc.update({
            notifications: firebase.firestore.FieldValue.arrayRemove({
              message: "Your order has been confirmed!",
              itemId
            })
          })
          break
      }
    }
    getUserDocument(userAuth)
  }

  const getAllItems = async () => {
    try {
      console.log('getting all items')
      await firestore
        .collection("items")
        .get()
        .then(items => {
          let itemDocs = []
          items.forEach(item => itemDocs.push(item.data()))
          return itemDocs
        })
        .then(itemDocs => setAllItems(itemDocs))
    } catch (error) {
      console.log("Error getting all documents: ", error)
    }
  }

  useEffect(() => {
    if (!firebase) return;

    // once your firebase is instanced, use it.
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      setUserAuth(userAuth)
      getUserDocument(userAuth)
      getAllItems()
      setLoading(false)
    })

    return unsubscribe
}, []);

const value = {
  userAuth,
  userData,
  allItems,
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