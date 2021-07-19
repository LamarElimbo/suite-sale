import React, { useState, useEffect } from 'react'
import { navigate } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemFormInfo from '../components/item-form-info'
import ItemFormBuyItem from '../components/item-form-buy-item'
import ItemFormPickTime from '../components/item-form-pick-time'
import * as LayoutCSS from '../css/layout.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemPage = ({ location }) => {
    const [itemData, setItemData] = useState({})
    const [saved, setSaved] = useState(false) // add to cart feature
    const [userType, setUserType] = useState('non-user') // non-user, potential-buyer, buyer, seller-with-buyer, seller-without-buyer
    const [coverPhoto, setCoverPhoto] = useState('')
    const [interestedBuyer, setInterestedBuyer] = useState(false)
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const updateUserItems = firebaseContext?.updateUserItems
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        if (location.state) { // If user came from a previous page
            setItemData(location.state.item)
            setCoverPhoto(location.state.item.photo1)
            setSaved(userData?.itemsSaved.includes(location.state.item.itemId))
        } else { // If user came to page directly from url
            const urlParams = new URLSearchParams(location.search);
            const item = allItems.filter(item => item.itemId === urlParams.get('item'))
            setItemData(item[0])
            setSaved(userData?.itemsSaved.includes(item[0].itemId))
        }
    }, [location, userData, allItems])

    useEffect(() => {
        userData ? setUserType('potential-buyer') : setUserType('non-user')
        if (userData?.id === itemData.transactionData?.buyer) { setUserType('buyer') }
        if (userData?.id === itemData.seller) {
            const sellerType = (itemData.transactionData?.status) ? 'seller-with-buyer' : 'seller-without-buyer'
            setUserType(sellerType)
        }
    }, [userData, itemData])

    const toggleSave = () => {
        const action = saved ? 'remove' : 'add'
        updateUserItems(action, 'itemsSaved', itemData.itemId)
        setSaved(!saved)
    }

    const handleSubmit = (updatedItemData) => {
        firestore
            .collection("items")
            .doc(itemData.itemId)
            .update(updatedItemData)
            .then(() => navigate('/'))
            .catch(error => console.log("Error updating item data: ", error))
    }

    const changeCoverPhoto = (e) => setCoverPhoto(e.target.src)
    const onClickBuy = () => setInterestedBuyer(true)
    const deleteNotification = () => updateUserItems('remove', 'buyerNotifications', itemData.itemId)
    const deleteItem = () => firestore.collection("items").doc(itemData.itemId).delete()
    const cancelOrder = () => {
        let currentUserIsThe = (userData?.id === itemData.seller) ? 'seller' : 'buyer'
        let notCurrentUserId = (userData?.id === itemData.seller) ? itemData.transactionData?.buyer : itemData.seller

        updateUserItems('remove', 'itemsInProgress', itemData.id)

        firestore.collection("users")
            .doc(notCurrentUserId)
            .update({
                itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemData.itemId),
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

    return (
        <Layout pageTitle={itemData.item}>
            <Content>
                {itemData.transactionData?.status && <p className={ItemCSS.itemStatus}>{itemData.transactionData.status + ' ' + itemData.transactionData?.deliveryMethod + ' ' + itemData.transactionData?.deliveryTime}</p>}
                {userData?.notifications.some(doc => doc.itemId === itemData.id) &&
                    <div className={ItemCSS.itemStatus}>
                        <p>Have you marked your calendar?</p>
                        <button className={ItemCSS.itemStatusButton} onClick={deleteNotification}>Yes</button>
                    </div>
                }
                <div className={ItemCSS.infoArea}>
                    <div>
                        <p className={ItemCSS.cost}><sup className={ItemCSS.dollarSign}>$</sup>{itemData.cost}</p>
                        <p className={ItemCSS.item}>{itemData.item}</p>
                        <p className={ItemCSS.notes}>Seller's Notes:</p>
                        <p className={LayoutCSS.isLightText}>{itemData.itemNotes}</p>
                    </div>
                    <div className={ItemCSS.interestMethods}>
                        {(['potential-buyer', 'buyer'].includes(userType)) && <button className={ItemCSS.saveButton} onClick={toggleSave}>{saved ? 'Remove from cart' : 'Add to cart'}</button>}
                        {(!itemData.transactionData?.status && !interestedBuyer && userType === 'potential-buyer') && <button className={ItemCSS.buyItemButton} onClick={onClickBuy}>Buy</button>}
                        {interestedBuyer && <p className={ItemCSS.instructions}>Follow the steps below to setup an exchange with the seller</p>}
                        {userType === 'seller-without-buyer' && <button className={ItemCSS.deleteItemButton} onClick={deleteItem}>Delete this item</button>}
                        {itemData.transactionData?.status && <button className={ItemCSS.deleteItemButton} onClick={cancelOrder}>Cancel this order</button>}
                    </div>
                </div>
                <div className={ItemCSS.imageArea}>
                    <div className={ItemCSS.coverPhotoContainer}><img src={coverPhoto} alt="Item Preview" className={ItemCSS.coverPhoto} /></div>
                    <div className={ItemCSS.thumnailArea}>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo1 ?
                                <img src={itemData.photo1} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo2 ?
                                <img src={itemData.photo2} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo3 ?
                                <img src={itemData.photo3} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                    </div>
                </div>
                {userType === 'seller-without-buyer' && <ItemFormInfo itemData={itemData} handleSubmit={handleSubmit} />}
                {(userType === 'seller-with-buyer' && itemData.transactionData?.status === 'Awaiting Time Confirmation') &&
                    <ItemFormPickTime item={itemData} deliveryMethod={itemData.transactionData?.deliveryMethod} />
                }
                {interestedBuyer && <ItemFormBuyItem itemData={itemData} />}
            </Content>
            <SideNav></SideNav>
        </Layout>
    )
}

export default ItemPage