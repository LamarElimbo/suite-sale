import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { getItemTags } from './items'
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type, tagSearch = () => null }) => {
    const [tags, setTags] = useState()
    const { userData } = useUser()

    useEffect(() => {
        function getTags() {
            getItemTags()
                .then((itemsList) => {
                    let content = []
                    for (let tag in itemsList) {
                        content.push(
                            <Link to={`/?tag=${tag}`} key={tag} className={SideNavCSS.sideNavRow} onClick={tagSearch(tag)}>
                                <p className={SideNavCSS.sideNavRow__title}>{tag}</p>
                                <p>{itemsList[tag]} Items</p>
                            </Link>
                        )
                    }
                    setTags(content)
                })
        }
        getTags()
    }, [tagSearch])


    switch (type) {
        default:
            return <>{tags}</> //return all tags
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
                        <p className={SideNavCSS.sideNavRow__title}>Your saved items</p>
                        <p>{userData?.itemsSaved.length} Items</p>
                    </Link>
                    <Link to="/account/account-settings" className={SideNavCSS.sideNavRow}>
                        <p className={SideNavCSS.sideNavRow__title}>Your account settings</p>
                    </Link>
                </>
            )
    }
}

export default SideNavContent