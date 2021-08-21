import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { firestore, firebase } from "./firebase"
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type }) => {
    const [tags, setTags] = useState()
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData

    useEffect(() => {
        async function getTags() {
            const tags = await firestore.collection('tags').doc("tagsList").get()
            const itemTags = tags.data()
            let allTags = []
            Object.keys(itemTags)
                .sort()
                .forEach((v) => allTags.push([v, itemTags[v]]))
            let content = []
            allTags.forEach((tag) => {
                if (tag[1] === 0) firestore.collection('tags').doc("tagsList").update({[tag[0]]: firebase.firestore.FieldValue.delete()})
                content.push(
                    <Link to={`/?tag=${tag[0]}`} key={tag[0]} className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>{tag[0]}</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{tag[1]} Item{tag[1] > 1 && 's'}</p>
                    </Link>
                )
            })
            setTags(content)
        }
        if (type !== 'account' && type !== 'notifications') getTags()
    }, [type])

    switch (type) {
        default:
            return <>{tags}</> //return all tags
        case 'account':
            return (
                <>
                    <Link to="/account/items-in-progress" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your Items in progress</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{userData?.itemsInProgress.length} Items</p>
                    </Link>
                    <Link to="/account/posted-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your posted listings</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{userData?.itemsPosted.length} Items</p>
                    </Link>
                    <Link to="/account/purchase-history" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your purchase history</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{userData?.itemsPurchased.length} Items</p>
                    </Link>
                    <Link to="/account/saved-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your cart</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{userData?.itemsSaved.length} Items</p>
                    </Link>
                    <Link to="/account/account-settings" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your account settings</p>
                    </Link>
                </>
            )
    }
}

export default SideNavContent