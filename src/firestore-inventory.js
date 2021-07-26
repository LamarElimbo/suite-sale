/*
import { firebase, auth, firestore } from "../components/firebase"


service cloud.firestore {
  match /databases/{database}/documents {
    // A read rule can be divided into get and list rules
    match /users/{document=**} {
      // Applies to single document read requests
      allow get: if <condition>;

      // Applies to queries and collection read requests
      allow list: if <condition>;
    }

    // A write rule can be divided into create, update, and delete rules
    match /users/{document=**} {
      // Applies to writes to nonexistent documents
      allow create: if <condition>;

      // Applies to writes to existing documents
      allow update: if <condition>;

      // Applies to delete operations
      allow delete: if <condition>;
    }

    // A read rule can be divided into get and list rules
    match /items/{document=**} {
      // Applies to single document read requests
      allow get: if <condition>;

      // Applies to queries and collection read requests
      allow list: if <condition>;
    }

    // A write rule can be divided into create, update, and delete rules
    match /items/{document=**} {
      // Applies to writes to nonexistent documents
      allow create: if <condition>;

      // Applies to writes to existing documents
      allow update: if <condition>;

      // Applies to delete operations
      allow delete: if <condition>;
    }
  }
}





match /users/{doc=**} {
    allow read: if request.auth.uid == request.resource.data.id
    allow create: if request.auth.uid == request.resource.data.id
    allow update: if request.auth != null
    allow delete: if request.auth != null && request.auth.uid == request.resource.data.seller
}


match /items/{doc=**} {
    allow read
    allow create: if request.auth.uid == request.resource.data.id
    allow update: if request.auth != null
    allow delete: if request.auth != null && request.auth.uid == request.auth.id
}

// allow read (get) to users: if user is signed in && if request.auth.uid == user.id
// allow read (get) to users: if user is signed in && if request.auth.uid == either buyer or seller
        allow read: if request.auth.uid == request.resource.data.id

// allow write (create) to users: if user is signed in
        allow create: if request.auth.uid == request.resource.data.id

// allow write (update) to users: if user is signed in
// allow write (update) to users: if user is signed in
// allow write (update) to users: if user is signed in
// allow write (update) to users: if user is signed in && if request.auth.uid == either buyer or seller
// allow write (update) to users: if user is signed in && if request.auth.uid == either buyer or seller
        allow update: if request.auth != null

// allow write (delete) to users: if user is signed in && if request.auth.uid == user.id
        allow delete: if request.auth != null && request.auth.uid == request.auth.id



allow read;
// allow write (create) to items: if user is signed in
        allow create: if request.auth != null

// allow write (update) to items: if user is signed in
// allow write (update) to items: if user is signed in && if transactionData.status === 'Awaiting Meetup' && if auth.user === either buyer or seller
// allow write (update) to items: if user is signed in && if request.auth.uid == seller
// allow write (update) to items: if user is signed in && if request.auth.uid == either buyer or seller
        allow update: if request.auth != null

// allow write (delete) to items: if user is signed in && if request.auth.uid == seller
        allow delete: 
            if request.auth != null &&
                request.auth.uid == request.resource.data.seller








export function UserProvider({ children }) {

    async function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password).then((response) => {
            if (response.user.uid) {
                // allow write (create) to users: if user is signed in
                firestore.collection('users').doc(response.user.uid)
                    .set({ id: response.user.uid, email: email, suite: "", itemsInProgress: [], itemsPosted: [], itemsPurchased: [], itemsSaved: [], notifications: [] })
            }
        })
    }

    // allow write (update) to users: if user is signed in && if auth.user === user.id
    const addSuite = (suite, userId) => firestore.collection('users').doc(userId).update({ suite })

    // allow write (delete) to users: if user is signed in && if auth.user === user.id
    firestore.collection('users').doc(userAuth.uid).delete()

    // allow read (get) to users: if user is signed in && if auth.user === user.id
    const getUserDocument = async (userAuth) => {
        if (!userAuth?.uid) return null;
        const userDocument = firestore.collection('users').doc(userAuth.uid).get()
    }

    // allow write (update) to users: if user is signed in
    const updateUserItems = (action, array, itemId, userId = userAuth.uid) => {
        var userDoc = firestore.collection('users').doc(userId)

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
                    userDoc.update({ notifications: firebase.firestore.FieldValue.arrayRemove({ message: "You have a buyer", itemId }) })
                    break
                case 'buyerNotifications':
                    userDoc.update({ notifications: firebase.firestore.FieldValue.arrayRemove({ message: "Your order has been confirmed", itemId }) })
                    break
            }
        }
    }

    // allow read (list)
    const getAllItems = async () => firestore.collection("items").get()

    const createItem = (updatedItemData) => {
        // allow write (create) to items: if user is signed in
        firestore
            .collection("items")
            .add({ seller: updatedItemData.seller, item: updatedItemData.item, cost: updatedItemData.cost, itemNotes: updatedItemData.itemNotes, tags: updatedItemData.tags, pickUp: updatedItemData.pickUp, dropOff: updatedItemData.dropOff, lobby: updatedItemData.lobby })
            .then((itemDoc) => {
                if (typeof updatedItemData === 'object') {
                    imgStorage.child(`${itemDoc.id}/1`).put(updatedItemData.photo1).then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((downloadURL) => {
                            const data = updatedItemData.photo1 ? downloadURL : ""
                            // allow write (update) to items: if user is signed in
                            firestore.collection("items").doc(itemDoc.id).update({ photo1: data })
                                .then(() => navigate('/', { state: { message: "item-create" } }))
                        });
                    })
                }

                if (typeof updatedItemData === 'object') {
                    imgStorage.child(`${itemDoc.id}/2`).put(updatedItemData.photo2).then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((downloadURL) => {
                            const data = updatedItemData.photo2 ? downloadURL : ""
                            firestore.collection("items").doc(itemDoc.id).update({ photo2: data })
                        });
                    })
                }

                if (typeof updatedItemData === 'object') {
                    imgStorage.child(`${itemDoc.id}/3`).put(updatedItemData.photo3).then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((downloadURL) => {
                            const data = updatedItemData.photo3 ? downloadURL : ""
                            firestore.collection("items").doc(itemDoc.id).update({ photo3: data })
                        });
                    })
                }
                updateUserItems('add', 'itemsPosted', itemDoc.id)
            })
            .catch(error => console.log("Error creating a new item: ", error))
    }

    // allow write (update) to items: if user is signed in && if transactionData.status === 'Awaiting Meetup' && if auth.user === either buyer or seller
    if (itemData.transactionData?.status === 'Awaiting Meetup') {
        if (today.getDate() > deliveryDate.getDate()) {
            firestore
                .collection("items")
                .doc(itemData.itemId)
                .update({ "transactionData.status": "Complete" })
                .catch(error => console.log("Error marking item status to complete: ", error))
        }
    }

    // allow write (update) to items: if user is signed in && if auth.user === seller
    const handleSubmit = (updatedItemData) => {
        firestore
            .collection("items")
            .doc(itemData.itemId)
            .update(updatedItemData)
            .then(() => navigate('/', { state: { message: "item-update" } }))
            .catch(error => console.log("Error updating item data: ", error))
    }

    // allow write (delete) to items: if user is signed in && if auth.user === seller
    const deleteItem = () => firestore.collection("items").doc(itemData.itemId).delete().then(() => navigate('/', { state: { message: "item-delete" } }))

    // allow write (update) to users: if user is signed in && if auth.user === either buyer or seller
    const cancelOrder = () => {
        let currentUserIsThe = (userData?.id === itemData.seller) ? 'seller' : 'buyer'
        let notCurrentUserId = (userData?.id === itemData.seller) ? itemData.transactionData?.buyer : itemData.seller

        firestore.collection("users")
            .doc(notCurrentUserId)
            .update({
                itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemData.itemId),
                notifications: firebase.firestore.FieldValue.arrayUnion({ message: `This order has been cancelled by the ${currentUserIsThe}`, itemId: itemData.id })
            })
            .catch(error => console.log("Error updating user for item cancellation: ", error))

        firestore
            .collection("items")
            .doc(itemData.id)
            .update({ "transactionData.status": `${currentUserIsThe} Cancelled` })
            .catch(error => console.log("Error updating item cancellation status: ", error))
    }


    // allow write (update) to users: if user is signed in
    if ((availableTimes.length !== 0) && deliveryMethod) {
        updateUserItems('add', 'itemsInProgress', itemData.itemId) // update the current user (the buyer)
        notifyUser(itemData.seller, 'newBuyer', itemData.itemId)
        
        firestore
            .collection("users")
            .doc(itemData.seller)
            .update({ itemsInProgress: firebase.firestore.FieldValue.arrayUnion(itemData.itemId) })

        const transactionData = {
            buyer: userData?.id,
            deliveryMethod: deliveryMethod,
            buyerAvailable: availableTimes,
            deliveryTime: "",
            status: "Awaiting Time Confirmation"
        }

        firestore
            .collection("items")
            .doc(itemData.itemId)
            .update({ transactionData })
            .then(() => navigate('/', { state: { message: "item-buy" } }))
            .catch(error => console.log("Error updating item's transactionData: ", error))
    }

    // allow write (update) to items: if user is signed in && if auth.user === either buyer or seller
    if (availableTimes) {
        firestore
            .collection("items")
            .doc(item.itemId)
            .update({ "transactionData.status": "Awaiting Meetup", "transactionData.deliveryTime": deliveryInfo })
            .then(() => navigate('/account/items-in-progress'))
            .catch(error => console.log("Error updating transaction data: ", error))
    }

    // allow write (update) to users: if user is signed in && if auth.user === either buyer or seller
    // allow read (get) to users: if user is signed in && if auth.user === either buyer or seller
    var userDocRef = firestore.collection('users').doc(userId)
    firestore
        .runTransaction(transaction => {
            return transaction.get(userDocRef).then(userDoc => {
                transaction
                    .update(userDocRef, { notifications: firebase.firestore.FieldValue.arrayUnion({ message, itemId }) })
                if (userDoc.data().notifyMethod.by === 'phone') {
                    sendSMS(userDoc.data().notifyMethod.at, message)
                } else {
                    sendEmail(userDoc.data().email, message)
                }
            })
        })
        .catch((error) => {
            console.log("Transaction failed: ", error);
        })

    return 0
}

*/