import React, { useState, useEffect, useRef } from 'react'
import { Link, navigate } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemForm from '../components/item-form'
import DeliveryDateForm from '../components/delivery-date-form'
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemPage = ({ location }) => {
    const [itemData, setItemData] = useState({})
    const [saved, setSaved] = useState(false)
    const [userType, setUserType] = useState('non-user')
    const { userData, updateUserItems } = useUser()

    useEffect(() => {
        if (location.state) {
            setItemData(location.state.item)
            setSaved(userData?.itemsSaved.includes(location.state.item.id))
        } else {
            const urlParams = new URLSearchParams(location.search);
            firestore
                .collection("items")
                .doc(urlParams.get('item'))
                .get()
                .then(doc => {
                    setItemData(doc.data())
                    setSaved(userData?.itemsSaved.includes(doc.id))
                })
        }
    }, [location, userData])

    useEffect(() => {
        if (userData?.id === itemData.transactionData?.buyer) {
            setUserType('buyer')
        }

        if (userData?.id === itemData.seller) {
            if (itemData.transactionData?.status) {
                setUserType('poster-locked')
            } else {
                setUserType('poster-unlocked')
            }
        }
    }, [userData, itemData])

    const onSave = () => {
        if (saved) {
            updateUserItems('remove', 'itemsSaved', itemData.id)
        } else {
            updateUserItems('add', 'itemsSaved', itemData.id)
        }
        setSaved(!saved)
    }

    const handleSubmit = (updatedItemData) => {
        firestore
            .collection("items")
            .doc(itemData.id)
            .update(updatedItemData)
            .then(() => navigate('/'))
    }

    const onDelete = () => firestore.collection("items").doc(itemData.id).delete()
    const cancelOrder = () => {
        let currentUserIsThe = (userData.id === itemData.seller) ? 'seller' : 'buyer'
        let notCurrentUserId = (userData.id === itemData.seller) ? itemData.transactionData?.buyer : itemData.seller

        // update the current user (the buyer)
        updateUserItems('remove', 'itemsInProgress', itemData.id)

        // update the seller
        firestore.collection("users")
            .doc(notCurrentUserId)
            .update({ itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemData.id) })

        firestore
            .collection("items")
            .doc(itemData.id)
            .update({ "transactionData.status": `${currentUserIsThe} Cancelled` })
    }

    if (userType === 'poster-unlocked') {
        return (
            <Layout pageTitle={itemData.item}>
                <Content contentTitle="Edit your listing">
                    <ItemForm itemData={itemData} handleSubmit={handleSubmit} />
                </Content>
                <SideNav>
                    <div className={FormCSS.inputItem__submitArea}>
                        <button className={FormCSS.inputItem__submit} onClick={onDelete}>Delete</button>
                    </div>
                </SideNav>
            </Layout>
        )
    } else {
        return (
            <Layout pageTitle={itemData.item}>
                <Content>
                    <div className={ItemCSS.infoArea}>
                        <p className={ItemCSS.cost}><sup className={ItemCSS.dollarSign}>$</sup>{itemData.cost}</p>
                        <p className={ItemCSS.item}>{itemData.item}</p>
                        <button onClick={onSave}>{saved ? 'Unsave' : 'Save'}</button>
                        <p className={ItemCSS.notes}>{itemData.itemNotes}</p>
                        {itemData.transactionData?.status && <p className={ItemCSS.item}>{itemData.transactionData.status}</p>}
                        {itemData.transactionData?.status && <button onClick={cancelOrder}>Cancel this order</button>}
                        {(itemData.pickUp && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "pickUp", item: itemData, sellerId: itemData.seller }} className={ItemCSS.deliveryButton}>Pick Up</Link>}
                        {(itemData.dropOff && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "dropOff", item: itemData, sellerId: itemData.seller }} className={ItemCSS.deliveryButton}>Drop Off</Link>}
                        {(itemData.lobby && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "lobby", item: itemData, sellerId: itemData.seller }} className={ItemCSS.deliveryButton}>Meet in Lobby</Link>}
                        {(itemData.transport && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "transport", item: itemData, sellerId: itemData.seller }} className={ItemCSS.deliveryButton}>Transport Help</Link>}
                    </div>
                    <div className={ItemCSS.imageArea}>
                        <img src={itemData.photo1} alt="Item Preview" className={ItemCSS.photo1} />
                        <div className={ItemCSS.thumnailArea}>
                            {itemData.photo2 && <img src={itemData.photo2} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo3 && <img src={itemData.photo3} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo4 && <img src={itemData.photo4} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                        </div>
                    </div>
                    <div>
                        {(userType === 'poster-locked' && itemData.transactionData?.status === 'Awaiting Time Confirmation') &&
                            <DeliveryDateForm
                                item={itemData}
                                sellerId={itemData.seller}
                                deliveryMethod={itemData.transactionData?.deliveryMethod} />
                        }
                    </div>
                </Content>
                <SideNav>
                </SideNav>
            </Layout>
        )
    }
}

export default ItemPage