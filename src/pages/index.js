import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../components/layout'
import { NotificationsList } from '../components/notifications'
import { ItemCard, ItemCardList } from '../components/items'
import SideNavContent from '../components/side-nav'
import { useUser } from "../context/UserContext"
import * as LayoutCSS from '../css/layout.module.css'
import wealthsimple_logo from '../images/wealthsimple.png'

const IndexPage = ({ location }) => {
  const [filter, setFilter] = useState('all items')
  const firebaseContext = useUser()
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check to see if user has a success or error message to see
    if (location.state?.message) { setMessage(location.state?.message) }
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
      <Content message={message} setMessage={setMessage}>
      {(firebaseContext?.userAuth && !firebaseContext?.userData?.acceptedPaymentMethods?.includes('wealthsimple cash')) && <a href="https://my.wealthsimple.com/app/public/cash-referral-signup?handle=$lamarelimbo" className={LayoutCSS.referralLink} target="_blank" rel="noreferrer"><img src={wealthsimple_logo} alt="Wealthsimple logo" className={LayoutCSS.wealthsimpleLogo} />Don't have cash on hand? Give the Wealthsimple Cash app a try. It's Canada's fastest and simplest way to send and receive money. No fees and totally secure. Plus, you can get a free $25 if you sign up with my referral link.</a>}
        {firebaseContext?.userData?.notifications?.length > 0 &&
          <div className={LayoutCSS.aboutSection}>
            <p className={LayoutCSS.aboutTagline}>You have {firebaseContext?.userData?.notifications.length} {firebaseContext?.userData?.notifications.length > 1 ? 'notifications' : 'notification'}</p>
            <NotificationsList />
          </div>
        }
        {!firebaseContext?.userAuth &&
          <div className={LayoutCSS.aboutSection}>
            <p className={LayoutCSS.aboutTagline}>For when you want to sell your stuff, <br />but you don’t want to take off your pajamas.</p>
            <p className={LayoutCSS.aboutDescription}>Welcome to Suite Sale! Built for the residents of 665 Roselawn Ave. The next time you want to sell something, consider going local and avoid packaging, long delivery times, and best of all keep 100% of your profits!</p>
            <Link to="/about" className={LayoutCSS.aboutLink}>Learn More</Link>
          </div>
        }
        {filter !== 'all items' &&
          <div className={LayoutCSS.aboutSection}>
            <h1 className={LayoutCSS.aboutTagline}>Showing you {filter}</h1>
          </div>
        }
        {firebaseContext?.userAuth &&
          <ItemCard create='true' />
        }
        <ItemCardList filter={filter} />
      </Content>
      <SideNav>
        <SideNavContent query={setFilter} />
      </SideNav>
    </Layout>
  )
}

export default IndexPage