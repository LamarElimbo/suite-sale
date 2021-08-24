import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { firestore, firebase } from "./firebase"
import { useUser } from "../context/UserContext"
import * as LayoutCSS from '../css/layout.module.css'

export const notifyUser = (userId, notifyAbout, itemId) => {
    let message = ""
    let fullMessage = ""
    switch (notifyAbout) {
        case 'cancellation':
            message = "Your order has been cancelled"
            fullMessage = "This is Suite Sale letting you know that one of your orders has been cancelled."
            break
        case 'newBuyer':
            message = "You have a new buyer"
            fullMessage = "This is Suite Sale letting you know that you have a new buyer for an item that you posted."
            break
        case 'orderConfirmed':
            message = "Your order has been confirmed"
            fullMessage = "This is Suite Sale letting you know that one of your orders has been confirmed."
            break
        default:
            break
    }

    var userDocRef = firestore.collection('users').doc(userId)
    firestore
        .runTransaction(transaction => {
            return transaction.get(userDocRef).then(userDoc => {
                transaction.update(userDocRef, { notifications: firebase.firestore.FieldValue.arrayUnion({ message, itemId }) })
                if (userDoc.data().notifyMethod.by === 'phone') sendSMS(userDoc.data().notifyMethod.at, fullMessage)
                if (userDoc.data().notifyMethod.by === 'email') sendEmail(userDoc.data().email, fullMessage)
            })
        })
        .catch((error) => console.log("Transaction failed: ", error))
}

export const sendSMS = async (notifyAt, message) => {
    //https://www.twilio.com/blog/sending-sms-gatsby-react-serverless
    const functionURL = "https://turquoise-octopus-1624.twil.io/send-sms"
    const response = await fetch(functionURL, {
        method: "post",
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: new URLSearchParams({ to: notifyAt, body: message }).toString(),
    })
    if (response.status === 200) {
        console.log('success sending sms')
    } else {
        const json = await response.json()
        console.log('error: ', json.error)
    }
}

export const sendEmail = async (notifyAt, message) => {
    //https://www.twilio.com/blog/gatsby-email-contact-form-react-serverless
    const functionURL = "https://turquoise-octopus-1624.twil.io/send-email"
    const response = await fetch(functionURL, {
        method: "post",
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: new URLSearchParams({ to: notifyAt, subject: message, body: message }).toString(),
    })
    if (response.status === 200) {
        console.log('success sending email')
    } else {
        const json = await response.json()
        console.log('error: ', json.error)
    }
}

export const NotificationsList = () => {
    const [notificationItems, setNotificationItems] = useState([])
    const firebaseContext = useUser()
    const deleteNotification = (e) => firebaseContext?.updateUserItems('remove', "orderCancellationNotification", e.target.id)
    const confirmNotification = (e) => firebaseContext?.updateUserItems('remove', "orderConfirmationNotification", e.target.id)

    useEffect(() => {
        firebaseContext?.userData?.notifications.forEach(notification => {
            //const item = firebaseContext?.allItems?.filter(item => item.itemId === notification.itemId)
            //notification['item'] = item ? item[0] : null
            firestore.collection('items').doc(notification.itemId).get()
                .then(doc => {
                    notification['item'] = doc.data()

                    switch (notification.message) {
                        case "Your order has been cancelled":
                            notification['fullMessage'] = `Your ${notification?.item?.item} order has been cancelled`
                            notification['action'] = ""
                            break
                        case "You have a new buyer":
                            notification['fullMessage'] = `You have a new buyer for your ${notification?.item?.item}`
                            notification['action'] = "Next Step: Choose a time to meet"
                            break
                        case "Your order has been confirmed":
                            notification['fullMessage'] = `Your ${notification?.item?.item} order has been confirmed`
                            notification['action'] = "Next Step: Mark your calendar"
                            break
                        default:
                            break
                    }
                    setNotificationItems(prev => Array.from(new Set([...prev, notification])))
                })
        })
    }, [firebaseContext])

    return (
        <>
            {notificationItems.map(notificationItem => {
                return (
                    <>
                        {notificationItem.fullMessage?.search('confirm') > 0 || notificationItem.fullMessage?.search('cancel') > 0 ?
                            <div className={LayoutCSS.notificationLink} key={notificationItem.itemId}>
                                <p className={LayoutCSS.notificationMessage}>{notificationItem.fullMessage}</p>
                                <p className={LayoutCSS.notificationAction}>{notificationItem.action}</p>
                                {notificationItem.fullMessage?.search('confirm') > 0 && <button className={LayoutCSS.statusButton} id={notificationItem.itemId} onClick={confirmNotification}>Dismiss</button>}
                                {notificationItem.fullMessage?.search('confirm') > 0 && <Link to={`/item?item=${notificationItem.itemId}`} state={{ item: notificationItem.item }} style={{ marginLeft: "10px" }}><button className={LayoutCSS.statusButton} id={"confirm" + notificationItem.itemId}>Visit item page for details</button></Link>}
                                {notificationItem.fullMessage?.search('cancel') > 0 && <button className={LayoutCSS.statusButton} id={notificationItem.itemId} onClick={deleteNotification}>Dismiss</button>}
                            </div>
                            :
                            <Link to={`/item?item=${notificationItem.itemId}`} className={LayoutCSS.notificationLink} state={{ item: notificationItem.item }} key={notificationItem.itemId}>
                                <p className={LayoutCSS.notificationMessage}>{notificationItem.fullMessage}</p>
                                <p className={LayoutCSS.notificationAction}>{notificationItem.action}</p>
                            </Link>
                        }
                    </>
                )
            })}
        </>
    )
}