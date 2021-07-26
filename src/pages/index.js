import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../components/layout'
import { ItemCard, ItemCardList } from '../components/items'
import SideNavContent from '../components/side-nav'
import { useUser } from "../context/UserContext"
import * as LayoutCSS from '../css/layout.module.css'

const IndexPage = ({ location }) => {
  const [filter, setFilter] = useState('all items')
  const firebaseContext = useUser()

  useEffect(() => {
    // Check to see if user is filtering items based on a tag
    if (location.search) {
      const urlParams = new URLSearchParams(location.search);
      setFilter(urlParams.get('tag'))
    } else {
      setFilter('all items')
    }
  }, [location, filter])

  return (
    <Layout pageTitle="Home">
      <Content>
        {firebaseContext?.userAuth ?
          <ItemCard create='true' />
          :
          <div className={LayoutCSS.aboutSection}>
            <p className={LayoutCSS.aboutTagline}>For when you want to sell your stuff, but you don’t want to take off your pajamas.</p>
            <p className={LayoutCSS.aboutDescription}>Welcome to Suite Sale! Built for the residents of 665 Roselawn Ave. The next time you want to sell something, consider going local and avoid packaging, long delivery times, and best of all keep 100% of your profits!</p>
            <Link to="/about" className={LayoutCSS.aboutLink}>Learn More</Link>
          </div>
        }
        <ItemCardList filter={filter} />
      </Content>
      <SideNav>
        {firebaseContext?.userData?.notifications.length > 0 &&
          <SideNavContent type='notifications' />
        }
        <SideNavContent tagSearch={setFilter} />
      </SideNav>
    </Layout>
  )
}

export default IndexPage