import React, { useState, useRef } from 'react'
import ItemFormPickTime from '../components/item-form-pick-time'
import { useUser } from "../context/UserContext"
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemFormBuyItem = ({ itemData }) => {
    const suite = useRef('')
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const firebaseContext = useUser()
    const addSuite = firebaseContext?.addSuite
    const userData = firebaseContext?.userData
    const onClickDeliveryMethod = (e) => setDeliveryMethod(e.target.id)
    const submitSuite = () => addSuite(suite.current.value, userData?.id)

    return (
        <>
            <div className={ItemCSS.formStep}>
                <p className={ItemCSS.formStepTitle}>Step 1 of 2</p>
                <p>Where would you like to meet the seller?</p>
                {(itemData.pickUp && !itemData.transactionData?.status) &&
                    <button id="pickUp" className={(deliveryMethod === "pickUp" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Their suite</button>
                }
                {(itemData.dropOff && !itemData.transactionData?.status) &&
                    <button id="dropOff" className={(deliveryMethod === "dropOff" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Your suite</button>
                }
                {(itemData.dropOff && deliveryMethod === 'dropOff' && !userData?.suite) &&
                    <>
                        <p className={FormCSS.inputItem__label}>What's your suite number?</p>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="###"
                            type="number"
                            maxLength="3"
                            ref={suite} />
                        <button className={FormCSS.lightButton} onClick={submitSuite}>Submit</button>
                    </>
                }
                {(itemData.lobby && !itemData.transactionData?.status) &&
                    <button id="lobby" className={(deliveryMethod === "lobby" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>The lobby</button>
                }
            </div>
            <div className={ItemCSS.formStep}>
                <p className={ItemCSS.formStepTitle}>Step 2 of 2</p>
                <p>When are you free to meet the seller?</p>
                <ItemFormPickTime item={itemData} deliveryMethod={deliveryMethod} />
            </div>
        </>
    )
}

export default ItemFormBuyItem