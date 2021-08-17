import React, { useState, useEffect } from 'react'
import { navigate, Link } from "gatsby"
import { firebase, firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemFormInfo from '../components/item-form-info'
import ItemFormBuyItem from '../components/item-form-buy-item'
import ItemFormConfirmOrder from '../components/item-form-confirm-order'
import * as LayoutCSS from '../css/layout.module.css'
import * as SideNavCSS from '../css/side-nav.module.css'
import * as ItemCSS from '../css/item-page.module.css'
import wealthsimple_logo from '../images/wealthsimple.png'

const ItemPage = ({ location }) => {
    const [itemData, setItemData] = useState({})
    const [seller, setSeller] = useState()
    const [saved, setSaved] = useState(false) // add to cart feature
    const [userType, setUserType] = useState('non-user') // non-user, potential-buyer, buyer, seller-with-buyer, seller-without-buyer
    const [coverPhoto, setCoverPhoto] = useState('')
    const [interestedBuyer, setInterestedBuyer] = useState(false)
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const updateUserItems = firebaseContext?.updateUserItems
    const allItems = firebaseContext?.allItems

    const toggleSave = () => {
        const action = saved ? 'remove' : 'add'
        updateUserItems(action, 'itemsSaved', itemData.itemId)
        setSaved(!saved)
    }

    const changeCoverPhoto = (e) => setCoverPhoto(e.target.src)
    const onClickBuy = () => setInterestedBuyer(true)
    const deleteItem = () => firestore.collection("items").doc(itemData.itemId).delete().then(() => (typeof window !== 'undefined') && navigate('/', { state: { message: "item-delete" } }))
    const cancelOrder = () => {
        let notCurrentUserId = (userData?.id === itemData.seller) ? itemData.transactionData?.buyer : itemData.seller

        updateUserItems('remove', 'itemsInProgress', itemData.itemId)
        updateUserItems('remove', 'newOrderNotification', itemData.itemId)
        updateUserItems('remove', 'orderConfirmationNotification', itemData.itemId)

        const notificationsToRemove = [{ message: "You have a new buyer", itemId: itemData.itemId }, { message: "Your order has been confirmed", itemId: itemData.itemId }, { message: `Your order has been cancelled`, itemId: itemData.itemId }]
        firestore.collection("users")
            .doc(notCurrentUserId)
            .update({
                itemsInProgress: firebase.firestore.FieldValue.arrayRemove(itemData.itemId),
                notifications: firebase.firestore.FieldValue.arrayRemove(notificationsToRemove)
            })
            .catch(error => console.log("Error updating user for item cancellation: ", error))

        firestore
            .collection('items')
            .doc(itemData.itemId)
            .update({ transactionData: firebase.firestore.FieldValue.delete() })
            .catch(error => console.log("Error updating item cancellation status: ", error))

            if (typeof window !== 'undefined') navigate('/', { state: { message: "item-cancel" } })
    }

    useEffect(() => {
        if (location.state) { // If user came from a previous page
            setItemData(location.state.item)
            setCoverPhoto(location.state.item.photo1)
            setSaved(userData?.itemsSaved.includes(location.state.item.itemId))
        } else { // If user came to page directly from url
            const urlParams = new URLSearchParams(location.search);
            const item = allItems?.filter(item => item.itemId === urlParams.get('item'))
            item && setItemData(item[0])
            item && setCoverPhoto(item[0].photo1)
            item && setSaved(userData?.itemsSaved.includes(item[0].itemId))
        }
    }, [location, userData, allItems])

    useEffect(() => {
        userData?.id ? setUserType('potential-buyer') : setUserType('non-user')
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
                    .update({
                        "transactionData.buyer": userData?.id,
                        "transactionData.deliveryMethod": itemData.transactionData.deliveryMethod,
                        "transactionData.day1": itemData.transactionData.day1,
                        "transactionData.day2": itemData.transactionData.day2,
                        "transactionData.day3": itemData.transactionData.day3,
                        "transactionData.buyerAvailable": itemData.transactionData.buyerAvailable,
                        "transactionData.deliveryTime": itemData.transactionData.deliveryTime,
                        "transactionData.status": "Complete"
                    })
                    .catch(error => console.log("Error marking item status to complete: ", error))
            }
        }

        if (itemData.transactionData?.status === 'Awaiting Time Confirmation') {
            const deliveryDate = new Date(itemData.transactionData?.day3)
            const today = new Date()
            if (today > deliveryDate) cancelOrder()
        }

        firestore.collection('users').doc(itemData.seller).get().then(doc => setSeller(doc.data()))
    }, [itemData])

    return (
        <Layout pageTitle={itemData.item}>
            <Content>
                <div className={LayoutCSS.aboutSection}>
                    <div className={ItemCSS.moneySection}>
                        <p className={ItemCSS.cost}><sup className={ItemCSS.dollarSign}>$</sup>{itemData.cost}</p>
                        <div className={ItemCSS.acceptedPayments}>
                            <p className={ItemCSS.acceptedPaymentsLabel}>This seller accepts</p>
                            <p className={ItemCSS.acceptedPaymentsMethods}>Cash</p>
                            {seller?.acceptedPaymentMethods?.includes("wealthsimple cash") && <a href="https://my.wealthsimple.com/app/public/cash-referral-signup?handle=$lamarelimbo" target="_blank" className={ItemCSS.acceptedPaymentsMethods} rel="noreferrer">Wealthsimple Cash<img src={wealthsimple_logo} alt="Wealthsimple logo" className={ItemCSS.wealthsimpleLogo} /></a>}
                            {seller?.acceptedPaymentMethods?.filter(method => method !== "wealthsimple cash").map(method => (<p className={ItemCSS.acceptedPaymentsMethods}>{method}</p>))}
                        </div>
                    </div>
                    <p className={LayoutCSS.aboutTagline}>{itemData.item}</p>
                    <p className={LayoutCSS.aboutDescription}>Seller's Notes: {itemData.itemNotes}</p>
                    {(['potential-buyer', 'buyer'].includes(userType)) && <div className={LayoutCSS.aboutLink} onClick={toggleSave} onKeyDown={toggleSave} role="button" tabIndex="0">{saved ? 'Remove From Cart' : 'Add To Cart'}</div>}
                    {(!itemData.transactionData?.status && !interestedBuyer && userType === 'non-user') && <Link to="/sign-in" className={LayoutCSS.aboutLink}>Sign In To Save Item</Link>}
                </div>
                <div className={ItemCSS.imageArea}>
                    <div className={ItemCSS.coverPhotoContainer}>
                        {itemData.photo1 || itemData.photo2 || itemData.photo3 ?
                            <img src={coverPhoto} alt="Item Preview" className={ItemCSS.coverPhoto} />
                            : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                        }
                    </div>
                    <div className={ItemCSS.thumnailArea}>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo1 ?
                                <img src={itemData.photo1} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} onKeyDown={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo2 ?
                                <img src={itemData.photo2} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} onKeyDown={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                        <div className={ItemCSS.thumnailPhotoContainer}>
                            {itemData.photo3 ?
                                <img src={itemData.photo3} alt="Item Preview" className={ItemCSS.thumnailPhoto} onClick={changeCoverPhoto} onKeyDown={changeCoverPhoto} />
                                : <div className={ItemCSS.thumnailPhotoEmpty}></div>
                            }
                        </div>
                    </div>
                </div>
                {userType === 'seller-without-buyer' &&
                    <>
                        <div className={LayoutCSS.title}>
                            <h2 className={LayoutCSS.isCentered}>Edit Item Form</h2>
                        </div>
                        <ItemFormInfo itemData={itemData} />
                    </>
                }
                {(userType === 'seller-with-buyer' && itemData.transactionData?.status === 'Awaiting Time Confirmation') && <ItemFormConfirmOrder item={itemData} />}
                {interestedBuyer && <ItemFormBuyItem itemData={itemData} />}
            </Content>
            <SideNav>
                <div className={SideNavCSS.sideNavRow}>
                    <p className={SideNavCSS.sideNavRow__itemCount}>Item Status</p>
                    {(!itemData.transactionData) && <p className={SideNavCSS.sideNavRow__text}>This item doesn't have a buyer yet.</p>}
                    {(itemData.transactionData && ['potential-buyer', 'non-user'].includes(userType)) && <p className={SideNavCSS.sideNavRow__text}>This item already has a buyer.</p>}
                    {(itemData.transactionData?.status === "Awaiting Time Confirmation" && userType === 'buyer') && <p className={SideNavCSS.sideNavRow__text}>The seller has been notified of your interest. Once they confirm their availability, you'll be notified with the final details.</p>}
                    {(itemData.transactionData?.status === "Awaiting Meetup" && ['seller-with-buyer', 'buyer'].includes(userType)) &&
                        <>
                            {itemData.transactionData?.deliveryMethod === 'lobby' && <p className={SideNavCSS.sideNavRow__text}>Meet in the lobby</p>}
                            {itemData.transactionData?.deliveryMethod === 'pickUp' && <p className={SideNavCSS.sideNavRow__text}>Meet at suite {seller?.suite}</p>}
                            {itemData.transactionData?.deliveryMethod === 'dropOff' && <p className={SideNavCSS.sideNavRow__text}>Meet at suite {userData?.suite}</p>}
                            <p className={SideNavCSS.sideNavRow__text}>on {itemData.transactionData?.deliveryTime}</p>
                        </>
                    }
                    {(itemData.transactionData?.status === "Complete" && ['seller-with-buyer', 'buyer'].includes(userType)) && <p className={SideNavCSS.sideNavRow__text}>This item has already been bought.</p>}
                    {(!itemData.transactionData?.status && !interestedBuyer && userType === 'potential-buyer') && <button className={ItemCSS.transactionButton} onClick={onClickBuy}>Buy</button>}
                    {(!itemData.transactionData?.status && !interestedBuyer && userType === 'non-user') && <Link to="/sign-in"><button className={ItemCSS.transactionButton}>Sign In To Buy Item</button></Link>}
                    {(userType === 'seller-without-buyer') && <button className={ItemCSS.transactionButton} onClick={deleteItem}>Delete This Item</button>}
                    {(itemData.transactionData?.status && itemData.transactionData?.status !== 'Complete' && ['seller-with-buyer', 'buyer'].includes(userType)) && <button className={SideNavCSS.statusButton} onClick={cancelOrder}>Cancel Order</button>}
                </div>
                <div className={SideNavCSS.sideNavRow}>
                    <div style={((["Awaiting Time Confirmation", "Awaiting Meetup", "Complete"].includes(itemData.transactionData?.status) && ['seller-with-buyer', 'buyer'].includes(userType)) || interestedBuyer) ? { opacity: "100%" } : { opacity: "40%" }}>
                        <p className={SideNavCSS.sideNavRow__itemCount}>Step 1</p>
                        {(userType === 'non-user') && <p className={SideNavCSS.sideNavRow__text}>The buyer selects when and where they’d like to meet the seller</p>}
                        {(userType !== 'non-user') && <p className={SideNavCSS.sideNavRow__text}>{['potential-buyer'].includes(userType) ? "Select when and where you’d like to meet the seller" : "An order has been placed"}</p>}
                        {(userType === 'potential-buyer' && interestedBuyer) && <p className={ItemCSS.instructions}>Follow the steps at the bottom of this page</p>}
                    </div>
                </div>
                <div className={SideNavCSS.sideNavRow}>
                    <div style={["Awaiting Time Confirmation", "Awaiting Meetup", "Complete"].includes(itemData.transactionData?.status) && ['seller-with-buyer', 'buyer'].includes(userType) ? { opacity: "100%" } : { opacity: "40%" }}>
                        <p className={SideNavCSS.sideNavRow__itemCount}>Step 2</p>
                        {(userType === 'non-user') && <p className={SideNavCSS.sideNavRow__text}>The seller selects a time from the buyer's available times</p>}
                        {(userType !== 'non-user') && <p className={SideNavCSS.sideNavRow__text}>{userType === 'buyer' ? "Wait for the seller to confirm the time of your meeting" : "Select when and where you’d like to meet the buyer"}</p>}
                    </div>
                </div>
                <div className={SideNavCSS.sideNavRow}>
                    <div style={["Awaiting Meetup", "Complete"].includes(itemData.transactionData?.status) && ['seller-with-buyer', 'buyer'].includes(userType) ? { opacity: "100%" } : { opacity: "40%" }}>
                        <p className={SideNavCSS.sideNavRow__itemCount}>Step 3</p>
                        {(userType === 'non-user') && <p className={SideNavCSS.sideNavRow__text}>The seller & buyer meet</p>}
                        {(userType !== 'non-user') && <p className={SideNavCSS.sideNavRow__text}>Mark your calendar & {userType === 'buyer' ? "meet the seller" : "meet the buyer"}</p>}
                        {(itemData.transactionData?.status === 'Complete' && userType === 'seller-with-buyer') &&
                            <>
                                <p className={SideNavCSS.sideNavRow__text}>Didn't end up selling your item?</p>
                                <button className={SideNavCSS.statusButton} onClick={cancelOrder}>Make Live Again</button>
                            </>
                        }
                    </div>
                </div>
            </SideNav>
        </Layout>
    )
}

export default ItemPage