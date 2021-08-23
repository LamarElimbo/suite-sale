import * as React from 'react'
import { Layout, Content } from '../components/layout'
import * as AboutCSS from '../css/about-page.module.css'

const AboutPage = () => {

  return (
    <Layout pageTitle="About">
      <Content sideNav={false}>
        <div className={AboutCSS.aboutPage}>
          <section className={AboutCSS.sectionStyle}>
            <h2 className={AboutCSS.headerStyle}>Suite Sale</h2>
            <p className={AboutCSS.paragraphStyle}>For when you want to sell your stuff, but you don’t want to deal with packaging, shipping, hidden costs, or take off your pajamas.</p>
          </section>
          <section className={AboutCSS.sectionStyle}>
            <h2 className={AboutCSS.headerStyle}>About Suite Sale</h2>
            <p className={AboutCSS.paragraphStyle}>Welcome to Suite Sale! Built for the residents of 665 Roselawn Avenue by one of the residents of the building.</p>
            <p className={AboutCSS.paragraphStyle}>Inspired by local yard sales and having several items that I'd like to sell, I built this as a tool for us to post the things that we hope to sell easily. The best parts are that because this is local to the building we can avoid having to deal with packaging, shipping, distant deliveries, and transaction fees.</p>
            <p className={AboutCSS.paragraphStyle}>Which pretty much means that everyone gets to keep 100% of their profits and spend a lot less effort than we would normally need to in order to sell something.</p>
            <p className={AboutCSS.paragraphStyle}>I hope you like the site, I hope it can help you, and I hope to see you around the building!</p>
            <p className={AboutCSS.paragraphStyle}>Kindest regards,<br/>your friendly neighbourhood <span style={{ textDecoration: "line-through" }}>spider</span>man.</p>
          </section>
          <section className={AboutCSS.sectionStyle}>
            <h2 className={AboutCSS.headerStyle}>What if you don't keep cash on hand?</h2>
            <p className={AboutCSS.paragraphStyle}>Consider giving the Wealthsimple Cash app a try. Canada's fastest and simplest way to send and receive money. No fees and totally secure. You can get a free $25 if you sign up with <a href="https://my.wealthsimple.com/app/public/cash-referral-signup?handle=$lamarelimbo" target="_blank" className={AboutCSS.linkStyle} rel="noreferrer">my referral link</a>.</p>
            <p className={AboutCSS.paragraphStyle}>You can learn more about it here: <a href="https://www.wealthsimple.com/en-ca/magazine/cash" target="_blank" className={AboutCSS.linkStyle} rel="noreferrer">https://www.wealthsimple.com/en-ca/magazine/cash</a></p>
            <br />
          </section>
          <section className={AboutCSS.sectionStyle}>
            <h2 className={AboutCSS.headerStyle}>Have any questions or feedback?</h2>
            <p className={AboutCSS.paragraphStyle}>Please feel free to email me at: suitesale.ca@gmail.com</p>
            <br />
          </section>
        </div>
      </Content>
    </Layout>
  )
}

export default AboutPage