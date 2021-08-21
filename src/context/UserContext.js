import React, { useContext, useState, useEffect } from "react"
import { navigate } from "gatsby"
import { firebase, auth, firestore } from "../components/firebase"

const UserContext = React.createContext()

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }) {
  const [userAuth, setUserAuth] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [windowCheck, setWindowCheck] = useState(false)

  async function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password).then((response) => {
      if (response.user.uid) {
        firestore
          .collection('users')
          .doc(response.user.uid)
          .set({
            id: response.user.uid,
            email: email,
            suite: "",
            itemsInProgress: [],
            itemsPosted: [],
            itemsPurchased: [],
            itemsSaved: [],
            notifyMethod: { "by": "email", "at": "" },
            acceptedPaymentMethods: [],
            notifications: [],
          })
      }
    })
  }

  const login = (email, password) => auth.signInWithEmailAndPassword(email, password)

  const reauthenticateUser = (password, action, email) => {
    const user = firebase.auth().currentUser;

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credentials = firebase.auth.EmailAuthProvider.credential(userAuth.email, password)
    user.reauthenticateWithCredential(credentials).then(() => {
      // User re-authenticated.
      switch (action) {
        case 'password':
          updatePassword(password).then((result) => console.log(result))
          break
        case 'email':
          updateEmail(email).then((result) => console.log(result))
          break
        default:
          return null
      }
      return 'success'
    }).catch((error) => {
      // An error ocurred
      return 'error'
    });
  }

  const logout = () => {
    auth.signOut()
    setUserData(null)
  }

  const deleteAccount = () => {
    firestore.collection('users').doc(userAuth.uid).delete()
    auth.currentUser.delete().then(() => {if (typeof window !== 'undefined') navigate('/')})
    setUserData(null)
  }

  const updateEmail = email => {
    userAuth.updateEmail(email)
    firestore.collection('users').doc(userAuth.uid).update({ email })
  }

  const updatePassword = password => {
    const user = firebase.auth().currentUser
    user.updatePassword(password)
      .then(() => { return 'success' })
      .catch(() => { return 'error' })
  }

  const addSuite = suite => {
    firestore.collection('users').doc(userAuth.uid).update({ suite })
    setUserData(prevState => ({ ...prevState, suite }))
  }

  const updateNotificationMethod = (by, at) => {
    firestore.collection('users').doc(userAuth.uid).update({ notifyMethod: { "by": by, "at": at } })
    setUserData(prevState => ({ ...prevState, notifyMethod: { "by": by, "at": at } }))
  }

  const updateAcceptedPaymentMethods = acceptedPaymentMethods => {
    firestore.collection('users').doc(userAuth.uid).update({ acceptedPaymentMethods })
    setUserData(prevState => ({ ...prevState, acceptedPaymentMethods }))
  }

  const getUserDocument = async (userAuth) => {
    if (!userAuth?.uid) return null;
    try {
      const userDocument = await firestore.collection('users').doc(userAuth.uid).get()
      setUserData(userDocument.data())
    } catch (error) {
      console.log("Error fetching user", error)
    }
  }

  const updateUserItems = (action, array, itemId, userId = userAuth.uid) => {
    var userDoc = firestore.collection('users').doc(userId)

    if (action === "add") {
      switch (array) {
        default:
          return null
        case 'itemsInProgress':
          userDoc.update({ itemsInProgress: firebase.firestore.FieldValue.arrayUnion(itemId) })
          setUserData(prevState => ({ ...prevState, itemsInProgress: [...prevState.itemsInProgress, itemId] }))
          break
        case 'itemsPosted':
          userDoc.update({ itemsPosted: firebase.firestore.FieldValue.arrayUnion(itemId) })
          setUserData(prevState => ({ ...prevState, itemsPosted: [...prevState.itemsPosted, itemId] }))
          break
        case 'itemsPurchased':
          userDoc.update({ itemsPurchased: firebase.firestore.FieldValue.arrayUnion(itemId) })
          setUserData(prevState => ({ ...prevState, itemsPurchased: [...prevState.itemsPurchased, itemId] }))
          break
        case 'itemsSaved':
          userDoc.update({ itemsSaved: firebase.firestore.FieldValue.arrayUnion(itemId) })
          setUserData(prevState => ({ ...prevState, itemsSaved: [...prevState.itemsSaved, itemId] }))
          break
      }
    } else {
      switch (array) {
        default:
          return null
        case 'itemsInProgress':
          userDoc.update({ itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemId) })
          setUserData(prevState => ({ ...prevState, itemsInProgress: prevState.itemsInProgress.filter(item => item !== itemId) }))
          break
        case 'itemsSaved':
          userDoc.update({ itemsSaved: firebase.firestore.FieldValue.arrayRemove(itemId) })
          setUserData(prevState => ({ ...prevState, itemsSaved: prevState.itemsSaved.filter(item => item !== itemId) }))
          break
        case 'newOrderNotification':
          userDoc.update({ notifications: firebase.firestore.FieldValue.arrayRemove({ message: "You have a new buyer", itemId }) })
          setUserData(prevState => ({ ...prevState, notifications: prevState.notifications.filter(notification => notification !== { message: "You have a buyer", itemId }) }))
          break
        case 'orderConfirmationNotification':
          userDoc.update({ notifications: firebase.firestore.FieldValue.arrayRemove({ message: "Your order has been confirmed", itemId }) })
          setUserData(prevState => ({ ...prevState, notifications: prevState.notifications.filter(notification => notification !== { message: "Your order has been confirmed", itemId }) }))
          break
        case 'orderCancellationNotification':
          userDoc.update({ notifications: firebase.firestore.FieldValue.arrayRemove({ message: "Your order has been cancelled", itemId }) })
          setUserData(prevState => ({ ...prevState, notifications: prevState.notifications.filter(notification => notification !== { message: "Your order has been cancelled", itemId }) }))
          break
      }
    }
  }

  useEffect(() => {
    if (!windowCheck) {
      setUserAuth(false)
      setUserData({
        id: "",
        email: "",
        suite: "",
        itemsInProgress: [],
        itemsPosted: [],
        itemsPurchased: [],
        itemsSaved: [],
        notifications: []
      })
    };

    // once your firebase is instanced, use it.
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      setUserAuth(userAuth)
      getUserDocument(userAuth)
      setLoading(false)
    })

    return unsubscribe
  }, [windowCheck]);

  useEffect(() => {
    if (typeof window !== 'undefined') { setWindowCheck(true) }
  })

  const value = {
    userAuth,
    userData,
    login,
    reauthenticateUser,
    deleteAccount,
    signup,
    logout,
    addSuite,
    updateNotificationMethod,
    updateAcceptedPaymentMethods,
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