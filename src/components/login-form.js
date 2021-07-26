import React, { useState, useRef, useEffect } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { form, inputItem, inputItem__label, inputItem__textInput, darkButton, formError } from '../css/form.module.css'

const LoginForm = () => {
  const email = useRef()
  const password = useRef('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formSubmitError, setFormSubmitError] = useState('')
  const firebaseContext = useUser()
  const login = firebaseContext?.login

  useEffect(() => {
    firebaseContext?.userAuth && navigate('/')
  })

  function onSubmitLogin(e) {
    e.preventDefault()
    setEmailError("")
    setPasswordError("")
    if (!email.current.value) setEmailError("You'll have to enter an email")
    if (!password.current.value) setPasswordError("You'll have to enter a password")
    if (email.current.value && password.current.value) {
        login(email.current.value, password.current.value)
        setFormSubmitError("It looks like either the email or password you entered was incorrect")
    }
  }

  return (
    <>
      <form className={form} onSubmit={onSubmitLogin}>
        <div className={inputItem}>
          <label>
            <p className={inputItem__label}>Email</p>
            <input className={inputItem__textInput}
              placeholder="example@gmail.com"
              type="text"
              ref={email} />
            {emailError && <p className={formError}>{emailError}</p>}
          </label>
        </div>
        <div className={inputItem}>
          <label>
            <p className={inputItem__label}>Password</p>
            <input className={inputItem__textInput}
              placeholder="*****"
              type="password"
              ref={password} />
            {passwordError && <p className={formError}>{passwordError}</p>}
          </label>
        </div>
        <div className={inputItem}>
          <input className={darkButton}
            type="submit"
            value="Login" />
          {(emailError || passwordError) && <p className={formError}>Looks like you missed a spot</p>}
          {formSubmitError && <p className={formError}>{formSubmitError}</p>}
        </div>
      </form>
    </>
  )
}

export default LoginForm