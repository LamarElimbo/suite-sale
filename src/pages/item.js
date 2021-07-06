import React, { useState, useEffect } from 'react'
import { navigate } from "gatsby"
import { firestore } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemForm from '../components/item-form'
import * as FormCSS from '../css/form.module.css'
import * as ItemCSS from '../css/item-page.module.css'

const ItemPage = ({ location }) => {
    const [itemData, setItemData] = useState({})
    const [saved, setSaved] = useState(false)
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

    if (userData?.id === itemData.poster) {
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
                        {itemData.pickUp && <button className={ItemCSS.deliveryButton}>Pick Up</button>}
                        {itemData.dropOff && <button className={ItemCSS.deliveryButton}>Drop Off</button>}
                        {itemData.lobby && <button className={ItemCSS.deliveryButton}>Meet in Lobby</button>}
                        {itemData.transport && <button className={ItemCSS.deliveryButton}>Transport Help</button>}
                    </div>
                    <div className={ItemCSS.imageArea}>
                        <img src={itemData.photo1} alt="Item Preview" className={ItemCSS.photo1} />
                        <div className={ItemCSS.thumnailArea}>
                            {itemData.photo2 && <img src={itemData.photo2} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo3 && <img src={itemData.photo3} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                            {itemData.photo4 && <img src={itemData.photo4} alt="Item Preview" className={ItemCSS.thumnailPhoto} />}
                        </div>
                    </div>
                </Content>
                <SideNav>
                </SideNav>
            </Layout>
        )
    }
}

export default ItemPage