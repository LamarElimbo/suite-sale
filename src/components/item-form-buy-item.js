import React, { useState, useRef } from 'react'
import { navigate } from "gatsby"
import { firestore, firebase } from "../components/firebase"
import ItemFormPickTime from '../components/item-form-pick-time'
import { useUser } from "../context/UserContext"
import { notifyUser } from "./notifications"
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemFormBuyItem = ({ itemData }) => {
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const [availableTimes, setAvailableTimes] = useState([])
    const suite = useRef('')
    const [deliveryMethodError, setDeliveryMethodError] = useState('')
    const [availableTimesError, setAvailableTimesError] = useState('')
    const [suiteError, setSuiteError] = useState('')
    const firebaseContext = useUser()
    const addSuite = firebaseContext?.addSuite
    const userData = firebaseContext?.userData
    const updateUserItems = firebaseContext?.updateUserItems
    const onClickDeliveryMethod = (e) => setDeliveryMethod(e.target.id)

    const onSubmit = (e) => {
        e.preventDefault()
        setDeliveryMethodError("")
        setAvailableTimesError("")
        setSuiteError("")
        if (!deliveryMethod) setDeliveryMethodError("You'll have to select a delivery method")
        if (availableTimes.length === 0) setAvailableTimesError("You'll have to select some times at which you're available")
        if (!userData?.apartment && !suite.current.value && (deliveryMethod === "dropOff")) {
            setSuiteError("You'll have to enter your suite number or remove 'Pick up from your suite' as one of your meet up options")
        } else {
            addSuite(suite.current.value, userData?.id)
        }
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
                .then(() => navigate('/', {state: { message: "item-buy"}}))
                .catch(error => console.log("Error updating item's transactionData: ", error))
        }
    }

    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={ItemCSS.formStep}>
                <p className={ItemCSS.formStepTitle}>Step 1 of 2</p>
                <p>Where would you like to meet the seller?</p>
                {deliveryMethodError && <p className={FormCSS.formError}>{deliveryMethodError}</p>}
                {(itemData.pickUp && !itemData.transactionData?.status) &&
                    <button type="button" id="pickUp" className={(deliveryMethod === "pickUp" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Their suite</button>
                }
                {(itemData.dropOff && !itemData.transactionData?.status) &&
                    <button type="button" id="dropOff" className={(deliveryMethod === "dropOff" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Your suite</button>
                }
                {(itemData.lobby && !itemData.transactionData?.status) &&
                    <button type="button" id="lobby" className={(deliveryMethod === "lobby" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>The lobby</button>
                }
                {(itemData.dropOff && deliveryMethod === 'dropOff' && !userData?.suite) &&
                <div style={{padding: "60px"}}>
                        <p className={FormCSS.inputItem__label}>What's your suite number?</p>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="###"
                            type="number"
                            maxLength="3"
                            ref={suite} />
                        {suiteError && <p className={FormCSS.formError}>{suiteError}</p>}
                    </div>
                }
            </div>
            <div className={ItemCSS.formStep}>
                <p className={ItemCSS.formStepTitle}>Step 2 of 2</p>
                <p>At which times are you free to meet the seller?</p>
                {availableTimesError && <p className={FormCSS.formError}>{availableTimesError}</p>}
                <ItemFormPickTime item={itemData} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} />
            </div>
            <div className={FormCSS.inputItem}>
                {(availableTimesError || deliveryMethodError || suiteError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}
                <input className={FormCSS.darkButton} type="submit" value="Request Meet Up" />
            </div>
        </form>
    )
}

export default ItemFormBuyItem