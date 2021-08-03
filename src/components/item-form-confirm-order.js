import React, { useState } from 'react'
import { navigate } from "gatsby"
import { firestore } from "../components/firebase"
import ItemFormPickTime from '../components/item-form-pick-time'
import { useUser } from "../context/UserContext"
import { notifyUser } from "./notifications"
import * as LayoutCSS from '../css/layout.module.css'
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemFormConfirmOrder = ({ item }) => {
    const [availableTimes, setAvailableTimes] = useState()
    const [availableTimesError, setAvailableTimesError] = useState('')
    const firebaseContext = useUser()
    const updateUserItems = firebaseContext?.updateUserItems
    const onSubmit = (e) => {
        e.preventDefault()
        setAvailableTimesError("")
        if (!availableTimes || availableTimes?.length === 0) setAvailableTimesError("You'll have to select a time at which you're available")
        if (availableTimes) {
            updateUserItems('add', 'itemsInProgress', item.itemId) // update the current user (the seller)
            updateUserItems('remove', 'newOrderNotification', item.itemId) // update the current user (the seller)
            notifyUser(item.transactionData.buyer, 'orderConfirmed', item.itemId)

            let dateChosen = ""
            if (availableTimes.includes('day1')) { dateChosen = item.transactionData.day1 }
            if (availableTimes.includes('day2')) { dateChosen = item.transactionData.day2 }
            if (availableTimes.includes('day3')) { dateChosen = item.transactionData.day3 }
            const deliveryInfo = `${dateChosen} at ${availableTimes.slice(5)}`

            firestore
                .collection("items")
                .doc(item.itemId)
                .update({
                    "transactionData.buyer": item.transactionData.buyer,
                    "transactionData.deliveryMethod": item.transactionData.deliveryMethod,
                    "transactionData.day1": item.transactionData.day1,
                    "transactionData.day2": item.transactionData.day2,
                    "transactionData.day3": item.transactionData.day3,
                    "transactionData.buyerAvailable": item.transactionData.buyerAvailable,
                    "transactionData.deliveryTime": deliveryInfo,
                    "transactionData.status": "Awaiting Meetup"
                })
                .then(() => navigate('/', { state: { message: "item-confirm" } }))
                .catch(error => console.log("Error updating transaction data: ", error))
        }
    }

    return (
        <>
            <div className={LayoutCSS.title}>
                <h2 className={LayoutCSS.isCentered}>Confirm Order Form</h2>
            </div>
            <form className={FormCSS.form} onSubmit={onSubmit}>
                <div className={FormCSS.formField} style={{ flex: "1 0 100%" }}>
                    <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                        <p className={ItemCSS.formStepTitle}>The active times in white are when your buyer is available.</p>
                        <p>When would you like to meet with them?</p>
                        <ItemFormPickTime item={item} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} />
                    </div>
                    {availableTimesError && <p className={FormCSS.formError}>{availableTimesError}</p>}
                </div>
                <input className={FormCSS.submitButton} type="submit" value="Finalize Meet Up" />
            </form>
        </>
    )
}

export default ItemFormConfirmOrder