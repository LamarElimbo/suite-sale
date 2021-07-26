import React, { useState, useEffect } from 'react'
import { navigate, Link } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemFormInfo from '../components/item-form-info'
import ItemFormBuyItem from '../components/item-form-buy-item'
import ItemFormPickTime from '../components/item-form-pick-time'
import * as LayoutCSS from '../css/layout.module.css'
import * as SideNavCSS from '../css/side-nav.module.css'
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
            const item = allItems?.filter(item => item.itemId === urlParams.get('item'))
            item && setItemData(item[0])
            item && setSaved(userData?.itemsSaved.includes(item[0].itemId))
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

    useEffect(() => {
        if (itemData.transactionData?.status === 'Awaiting Meetup') {
            const deliveryDateSting = itemData.transactionData?.deliveryTime
            const deliveryDateArray = deliveryDateSting.split(" at ");
            const deliveryDate = new Date(deliveryDateArray[0])
            const today = new Date()
            if (today.getDate() > deliveryDate.getDate()) {
                firestore
                    .collection("items")
                    .doc(itemData.itemId)
                    .update({ "transactionData.status": "Complete" })
                    .catch(error => console.log("Error marking item status to complete: ", error))
            }
        }
    }, [itemData])

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
            .then(() => navigate('/', { state: { message: "item-update" } }))
            .catch(error => console.log("Error updating item data: ", error))
    }

    const changeCoverPhoto = (e) => setCoverPhoto(e.target.src)
    const onClickBuy = () => setInterestedBuyer(true)
    const deleteNotification = () => updateUserItems('remove', 'buyerNotifications', itemData.itemId)
    const deleteItem = () => firestore.collection("items").doc(itemData.itemId).delete().then(() => navigate('/', { state: { message: "item-delete" } }))
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
                <div className={ItemCSS.itemPage}>
                    <div className={ItemCSS.infoArea}>
                        <div>
                            <p className={ItemCSS.cost}><sup className={ItemCSS.dollarSign}>$</sup>{itemData.cost}</p>
                            <p className={ItemCSS.item}>{itemData.item}</p>
                            <p className={ItemCSS.notes}>Seller's Notes:</p>
                            <p className={LayoutCSS.isLightText}>{itemData.itemNotes}</p>
                        </div>
                        <div className={ItemCSS.interestMethods}>
                            {(['potential-buyer', 'buyer'].includes(userType)) && <button className={ItemCSS.saveButton} onClick={toggleSave}>{saved ? 'Remove From cart' : 'Add To cart'}</button>}
                            {(!itemData.transactionData?.status && !interestedBuyer && userType === 'potential-buyer') && <button className={ItemCSS.buyItemButton} onClick={onClickBuy}>Buy</button>}
                            {(!itemData.transactionData?.status && !interestedBuyer && userType === 'non-user') && <Link to="/sign-in"><button className={ItemCSS.saveButton}>Sign In To Save Item</button></Link>}
                            {(!itemData.transactionData?.status && !interestedBuyer && userType === 'non-user') && <Link to="/sign-in"><button className={ItemCSS.buyItemButton}>Sign In To Buy Item</button></Link>}
                            {interestedBuyer && <p className={ItemCSS.instructions}>Follow the steps below to setup an exchange with the seller</p>}
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
                </div>
            </Content>
            <SideNav>
                <div className={SideNavCSS.status}>
                    <p style={{ marginBottom: "15px" }}>Item Status</p>
                    {(!itemData.transactionData) &&
                        <p className={SideNavCSS.sideNavRow__text}>This item doesn't have a buyer yet.</p>
                    }
                    {(itemData.transactionData && userType === 'potential-buyer') &&
                        <p className={SideNavCSS.sideNavRow__text}>This item already has a buyer.</p>
                    }
                    {(itemData.transactionData?.status === "Awaiting Time Confirmation" && userType === 'buyer') &&
                        <p className={SideNavCSS.sideNavRow__text}>The seller has been notified of your interest in this item. Once they confirm their ideal delivery time and then you'll be notified with the final details.</p>
                    }
                    {(itemData.transactionData?.status === "Awaiting Meetup" && ['seller', 'buyer'].includes(userType)) &&
                        <>
                            <p className={SideNavCSS.sideNavRow__text}>{itemData.transactionData.status}</p>
                            <p className={SideNavCSS.sideNavRow__text}>{itemData.transactionData?.deliveryMethod + ' ' + itemData.transactionData?.deliveryTime}</p>
                        </>
                    }
                    {(itemData.transactionData?.status === "Awaiting Meetup" && userData?.notifications.some(doc => doc.itemId === itemData.id)) &&
                        <>
                            <p className={SideNavCSS.sideNavRow__text}>Have you marked your calendar?</p>
                            <button className={SideNavCSS.statusButton} onClick={deleteNotification}>Yes, Remove Notification</button>
                        </>
                    }
                    {userType === 'seller-without-buyer' && <button className={ItemCSS.deleteItemButton} onClick={deleteItem}>Delete This Item</button>}
                    {(itemData.transactionData?.status && itemData.transactionData?.status !== 'Complete') && <button className={SideNavCSS.statusButton} onClick={cancelOrder}>Cancel Order</button>}
                    {(itemData.transactionData?.status === 'Complete') &&
                        <>
                            <p className={SideNavCSS.sideNavRow__text}>Didn't end up selling your item?</p>
                            <button className={ItemCSS.deleteItemButton} onClick={cancelOrder}>Make Live Again</button>
                        </>
                    }
                </div>
            </SideNav>
        </Layout>
    )
}

export default ItemPage