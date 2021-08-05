import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import * as ItemsCSS from '../css/items.module.css'
import * as ItemCSS from '../css/item-page.module.css'
import add_icon from '../images/add_icon.png'

export const getAllItemTags = allItems => {
    var tags = []
    var setTags = {}

    allItems?.forEach(item => !item.transactionData && tags.push(...item.tags))
    tags?.forEach(tag => setTags[tag] = setTags[tag] ? setTags[tag]+1 : 1 )

    const orderedTags = Object.keys(setTags).sort().reduce(
        (tag, key) => {
            tag[key] = setTags[key];
            return tag;
        }, {}
    );

    return orderedTags //format = {tag1: count, tag2: count}
}

export const ItemCardList = ({ filter }) => {
    const [filteredItems, setFilteredItems] = useState([])
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        switch (filter) {
            default:
                setFilteredItems(allItems?.filter(item => item.tags.includes(filter)))
                break
            case 'all items':
                setFilteredItems(allItems)
                break
            case 'in progress':
                userData?.itemsInProgress.length > 0 && setFilteredItems(allItems?.filter(item => userData.itemsInProgress.includes(item.itemId)))
                break
            case 'posted items':
                userData?.itemsPosted.length > 0 && setFilteredItems(allItems?.filter(item => item.seller === userData.id))
                break
            case 'purchase history':
                userData?.itemsPurchased.length > 0 && setFilteredItems(allItems?.filter(item => userData.itemsPurchased.includes(item.itemId)))
                break
            case 'saved':
                userData?.itemsSaved.length > 0 && setFilteredItems(allItems?.filter(item => userData.itemsSaved.includes(item.itemId)))
                break
        }
    }, [filter, userData, allItems])

    if (filteredItems?.length === 0) {
        return (
            <div className={ItemsCSS.itemBuffer2}>
                <p className={ItemsCSS.itemStatus} style={{color: 'white'}}>There aren't any items under this category</p>
            </div>
            )
    } else {
        return <>
            {filteredItems?.map(item => <ItemCard create='false' item={item} key={item.itemId} />)}
            <div className={ItemsCSS.itemBuffer1}></div>
            <div className={ItemsCSS.itemBuffer2}></div>
        </>
    }
}

export const ItemCard = ({ create, item }) => {
    const firebaseContext = useUser()
    if (create === 'true') {
        return (
            <Link to={firebaseContext?.userAuth ? '/item-create' : '/sign-in'} className={ItemsCSS.itemCardArea}>
                <div className={ItemsCSS.itemCard}>
                    <p className={ItemsCSS.itemCardCreate__text}>Create a <br />new listing</p>
                    <img src={add_icon} className={ItemsCSS.itemCardCreate__icon} alt="Add a new listing" />
                </div>
            </Link>
        )
    }

    if (!item.transactionData || firebaseContext?.userData.itemsInProgress.includes(item.itemId)) {
        return (
            <Link to={`/item?item=${item.itemId}`} state={{ item }} className={ItemsCSS.itemCardArea} id={item.itemId}>
                <div className={ItemsCSS.itemCard}>
                    <div className={ItemsCSS.itemCard__Info}>
                        <div className={ItemsCSS.cardInfo__cost}><sup className={ItemsCSS.dollarSign}>$</sup>{item.cost}</div>
                        <div className={ItemsCSS.cardInfo__item}>{item.item}</div>
                        {firebaseContext?.userData.itemsInProgress.includes(item.itemId) && <div className={ItemsCSS.cardInfo__status}>{item.transactionData?.status}</div>}
                    </div>
                    <div className={ItemsCSS.itemCard__imgArea}>
                        {item.photo1 ?
                            <img className={ItemsCSS.itemCard__img} src={item.photo1 && item.photo1} alt="Item Preview" />
                            :
                            <div className={ItemCSS.thumnailPhotoEmpty} style={{ border: "none", height: "100%" }}></div>
                        }
                    </div>
                </div>
            </Link>
        )
    }

    return null
}