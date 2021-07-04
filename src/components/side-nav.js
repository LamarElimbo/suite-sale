import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import { getItemTags } from './items'
import * as SideNavCSS from '../css/side-nav.module.css'

const SideNavContent = ({ type }) => {
    const [tags, setTags] = useState()
    const { userData } = useUser()

    useEffect(() => {
        function getTags() {
            getItemTags()
                .then((itemsList) => {
                    let content = []
                    for (let tag in itemsList) {
                        content.push(
                            <Link to= "/" state={{tag}} key={tag} className={SideNavCSS.sideNavRow}>
                                <p className={SideNavCSS.sideNavRow__title}>{tag}</p>
                                <p>{itemsList[tag]} Items</p>
                            </Link>
                        )
                    }
                    setTags(content)
                })
        }
        getTags()
    }, [])
    

    switch (type) {
        default :
            return <>{tags}</> //return all tags
        case 'posted listings': 
            return (
                //return all posts
                <div className={SideNavCSS.sideNavRow}>
                    <p className={SideNavCSS.sideNavRow__title}>Your posted listings</p>
                    <p>{userData?.itemsPosted.length} Items</p>
                </div>
              )
        case 'purchase history': 
            return (
                //returnall purchases
                <div className={SideNavCSS.sideNavRow}>
                    <p className={SideNavCSS.sideNavRow__title}>Your purchase history</p>
                    <p>{userData?.itemsPurchased.length} Items</p>
                </div>
              )
        case 'saved': 
            return (
                <div className={SideNavCSS.sideNavRow}>
                    <p className={SideNavCSS.sideNavRow__title}>Your saved items</p>
                    <p>{userData?.itemsSaved.length} Items</p>
                </div>
              )
        case 'account settings': 
            return (
                <div className={SideNavCSS.sideNavRow}>
                    <p className={SideNavCSS.sideNavRow__title}>Your account settings</p>
                    <p>10 Items</p>
                </div>
              )
    }
}

export default SideNavContent