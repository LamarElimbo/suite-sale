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
}

export const sendSMS = async (notifyAt, message) => {
    //https://www.twilio.com/blog/sending-sms-gatsby-react-serverless
    const functionURL = "https://turquoise-octopus-1624.twil.io/send-sms"
    const response = await fetch(functionURL, {
        method: "post",
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
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
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        body: new URLSearchParams({ to: "lamar_johnson133@yahoo.ca", subject: message, body: message }).toString(),
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
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        userData?.notifications.forEach(notification => {
            const item = allItems?.filter(item => item.itemId === notification.itemId)
            notification['item'] = item ? item[0] : null

            switch (notification.message) {
                case "Your order has been cancelled":
                    notification['fullMessage'] = `Your ${notification?.item?.item} order has been cancelled`
                    notification['action'] = "Next Step: Remove notification"
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
    }, [userData, allItems])

    return (
        <>
            {notificationItems.map(notificationItem => {
                return (
                    <Link to={`/item?item=${notificationItem.itemId}`} state={{ item: notificationItem.item }} className={SideNavCSS.sideNavRow} key={notificationItem.itemId}>
                        <p className={SideNavCSS.sideNavRow__title}>{notificationItem.fullMessage}</p>
                        <p>{notificationItem.action}</p>
                    </Link>)
            })}
        </>
    )
}