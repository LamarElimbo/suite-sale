import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { getAllItemTags } from './items'
import { NotificationsList } from './notifications'
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type, tagSearch=null }) => {
    const [tags, setTags] = useState()
    //const { userData, allItems } = useUser()

    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        function getTags() {
            const itemTags = getAllItemTags(allItems)
            let content = []
            for (let tag in itemTags) {
                content.push(
                    <Link to={`/?tag=${tag}`} key={tag} className={SideNavCSS.sideNavRow} onClick={tagSearch(tag)}>
                        <p className={SideNavCSS.sideNavRow__title}>{tag}</p>
                        <p>{itemTags[tag]} Items</p>
                    </Link>
                )
            }
            setTags(content)
        }
        if (tagSearch) {
            getTags()
        }
    }, [tagSearch, allItems])

    switch (type) {
        default:
            return <>{tags}</> //return all tags
        case 'account':
            return (
                <>
                    <Link to="/account/items-in-progress" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Items in progress</p>
                        <p>{userData.itemsInProgress.length} Items</p>
                    </Link>
                    <Link to="/account/posted-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your posted listings</p>
                        <p>{userData.itemsPosted.length} Items</p>
                    </Link>
                    <Link to="/account/purchase-history" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your purchase history</p>
                        <p>{userData.itemsPurchased.length} Items</p>
                    </Link>
                    <Link to="/account/saved-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your saved items</p>
                        <p>{userData.itemsSaved.length} Items</p>
                    </Link>
                    <Link to="/account/account-settings" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your account settings</p>
                    </Link>
                </>
            )
        case 'notifications':
            return (
                <>
                    <div className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>You have {userData.notifications.length} {userData.notifications.length > 1 ? 'notifications' : 'notification'}</p>
                    </div>  
                    <NotificationsList/>
                </>
            )
    }
}

export default SideNavContent