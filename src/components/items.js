import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { firestore } from "./firebase"
import { useUser } from "../context/UserContext"
import * as ItemsCSS from '../css/items.module.css'
import add_icon from '../images/add_icon.png'

export async function getItemTags() {

    return firestore
        .collection("items")
        .get()
        .then((listItems) => {
            const docItems = []
            listItems.forEach((doc) => docItems.push(doc.data()))

            var tags = []
            var setTags = {}

            docItems.forEach((doc) => {
                tags.push(...doc.tags)
            })

            tags.forEach((tag) => {
                if (setTags[tag]) {
                    setTags[tag]++
                } else {
                    setTags[tag] = 1
                }
            })
            return setTags //format = {tag1: count, tag1: count}
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

export const ItemCardList = ({ filter }) => {
    const [filteredItems, setFilteredItems] = useState([])
    const { userData } = useUser()

    useEffect(() => {
        switch (filter) {
            default:
                firestore
                    .collection("items").where("tags", "array-contains", filter)
                    .get()
                    .then((filterdList) => {
                        const docItems = []
                        filterdList.forEach((doc) => {
                            const data = doc.data()
                            data['id'] = doc.id
                            docItems.push(data)
                        })
                        setFilteredItems(docItems)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                break

            case 'all items':
                firestore
                    .collection("items")
                    .get()
                    .then((listItems) => {
                        const docItems = []
                        listItems.forEach((doc) => {
                            const data = doc.data()
                            data['id'] = doc.id
                            docItems.push(data)
                        })
                        setFilteredItems(docItems)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                break

            case 'posted listings':
                if (userData) {
                    firestore
                        .collection("items").where("poster", "==", userData?.id)
                        .get()
                        .then((listItems) => {
                            const docItems = []
                            listItems.forEach((doc) => {
                                const data = doc.data()
                                data['id'] = doc.id
                                docItems.push(data)
                            })
                            setFilteredItems(docItems)
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                    }
                    break

            case 'purchase history':
                if (userData) {
                    firestore
                        .collection("items").where("id", "in", userData?.itemsPurchased)
                        .get()
                        .then((listItems) => {
                            const docItems = []
                            listItems.forEach((doc) => {
                                const data = doc.data()
                                data['id'] = doc.id
                                docItems.push(data)
                            })
                            setFilteredItems(docItems)
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                    }
                    break

            case 'saved':
                if (userData) {
                    firestore
                        .collection("items").where("id", "in", userData?.itemsSaved)
                        .get()
                        .then((listItems) => {
                            const docItems = []
                            listItems.forEach((doc) => {
                                const data = doc.data()
                                data['id'] = doc.id
                                docItems.push(data)
                            })
                            setFilteredItems(docItems)
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                    }
                    break
        }
    }, [filter, userData])

    return (
        <>
            {filteredItems.map(item => <ItemCard create='false' item={item} key={item.id} />)}
        </>
    )
}

export const ItemCard = ({ create, item }) => {

    if (create === 'true') {
        return (
            <Link to="/item-create" className={ItemsCSS.itemCardCreate}>
                <p className={ItemsCSS.itemCardCreate__text}>Create a <br />new listing</p>
                <img src={add_icon} className={ItemsCSS.itemCardCreate__icon} alt="Add icon" />
            </Link>
        )
    }

    return (
        <Link to={`/item?item=${item.id}`} state={{ item }} className={ItemsCSS.itemCard} id={item.id}>
            <div className={ItemsCSS.itemCard__Info}>
                <div className={ItemsCSS.cardInfo__cost}><sup className={ItemsCSS.dollarSign}>$</sup>{item.cost}</div>
                <div className={ItemsCSS.cardInfo__item}>{item.item}</div>
            </div>
            <div className={ItemsCSS.itemCard__imgArea}>
                <img className={ItemsCSS.itemCard__img} src={item.photo1 && item.photo1} alt="Item Preview" />
            </div>
        </Link>
    )
}