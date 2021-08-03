import React, { useState, useRef } from 'react'
import { navigate } from "gatsby"
import { firestore, firebase } from "../components/firebase"
import ItemFormPickTime from '../components/item-form-pick-time'
import { useUser } from "../context/UserContext"
import { notifyUser } from "./notifications"
import * as LayoutCSS from '../css/layout.module.css'
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
        if (!userData?.suite && !suite.current.value && (deliveryMethod === "dropOff")) {
            setSuiteError("You'll have to enter your suite number or remove 'Pick up from your suite' as one of your meet up options")
        }
        if (suite.current.value) {
            addSuite(suite.current.value, userData?.id)
        }
        if ((availableTimes.length !== 0) && deliveryMethod) {
            updateUserItems('add', 'itemsInProgress', itemData.itemId) // update the current user (the buyer)
            notifyUser(itemData.seller, 'newBuyer', itemData.itemId)

            firestore
                .collection("users")
                .doc(itemData.seller)
                .update({ itemsInProgress: firebase.firestore.FieldValue.arrayUnion(itemData.itemId) })

            let day1Date = new Date()
            let day2Date = new Date()
            let day3Date = new Date()
            day2Date.setTime(day2Date.getTime() + (24 * 60 * 60 * 1000))
            day3Date.setTime(day3Date.getTime() + (48 * 60 * 60 * 1000))

            const transactionData = {
                buyer: userData?.id,
                deliveryMethod: deliveryMethod,
                day1: day1Date.toDateString(),
                day2: day2Date.toDateString(),
                day3: day3Date.toDateString(),
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
    }

    return (
        <>
            <div className={LayoutCSS.title}>
                <h2 className={LayoutCSS.isCentered}>Item Order Form</h2>
            </div>
            <form className={FormCSS.form} onSubmit={onSubmit}>
                <div className={FormCSS.formField} style={{ flex: "1 0 100%" }}>
                    <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
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
                            <div style={{ padding: "60px" }}>
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
                </div>
                <div className={FormCSS.formField} style={{ flex: "1 0 100%" }}>
                    <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                        <p className={ItemCSS.formStepTitle}>Step 2 of 2</p>
                        <p>Select the times within the next 48 hours that you're free to meet the seller</p>
                        {availableTimesError && <p className={FormCSS.formError}>{availableTimesError}</p>}
                        <ItemFormPickTime item={itemData} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} />
                    </div>
                    {(availableTimesError || deliveryMethodError || suiteError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}
                </div >
                <input className={FormCSS.submitButton} type="submit" value="Request Meet Up" />
            </form >
        </>
    )
}

export default ItemFormBuyItem