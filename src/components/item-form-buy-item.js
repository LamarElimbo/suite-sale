import React, { useState } from 'react'
import ItemFormPickTime from '../components/item-form-pick-time'
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemFormBuyItem = ({ itemData }) => {
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const onClickDeliveryMethod = (e) => setDeliveryMethod(e.target.id)

        return (
            <>
                <div className={ItemCSS.formStep}>
                    <p className={ItemCSS.formStepTitle}>Step 1 of 2</p>
                    <p>How would you like to meet the seller?</p>
                    {(itemData.pickUp && !itemData.transactionData?.status) &&
                        <button id="pickUp" className={(deliveryMethod === "pickUp" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Pick Up</button>
                    }
                    {(itemData.dropOff && !itemData.transactionData?.status) &&
                        <button id="dropOff" className={(deliveryMethod === "dropOff" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Drop Off</button>
                    }
                    {(itemData.lobby && !itemData.transactionData?.status) &&
                        <button id="lobby" className={(deliveryMethod === "lobby" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Meet in Lobby</button>
                    }
                    {(itemData.transport && !itemData.transactionData?.status) &&
                        <button id="transport" className={(deliveryMethod === "transport" ? FormCSS.selected : FormCSS.unselected) + ' ' + ItemCSS.deliveryButton} onClick={onClickDeliveryMethod}>Transport Help</button>
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