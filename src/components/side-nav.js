import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { getAllItemTags } from './items'
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type, query = null }) => {
    const [tags, setTags] = useState()
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        function getTags() {
            const itemTags = getAllItemTags(allItems)
            let content = []
            for (let tag in itemTags) {
                content.push(
                    <Link to={`/?tag=${tag}`} key={tag} className={SideNavCSS.sideNavRow} onClick={query(tag)}>
                        <p className={SideNavCSS.sideNavRow__title}>{tag}</p>
                        <p className={SideNavCSS.sideNavRow__itemCount}>{itemTags[tag]} Item{itemTags[tag] > 1 && 's'}</p>
                    </Link>
                )
            }
            setTags(content)
        }
        if (type !== 'account' && type !== 'notifications' && query) getTags()
    }, [type, query, allItems])

    switch (type) {
        default:
            return <>{tags}</> //return all tags
        case 'account':
            return (
                <>
                    <Link to="/account/items-in-progress" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Items in progress</p>
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