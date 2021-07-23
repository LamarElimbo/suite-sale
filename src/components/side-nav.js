import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { getAllItemTags } from './items'
import { NotificationsList } from './notifications'
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type, tagSearch = null, message = null }) => {
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
                    <Link to={`/?tag=${tag}`} key={tag} className={SideNavCSS.sideNavRow} onClick={tagSearch(tag)}>
                        <p className={SideNavCSS.sideNavRow__title}>{tag}</p>
                        <p>{itemTags[tag]} Item{itemTags[tag].length > 1 && 's'}</p>
                    </Link>
                )
            }
            setTags(content)
        }
        tagSearch && getTags()
    }, [tagSearch, allItems])

    const getMessage = () => {
        switch (message) {
            default:
                return null
            case 'item-create':
                return <p className={SideNavCSS.messageText}>Your item has been added! You can find all of your posted items in your account page</p>
            case 'item-update':
                return <p className={SideNavCSS.messageText}>Your item has been successfully updated!</p>
            case 'item-delete':
                return <p className={SideNavCSS.messageText}>Your item has been successfully deleted!</p>
            case 'email-update':
                return <p className={SideNavCSS.messageText}>Your email has been successfully updated!</p>
            case 'password-update':
                return <p className={SideNavCSS.messageText}>Your password has been successfully update!</p>
            case 'item-buy':
                return <p className={SideNavCSS.messageText}>The seller has been notified of your interest in this item. Once they confirm their ideal delivery time and then you'll be notified with the final details.</p>
            case 'welcome':
                return (
                    <>
                        <p className={SideNavCSS.messageText}>Welcome to Suite Sale! Built exclusively for the residents of 665 Roselawn Ave. The next time you want to sell something, consider going local and avoid packaging, long delivery times, and best of all keep 100% of your profits!</p>
                        <Link to="/about">
                            <button className={SideNavCSS.statusButton}>Learn More</button>
                        </Link>
                    </>
                )
        }
    }

    switch (type) {
        default:
            return (
                <>
                    {message &&
                        <div className={SideNavCSS.messageRow}>
                            <div className={SideNavCSS.message}>{getMessage()}</div>
                        </div>
                    }
                    {tags}
                </>
            ) //return all tags
        case 'account':
            return (
                <>
                    <Link to="/account/items-in-progress" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Items in progress</p>
                        <p>{userData?.itemsInProgress.length} Items</p>
                    </Link>
                    <Link to="/account/posted-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your posted listings</p>
                        <p>{userData?.itemsPosted.length} Items</p>
                    </Link>
                    <Link to="/account/purchase-history" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your purchase history</p>
                        <p>{userData?.itemsPurchased.length} Items</p>
                    </Link>
                    <Link to="/account/saved-items" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your cart</p>
                        <p>{userData?.itemsSaved.length} Items</p>
                    </Link>
                    <Link to="/account/account-settings" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your account settings</p>
                    </Link>
                </>
            )
        case 'notifications':
            return (
                <>
                    {message &&
                        <div className={SideNavCSS.messageRow}>
                            <div className={SideNavCSS.message}>{getMessage()}</div>
                        </div>
                    }
                    <div className={SideNavCSS.sideNavNotificationRow}>
                        <p className={SideNavCSS.sideNavNotificationRow__title}>You have {userData?.notifications.length} {userData?.notifications.length > 1 ? 'notifications' : 'notification'}</p>
                    </div>
                    <NotificationsList />
                </>
            )
    }
}

export default SideNavContent