import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { firestore, firebase } from "./firebase"
import { useUser } from "../context/UserContext"
import * as SideNavCSS from '../css/side-nav.module.css'

export const notifyUser = (userId, notifyAbout, itemId) => {
    let message = ""
    switch (notifyAbout) {
        case 'cancelation':
            message = "Your order has been cancelled"
            break

        case 'newBuyer':
            message = "You have a new buyer"
            break

        case 'orderConfirmed':
            message = "Your order has been confirmed"
            break

        default:
            break
    }

    var userDocRef = firestore.collection('users').doc(userId)
    firestore
        .runTransaction(transaction => {
            return transaction.get(userDocRef).then(userDoc => {
                transaction
                    .update(userDocRef, { notifications: firebase.firestore.FieldValue.arrayUnion({ message, itemId }) })
                var userNotifyMethod = userDoc.data().notifyMethod
                sendSMS(userNotifyMethod, message)
            })
        })
        .catch((error) => {
            console.log("Transaction failed: ", error);
        })
}

export const sendSMS = async (notifyMethod, message) => {
    //https://www.twilio.com/blog/sending-sms-gatsby-react-serverless
    const functionURL = "https://turquoise-octopus-1624.twil.io/send-sms"
    const response = await fetch(functionURL, {
        method: "post",
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({ to: notifyMethod.at, body: message }).toString(),
    })
    if (response.status === 200) {
        console.log('success')
    } else {
        const json = await response.json()
        console.log('error: ', json.error)
    }
}

/*
export const sendEmail = async (sendTo, notifyAbout) => {
    const functionURL = "https://turquoise-octopus-1624.twil.io/send-sms"
    let message = ""

    switch (notifyAbout) {
        case cancelation:
            message = "Your order has been cancelled"
            break

        case newBuyer:
            message = "You have a new buyer"
            break

        case orderConfirmed:
            message = "Your order has been confirmed"
            break

        default:
            break
    }

    const response = await fetch(functionURL, {
        method: "post",
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({ sendTo, message }).toString(),
    })
    if (response.status === 200) {
        console.log('success')
    } else {
        const json = await response.json()
        console.log('error: ', json.error)
    }
}
*/

export const NotificationsList = () => {
    const [notificationItems, setNotificationItems] = useState([])
    //const { userData, allItems } = useUser()
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        console.log("userData.notifications: ", userData.notifications)
        console.log("allItems: ", allItems)
        userData.notifications.forEach(notification => {
            console.log("notification: ", notification)
            const item = allItems?.filter(item => item.itemId === notification.itemId)
            console.log("item: ", item)
            notification['item'] = item ? item[0] : null
            setNotificationItems(prev => Array.from(new Set([...prev, notification])))
        })
    }, [userData, allItems])


    console.log("notificationItems: ", notificationItems)

    return (
        <>
            {notificationItems.map(notificationItem => {
                return (
                    <Link to={`/item?item=${notificationItem.itemId}`} state={{ item: notificationItem.item }} className={SideNavCSS.sideNavRow} key={notificationItem.itemId}>
                        <p className={SideNavCSS.sideNavRow__title}>{notificationItem.message}</p>
                    </Link>)
            })}
        </>
    )
}