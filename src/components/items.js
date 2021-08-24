import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'gatsby'
import { firestore } from "./firebase"
import { useUser } from "../context/UserContext"
import * as ItemsCSS from '../css/items.module.css'
import * as ItemCSS from '../css/item-page.module.css'

export const ItemCardList = ({ filter }) => {
    const [filteredItems, setFilteredItems] = useState([])
    const [nextButtonDisplay, setNextButtonDisplay] = useState('show')
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const itemsRef = useRef()

    const onClickLoadMore = () => {
        let itemDocs = []
        if (typeof itemsRef.current === Array) {
            let arrayQuery = itemsRef.current.slice(itemsRef.current.indexOf(filteredItems[filteredItems.length - 1]), 25)
            arrayQuery.forEach(itemId => itemDocs.push(firestore.collection('items').doc(itemId).get()))
            setFilteredItems([...filteredItems, itemDocs])
        } else {
            // Construct a new query starting at the last visible document, then get the next 25 items.
            itemsRef.current.orderBy("postedOn", "desc").startAfter(filteredItems[filteredItems.length - 1].postedOn).limit(25).get()
                .then(items => {
                    items.forEach(item => itemDocs.push(item.data()))
                    setFilteredItems(prev => [...prev, ...itemDocs])
                })
        }
    }

    useEffect(() => {
        if (filteredItems.length % 25 !== 0) setNextButtonDisplay('hide')
        if (filteredItems.length % 25 === 0) setNextButtonDisplay('show')
    }, [filteredItems])

    useEffect(() => {
        switch (filter) {
            default:
                itemsRef.current = firestore.collection("items").where('tags', 'array-contains', filter)
                break
            case 'all items':
                itemsRef.current = firestore.collection("items")
                break
            case 'in progress':
                if (userData?.itemsInProgress.length > 0) itemsRef.current = userData?.itemsInProgress
                break
            case 'posted items':
                if (userData?.itemsPosted.length > 0) itemsRef.current = firestore.collection("items").where('seller', '==', userData?.id)
                break
            case 'purchase history':
                if (userData?.itemsPurchased.length > 0) itemsRef.current = userData?.itemsPurchased
                break
            case 'saved':
                if (userData?.itemsSaved.length > 0) itemsRef.current = userData?.itemsSaved
                break
        }

        let itemDocs = []
        if (typeof itemsRef.current === Array) {
            let arrayQuery = itemsRef.current.slice(0, 25)
            arrayQuery.forEach(itemId => itemDocs.push(firestore.collection('items').doc(itemId).get()))
            setFilteredItems(itemDocs)
        } else {
            itemsRef?.current?.orderBy("postedOn", "desc").limit(25).get()
                .then(items => {
                    items.forEach(item => itemDocs.push(item.data()))
                    setFilteredItems(itemDocs)
                })
        }
    }, [filter])

    if (filteredItems?.length === 0) {
        return (
            <div style={{ border: "2px solid black", width: "100%", height: "100%" }}>
                <p className={ItemsCSS.itemStatus}>There aren't any items under this category</p>
            </div>
        )
    } else {
        return <>
            {filteredItems?.map(item => <ItemCard create='false' item={item} key={item.itemId} />)}
            {nextButtonDisplay === 'show' &&
                <div className={ItemsCSS.itemCardArea} style={{ cursor: "pointer", backgroundColor: "#333333" }} role="button" tabIndex={0} onClick={onClickLoadMore} onKeyDown={onClickLoadMore} >
                    <div className={ItemsCSS.itemCard} style={{ justifyContent: "space-around" }}>
                        <p className={ItemsCSS.itemCardCreate__text} style={{ width: "100%", textAlign: "center", margin: "0", color: "white", textTransform: "uppercase", fontSize: "18px" }}>Load more</p>
                    </div>
                </div>
            }
        </>
    }
}

export const ItemCard = ({ create, item }) => {
    const firebaseContext = useUser()
    if (create === 'true') {
        return (
            <Link to={firebaseContext?.userAuth ? '/item-create' : '/sign-in'} className={ItemsCSS.itemCardArea} style={{ backgroundColor: "#333333" }}>
                <div className={ItemsCSS.itemCard} style={{ justifyContent: "space-around" }}>
                    <p className={ItemsCSS.itemCardCreate__text}>Create a <br />new listing</p>
                </div>
            </Link>
        )
    }

    if (!item.transactionData || firebaseContext?.userData?.itemsInProgress.includes(item.itemId)) {
        return (
            <Link to={`/item?item=${item.itemId}`} state={{ item }} className={ItemsCSS.itemCardArea} id={item.itemId}>
                <div className={ItemsCSS.itemCard}>
                    <div className={ItemsCSS.itemCard__Info}>
                        <div className={ItemsCSS.cardInfo__cost}><sup className={ItemsCSS.dollarSign}>$</sup>{item.cost}</div>
                        <div>
                            <div className={ItemsCSS.cardInfo__item}>{item.item}</div>
                            {firebaseContext?.userData.itemsInProgress.includes(item.itemId) && <div className={ItemsCSS.cardInfo__status}>{item.transactionData?.status}</div>}
                        </div>
                    </div>
                    <div className={ItemsCSS.itemCard__imgArea}>
                        <div className={ItemsCSS.tagLabelArea}>{item?.tags?.map(tag => <div className={ItemsCSS.tagLabel} key={tag}>{tag}</div>)}</div>
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