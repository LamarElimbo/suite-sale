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

  const onSetWealthsimpleCashPayments = () => firebaseContext?.updateAcceptedPaymentMethods(['wealthsimple cash'])

  return (
    <Layout pageTitle="Home">
      <Content message={message} setMessage={setMessage}>
        {(firebaseContext?.userAuth && !firebaseContext?.userData?.acceptedPaymentMethods?.includes('wealthsimple cash')) &&
          <div className={LayoutCSS.referralLink}>
            <div className={ LayoutCSS.referralInfo }><img src={wealthsimple_logo} alt="Wealthsimple logo" className={LayoutCSS.wealthsimpleLogo} />Don't have cash on hand? Give the Wealthsimple Cash app a try. It's Canada's fastest and simplest way to send and receive money. No fees and totally secure. Plus, you can get a free $10 if you sign up with my referral link.</div>
            <div className={LayoutCSS.referralButtons}>
              <a href="https://my.wealthsimple.com/app/public/cash-referral-signup?handle=$lamarelimbo" target="_blank" rel="noreferrer" className={LayoutCSS.referralButton}>Get your $10</a>
              <button className={LayoutCSS.statusButton} onClick={onSetWealthsimpleCashPayments} className={LayoutCSS.referralButton}>Already got it</button>
            </div>
          </div>}
        {firebaseContext?.userData?.notifications?.length > 0 &&
          <div className={LayoutCSS.aboutSection}>
            <p className={LayoutCSS.aboutTagline}>You have {firebaseContext?.userData?.notifications.length} {firebaseContext?.userData?.notifications.length > 1 ? 'notifications' : 'notification'}</p>
            <NotificationsList />
          </div>
        }
        {!firebaseContext?.userAuth &&
          <div className={LayoutCSS.aboutSection}>
            <p className={LayoutCSS.aboutTagline}>For when you want to sell your stuff, <br />but you don’t want to take off your pajamas.</p>
            <p className={LayoutCSS.aboutDescription}>Hey neighbour & welcome to Suite Sale! I built this website for my fellow residents of 665 Roselawn Ave, because my family and I wanted to have a little yard sale. Since I'm the web developer of the house, I convinced them that it might be a nice idea to create a tool where anyone in the building could post things that they might want to sell. So, feel free to take a look around and to add your own listings. I don't have an end date in mind, so take your time and peruse and post whenever you please.</p>
            <Link to="/about" className={LayoutCSS.aboutLink}>Learn More</Link>
          </div>
        }
        {filter !== 'all items' &&
          <div className={LayoutCSS.aboutSection}>
            <h1 className={LayoutCSS.aboutTagline}>Showing you {filter}</h1>
          </div>
        }
        <ItemCard create='true' />
        <ItemCardList filter={filter} />
      </Content>
      <SideNav home='true'>
        <SideNavContent />
      </SideNav>
    </Layout>
  )
}

export default IndexPage