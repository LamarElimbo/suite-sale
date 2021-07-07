import React, { useState, useEffect } from 'react'
import { navigate } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { timeGrid, timeBox, form, available, unselected, inactive, inputItem, inputItem__submit } from '../css/form.module.css'
import { useUser } from "../context/UserContext"

const DeliveryDateForm = ({ item, sellerId, deliveryMethod }) => {
    const [availableTimes, setAvailableTimes] = useState([])
    const [deliveryTime, setDeliveryTime] = useState('')
    const { userData, updateUserItems } = useUser()
    const timeSelection = ["12:00 am", "12:15 am", "12:30 am", "12:45 am", "1:00 am", "1:15 am", "1:30 am", "1:45 am", "2:00 am", "2:15 am", "2:30 am", "2:45 am", "3:00 am", "3:15 am", "3:30 am", "3:45 am", "4:00 am", "4:15 am", "4:30 am", "4:45 am", "5:00 am", "5:15 am", "5:30 am", "5:45 am", "6:00 am", "6:15 am", "6:30 am", "6:45 am", "7:00 am", "7:15 am", "7:30 am", "7:45 am", "8:00 am", "8:15 am", "8:30 am", "8:45 am", "9:00 am", "9:15 am", "9:30 am", "9:45 am", "10:00 am", "10:15 am", "10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am", "12:00 pm", "12:15 pm", "12:30 pm", "12:45 pm", "1:00 pm", "1:15 pm", "1:30 pm", "1:45 pm", "2:00 pm", "2:15 pm", "2:30 pm", "2:45 pm", "3:00 pm", "3:15 pm", "3:30 pm", "3:45 pm", "4:00 pm", "4:15 pm", "4:30 pm", "4:45 pm", "5:00 pm", "5:15 pm", "5:30 pm", "5:45 pm", "6:00 pm", "6:15 pm", "6:30 pm", "6:45 pm", "7:00 pm", "7:15 pm", "7:30 pm", "7:45 pm", "8:00 pm", "8:15 pm", "8:30 pm", "8:45 pm", "9:00 pm", "9:15 pm", "9:30 pm", "9:45 pm", "10:00 pm", "10:15 pm", "10:30 pm", "10:45 pm", "11:00 pm", "11:15 pm", "11:30 pm", "11:45 pm"]
    //const time24 = ["00:00", "00:15", "00:30", "00:45", "1:00", "1:15", "1:30", "1:45", "2:00", "2:15", "2:30", "2:45", "3:00", "3:15", "3:30", "3:45", "4:00", "4:15", "4:30", "4:45", "5:00", "5:15", "5:30", "5:45", "6:00", "6:15", "6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "24:45"]

    console.log("availableTimes: ", availableTimes)

    useEffect(() => {
        if (item.transactionData?.status) {
            setAvailableTimes(item.transactionData.buyerAvailable)
        }
    }, [item])

    const displayTimes = () => {
        return (
            <>
                <p>Today</p>
                <div className={timeGrid}>
                    {timeSelection.map((time) => {
                        return (
                            <>
                                {(!item.transactionData?.status) &&
                                    <div className={timeBox + " " + (availableTimes.includes("today " + time) ? available : unselected)}
                                        id={"today " + time}
                                        key={"today-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && availableTimes.includes("today " + time)) &&
                                    <div className={timeBox + " " + (deliveryTime === ("today " + time) ? available : unselected)}
                                        id={"today " + time}
                                        key={"today-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && !availableTimes.includes("today " + time)) &&
                                    <div className={timeBox + " " + inactive} key={"today-" + time.replace(/:| /g, '-')}>{time}</div>}
                            </>
                        )
                    })}
                </div>
                <p>Tomorrow</p>
                <div className={timeGrid}>
                    {timeSelection.map((time) => {
                        return (
                            <>
                                {(!item.transactionData?.status) &&
                                    <div className={timeBox + " " + (availableTimes.includes("tomorrow " + time) ? available : unselected)}
                                        id={"tomorrow " + time}
                                        key={"tomorrow-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && availableTimes.includes("tomorrow " + time)) &&
                                    <div className={timeBox + " " + (deliveryTime === ("tomorrow " + time) ? available : unselected)}
                                        id={"tomorrow " + time}
                                        key={"tomorrow-" + time.replace(/:| /g, '-')}
                                        onClick={handleTimeSelection}>{time}</div>}
                                {(item.transactionData?.status === 'Awaiting Time Confirmation' && !availableTimes.includes("tomorrow " + time)) &&
                                    <div className={timeBox + " " + inactive} key={"tomorrow-" + time.replace(/:| /g, '-')}>{time}</div>}
                            </>
                        )
                    })}
                </div>
            </>
        )
    }

    const handleTimeSelection = (e) => {
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

    const onSubmit = (e) => {
        e.preventDefault()

        if (item.transactionData?.status === 'Awaiting Time Confirmation') {
            // update the current user (the buyer)
            updateUserItems('add', 'itemsInProgress', item.itemId)

            firestore
                .collection("items")
                .doc(item.itemId)
                .update({
                    "transactionData.status": "Awaiting Delivery",
                    "transactionData.deliveryTime": deliveryTime
                })
                .then(() => navigate('/account/items-in-progress'))

        } else {
            // update the current user (the buyer)
            updateUserItems('add', 'itemsInProgress', item.itemId)

            // update the seller
            firestore
                .collection("users")
                .doc(sellerId)
                .update({ itemsInProgress: firebase.firestore.FieldValue.arrayUnion(item.itemId) })

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
        }
    }

    return (
        <form className={form} onSubmit={onSubmit}>
            {displayTimes()}
            <div className={inputItem}>
                <input className={inputItem__submit} type="submit" value="Submit" />
            </div>
        </form>
    )
}

export default DeliveryDateForm