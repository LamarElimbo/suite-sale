import React, { useState } from 'react'
import { navigate } from "gatsby"
import { firestore } from "../components/firebase"
import ItemFormPickTime from '../components/item-form-pick-time'
import { useUser } from "../context/UserContext"
import { notifyUser } from "./notifications"
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemFormConfirmOrder = ({ itemData }) => {
    const [availableTimes, setAvailableTimes] = useState()
    const [availableTimesError, setAvailableTimesError] = useState('')
    const firebaseContext = useUser()
    const updateUserItems = firebaseContext?.updateUserItems

    const onSubmit = (e) => {
        e.preventDefault()
        setAvailableTimesError("")
        if (availableTimes.length === 0) setAvailableTimesError("You'll have to select some times at which you're available")
        if (availableTimes) {
            updateUserItems('add', 'itemsInProgress', item.itemId) // update the current user (the seller)
            updateUserItems('remove', 'sellerNotifications', item.itemId) // update the current user (the seller)
            notifyUser(item.transactionData.buyer, 'orderConfirmed', item.itemId)

            const dateString = (availableTimes.includes('today')) ? today : tomorrow
            const dateObject = (availableTimes.includes('today')) ? new Date(dateString) : new Date(dateString)
            const deliveryInfo = (availableTimes.includes('today')) ?`${dateObject.toDateString()} at ${dateString.slice(5)}` : `${dateObject.toDateString()} at ${dateString.slice(5)}`

            firestore
                .collection("items")
                .doc(item.itemId)
                .update({
                    "transactionData.status": "Awaiting Meetup",
                    "transactionData.deliveryTime": deliveryInfo
                })
                .then(() => navigate('/account/items-in-progress'))
                .catch(error => console.log("Error updating transaction data: ", error))
        }
    }

    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={ItemCSS.formStep}>
                <p className={ItemCSS.formStepTitle}>The active times in white are when your buyer is available.</p>
                <p>When would you like to meet with them?</p>
                <ItemFormPickTime item={itemData} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} />
            </div>
            <div className={FormCSS.inputItem}>
                {availableTimesError && <p className={FormCSS.formError}>{availableTimesError}</p>}
                <input className={FormCSS.darkButton} type="submit" value="Finalize Meet Up" />
            </div>
        </form>
    )
}

export default ItemFormConfirmOrder