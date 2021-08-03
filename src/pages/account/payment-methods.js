import React, { useEffect, useState } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangePaymentMethodPage = () => {
    const [cashPaymentNotification, setCashPaymentNotification] = useState(false)
    const [wealthsimpleCashPayments, setWealthsimpleCashPayments] = useState(false)
    const [otherPaymentCheckbox, setOtherPaymentCheckbox] = useState(false)
    const [otherPayment, setOtherPayment] = useState("")
    const firebaseContext = useUser()

    useEffect(() => {
        if (firebaseContext.userData?.acceptedPaymentMethods?.includes("wealthsimple cash")) setWealthsimpleCashPayments(true)
        if (firebaseContext.userData?.acceptedPaymentMethods?.length === 2) {
            const otherPaymentMethod = firebaseContext.userData?.acceptedPaymentMethods?.filter((method) => method !== "wealthsimple cash")
            setOtherPaymentCheckbox(true)
            setOtherPayment(otherPaymentMethod[0])
        }
    }, [firebaseContext])

    const triggerCashPaymentNotification = () => setCashPaymentNotification(true)
    const onChangeWealthsimpleCashPayments = () => setWealthsimpleCashPayments(!wealthsimpleCashPayments)
    const onChangeOtherPaymentCheckbox = () => {
        if (otherPaymentCheckbox) setOtherPayment("")
        setOtherPaymentCheckbox(!otherPaymentCheckbox)
    }
    const onChangeOtherPayment = (e) => setOtherPayment(e.target.value)

    const onSubmit = (e) => {
        e.preventDefault()
        let acceptedPayments = []
        if (wealthsimpleCashPayments) acceptedPayments.push('wealthsimple cash')
        if (otherPayment) acceptedPayments.push(otherPayment)
        firebaseContext?.updateAcceptedPaymentMethods(acceptedPayments)
        navigate('/', { state: { message: "paymentMethod" } })
    }

    !firebaseContext?.userAuth && navigate('/sign-in')
    return (
        <Layout pageTitle="Update Payments You Accept" headerLink="Logout">
            <Content contentTitle="Update the payment methods you accept" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <p className={FormCSS.inputItem__label}>Which payment methods<br />will you accept from your buyers?</p>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label className={FormCSS.inputItem__checkboxContainer} onClick={triggerCashPaymentNotification} onKeyDown={triggerCashPaymentNotification} role="button" tabIndex="0">
                                    <input className={FormCSS.inputItem__checkbox} type="checkbox" checked disabled />
                                    <span className={FormCSS.checkboxInput__checkmark}></span>
                                    <span className={FormCSS.checkboxInput__label}>Cash {cashPaymentNotification && <span className={FormCSS.formError}>All users must accept cash payment</span>}</span>
                                </label>

                                <label className={FormCSS.inputItem__checkboxContainer}>
                                    <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={wealthsimpleCashPayments === true || false} onChange={onChangeWealthsimpleCashPayments} />
                                    <span className={FormCSS.checkboxInput__checkmark}></span>
                                    <span className={FormCSS.checkboxInput__label}>Wealthsimple Cash</span>
                                </label>
                                <label className={FormCSS.inputItem__checkboxContainer}>
                                    <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={otherPaymentCheckbox === true || false} onChange={onChangeOtherPaymentCheckbox} />
                                    <span className={FormCSS.checkboxInput__checkmark}></span>
                                    <span className={FormCSS.checkboxInput__label}>Other</span>
                                </label>
                                {otherPaymentCheckbox &&
                                    <div style={{ padding: "30px" }}>
                                        <p className={FormCSS.inputItem__label}>What other payment method will you accept?</p>
                                        <input className={FormCSS.inputItem__textInput}
                                            type="tel"
                                            placeholder="Payment Method"
                                            value={otherPayment || ""}
                                            onChange={onChangeOtherPayment} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Update your payment method" />
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangePaymentMethodPage