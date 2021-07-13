import React, { useState, useEffect } from 'react'
import { navigate } from "gatsby"
import { firestore, firebase } from "../components/firebase"
import { timeGrid, timeBox, form, available, unselected, inactive, inputItem, inputItem__submit } from '../css/form.module.css'
import { useUser } from "../context/UserContext"
import { notifyUser } from "./notifications"

const DeliveryDateForm = ({ item, deliveryMethod }) => {
    const [availableTimes, setAvailableTimes] = useState([])
    const [deliveryTime, setDeliveryTime] = useState('')
    //const { userData, updateUserItems } = useUser()

    const userContext = useUser()
    const userData = userContext.userData
    const updateUserItems = userContext.updateUserItems
    const timeSelection = ["12:00 am", "12:15 am", "12:30 am", "12:45 am", "1:00 am", "1:15 am", "1:30 am", "1:45 am", "2:00 am", "2:15 am", "2:30 am", "2:45 am", "3:00 am", "3:15 am", "3:30 am", "3:45 am", "4:00 am", "4:15 am", "4:30 am", "4:45 am", "5:00 am", "5:15 am", "5:30 am", "5:45 am", "6:00 am", "6:15 am", "6:30 am", "6:45 am", "7:00 am", "7:15 am", "7:30 am", "7:45 am", "8:00 am", "8:15 am", "8:30 am", "8:45 am", "9:00 am", "9:15 am", "9:30 am", "9:45 am", "10:00 am", "10:15 am", "10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am", "12:00 pm", "12:15 pm", "12:30 pm", "12:45 pm", "1:00 pm", "1:15 pm", "1:30 pm", "1:45 pm", "2:00 pm", "2:15 pm", "2:30 pm", "2:45 pm", "3:00 pm", "3:15 pm", "3:30 pm", "3:45 pm", "4:00 pm", "4:15 pm", "4:30 pm", "4:45 pm", "5:00 pm", "5:15 pm", "5:30 pm", "5:45 pm", "6:00 pm", "6:15 pm", "6:30 pm", "6:45 pm", "7:00 pm", "7:15 pm", "7:30 pm", "7:45 pm", "8:00 pm", "8:15 pm", "8:30 pm", "8:45 pm", "9:00 pm", "9:15 pm", "9:30 pm", "9:45 pm", "10:00 pm", "10:15 pm", "10:30 pm", "10:45 pm", "11:00 pm", "11:15 pm", "11:30 pm", "11:45 pm"]

    useEffect(() => {
        if (item.transactionData?.status) { setAvailableTimes(item.transactionData.buyerAvailable) }
    }, [item])


    const handleTimeSelection = (e) => {
        console.log("availableTimes: ", availableTimes)
        if (item.transactionData?.status === 'Awaiting Time Confirmation') {
            setDeliveryTime(e.target.id)
        } else {
            let selectedTimes = availableTimes
            if (selectedTimes.includes(e.target.id)) {
                const index = selectedTimes.indexOf(e.target.id)
                if (index > -1) {
                    selectedTimes.splice(index, 1)
                    setAvailableTimes([...selectedTimes])
                }
            } else {
                setAvailableTimes([...selectedTimes, e.target.id])
            }
        }
    }

    const displayTimes = (day) => {
        return (
            <>
                <p>{day}</p>
                <div className={timeGrid}>
                    {timeSelection.map((time) => {
                        return (
                            <>
                                {(!item.transactionData?.status) &&
                                    <div className={timeBox + " " + (availableTimes.includes(`${day} ${time}`) ? available : unselected)}
                                        id={`${day} ${time}`}
                                        key={day + "-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && availableTimes.includes(`${day} ${time}`)) &&
                                    <div className={timeBox + " " + (deliveryTime === (`${day} ${time}`) ? available : unselected)}
                                        id={`${day} ${time}`}
                                        key={day + "-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && !availableTimes.includes(`${day} ${time}`)) &&
                                    <div className={timeBox + " " + inactive} key={day + "-" + time.replace(/:| /g, '-')}>{time}</div>}
                            </>
                        )
                    })}
                </div>
            </>
        )
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (item.transactionData?.status === 'Awaiting Time Confirmation') { // The seller just confirmed a delivery time
            updateUserItems('add', 'itemsInProgress', item.itemId) // update the current user (the seller)
            updateUserItems('remove', 'sellerNotifications', item.itemId) // update the current user (the seller)
            notifyUser(item.transactionData.buyer, 'orderConfirmed', item.itemId)

            firestore
                .collection("items")
                .doc(item.itemId)
                .update({
                    "transactionData.status": "Awaiting Delivery",
                    "transactionData.deliveryTime": deliveryTime
                })
                .then(() => navigate('/account/items-in-progress'))
                .catch(error => console.log("Error updating transaction data: ", error))

        } else { // The buyer just ordered an item
            updateUserItems('add', 'itemsInProgress', item.itemId) // update the current user (the buyer)
            notifyUser(item.seller, 'newBuyer', item.itemId)

            firestore
                .collection("users")
                .doc(item.seller)
                .update({itemsInProgress: firebase.firestore.FieldValue.arrayUnion(item.itemId)})

            const transactionData = {
                buyer: userData.id,
                deliveryMethod: deliveryMethod,
                buyerAvailable: availableTimes,
                deliveryTime: "",
                status: "Awaiting Time Confirmation"
            }

            firestore
                .collection("items")
                .doc(item.itemId)
                .update({ transactionData })
                .then(() => navigate('/account/items-in-progress'))
                .catch(error => console.log("Error updating item's transactionData: ", error))
        }
    }

    return (
        <form className={form} onSubmit={onSubmit}>
            {displayTimes('today')}
            {displayTimes('tomorrow')}
            <div className={inputItem}>
                <input className={inputItem__submit} type="submit" value="Submit" />
            </div>
        </form>
    )
}

export default DeliveryDateForm