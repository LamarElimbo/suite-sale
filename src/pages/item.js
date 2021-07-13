import React, { useState, useEffect } from 'react'
import { Link, navigate } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import SideNavContent from '../components/side-nav'
import ItemForm from '../components/item-form'
import DeliveryDateForm from '../components/delivery-date-form'
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemPage = ({ location }) => {
    const [itemData, setItemData] = useState({})
    const [saved, setSaved] = useState(false)
    const [userType, setUserType] = useState('non-user')
    //const { userData, updateUserItems, allItems } = useUser()
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const updateUserItems = firebaseContext?.updateUserItems
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        if (location.state) { // If user came from a previous page
            setItemData(location.state.item)
            setSaved(userData?.itemsSaved.includes(location.state.item.id))
        } else { // If user came to page directly from url
            const urlParams = new URLSearchParams(location.search);
            const item = allItems.filter(item => item.itemId === urlParams.get('item'))
            setItemData(item[0])
            setSaved(userData?.itemsSaved.includes(item[0].itemId))
        }
    }, [location, userData, allItems])

    useEffect(() => {
        if (userData?.id === itemData.transactionData?.buyer) { setUserType('buyer') }
        if (userData?.id === itemData.seller) {
            const posterType = (itemData.transactionData?.status) ? 'poster-locked' : 'poster-unlocked'
            setUserType(posterType)
        }
    }, [userData, itemData])

    const toggleSave = () => {
        const action = saved ? 'remove' : 'add'
        updateUserItems(action, 'itemsSaved', itemData.id)
        setSaved(!saved)
    }

    const handleSubmit = (updatedItemData) => {
        firestore
            .collection("items")
            .doc(itemData.id)
            .update(updatedItemData)
            .then(() => navigate('/'))
            .catch(error => console.log("Error updating item data: ", error))
    }

    const deleteNotification = () => updateUserItems('remove', 'buyerNotifications', itemData.id)
    const deleteItem = () => firestore.collection("items").doc(itemData.id).delete()
    const cancelOrder = () => {
        let currentUserIsThe = (userData.id === itemData.seller) ? 'seller' : 'buyer'
        let notCurrentUserId = (userData.id === itemData.seller) ? itemData.transactionData?.buyer : itemData.seller

        updateUserItems('remove', 'itemsInProgress', itemData.id)

        firestore.collection("users")
            .doc(notCurrentUserId)
            .update({
                itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemData.id),
                notifications: firebase.firestore.FieldValue.arrayUnion({
                    message: `This order has been cancelled by the ${currentUserIsThe}`,
                    itemId: itemData.id
                })
            })
            .catch(error => console.log("Error updating user for item cancellation: ", error))

        firestore
            .collection("items")
            .doc(itemData.id)
            .update({ "transactionData.status": `${currentUserIsThe} Cancelled` })
            .catch(error => console.log("Error updating item cancellation status: ", error))
    }

    if (userType === 'poster-unlocked') {
        return (
            <Layout pageTitle={itemData.item}>
                <Content contentTitle="Edit your listing">
                    <ItemForm itemData={itemData} handleSubmit={handleSubmit} />
                </Content>
                <SideNav>
                    <div className={FormCSS.inputItem__submitArea}>
                        <button className={FormCSS.inputItem__submit} onClick={deleteItem}>Delete</button>
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
                        <button onClick={toggleSave}>{saved ? 'Unsave' : 'Save'}</button>
                        <p className={ItemCSS.notes}>{itemData.itemNotes}</p>
                        {itemData.transactionData?.status && <p className={ItemCSS.item}>{itemData.transactionData.status}</p>}
                        {itemData.transactionData?.status && <button onClick={cancelOrder}>Cancel this order</button>}
                        {(itemData.pickUp && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "pickUp", item: itemData }} className={ItemCSS.deliveryButton}>Pick Up</Link>}
                        {(itemData.dropOff && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "dropOff", item: itemData }} className={ItemCSS.deliveryButton}>Drop Off</Link>}
                        {(itemData.lobby && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "lobby", item: itemData }} className={ItemCSS.deliveryButton}>Meet in Lobby</Link>}
                        {(itemData.transport && !itemData.transactionData?.status) && <Link to='/delivery-date' state={{ deliveryMethod: "transport", item: itemData }} className={ItemCSS.deliveryButton}>Transport Help</Link>}
                    </div>
                    <div className={ItemCSS.imageArea}>
                        <img src={itemData.photo1} alt="Item Preview" className={ItemCSS.photo1} />
                        <div className={ItemCSS.thumnailArea}>
                            {itemData.photo2 && <img src={itemData.photo2} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo3 && <img src={itemData.photo3} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo4 && <img src={itemData.photo4} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                        </div>
                    </div>
                    {(userType === 'poster-locked' && itemData.transactionData?.status === 'Awaiting Time Confirmation') &&
                        <DeliveryDateForm
                            item={itemData}
                            sellerId={itemData.seller}
                            deliveryMethod={itemData.transactionData?.deliveryMethod} />
                    }
                    {(userType === 'buyer' && itemData.transactionData?.status === 'Awaiting Delivery' && userData.notifications.some(doc => doc.itemId === itemData.id)) &&
                        <>
                            <p>Your order has been confirmed!</p>
                            <p>Have you set yourself a reminder?</p>
                            <button onClick={deleteNotification}>Yes</button>
                        </>
                    }
                </Content>
                <SideNav>
                    {userData?.notifications?.length > 0 && <SideNavContent type='notifications' />}
                </SideNav>
            </Layout>
        )
    }
}

export default ItemPage