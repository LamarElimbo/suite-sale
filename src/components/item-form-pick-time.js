import React, { useState, useEffect } from 'react'
import * as FormCSS from '../css/form.module.css'
import toggle_right_icon from '../images/toggle_right_icon.png'
import toggle_down_icon from '../images/toggle_down_icon.png'

const ItemFormPickTime = ({ item, availableTimes, setAvailableTimes }) => {
    const [day1Display, setDay1Display] = useState(true)
    const [day2Display, setDay2Display] = useState(false)
    const [day3Display, setDay3Display] = useState(false)
    const [day1, setDay1] = useState('')
    const [day2, setDay2] = useState('')
    const [day3, setDay3] = useState('')
    const timeSelection = [{ "t12": "12:00 am", "t24": "0:00" }, { "t12": "12:15 am", "t24": "0:15" }, { "t12": "12:30 am", "t24": "0:30" }, { "t12": "12:45 am", "t24": "0:45" }, { "t12": "1:00 am", "t24": "1:00" }, { "t12": "1:15 am", "t24": "1:15" }, { "t12": "1:30 am", "t24": "1:30" }, { "t12": "1:45 am", "t24": "1:45" }, { "t12": "2:00 am", "t24": "2:00" }, { "t12": "2:15 am", "t24": "2:15" }, { "t12": "2:30 am", "t24": "2:30" }, { "t12": "2:45 am", "t24": "2:45" }, { "t12": "3:00 am", "t24": "3:00" }, { "t12": "3:15 am", "t24": "3:15" }, { "t12": "3:30 am", "t24": "3:30" }, { "t12": "3:45 am", "t24": "3:45" }, { "t12": "4:00 am", "t24": "4:00" }, { "t12": "4:15 am", "t24": "4:15" }, { "t12": "4:30 am", "t24": "4:30" }, { "t12": "4:45 am", "t24": "4:45" }, { "t12": "5:00 am", "t24": "5:00" }, { "t12": "5:15 am", "t24": "5:15" }, { "t12": "5:30 am", "t24": "5:30" }, { "t12": "5:45 am", "t24": "5:45" }, { "t12": "6:00 am", "t24": "6:00" }, { "t12": "6:15 am", "t24": "6:15" }, { "t12": "6:30 am", "t24": "6:30" }, { "t12": "6:45 am", "t24": "6:45" }, { "t12": "7:00 am", "t24": "7:00" }, { "t12": "7:15 am", "t24": "7:15" }, { "t12": "7:30 am", "t24": "7:30" }, { "t12": "7:45 am", "t24": "7:45" }, { "t12": "8:00 am", "t24": "8:00" }, { "t12": "8:15 am", "t24": "8:15" }, { "t12": "8:30 am", "t24": "8:30" }, { "t12": "8:45 am", "t24": "8:45" }, { "t12": "9:00 am", "t24": "9:00" }, { "t12": "9:15 am", "t24": "9:15" }, { "t12": "9:30 am", "t24": "9:30" }, { "t12": "9:45 am", "t24": "9:45" }, { "t12": "10:00 am", "t24": "10:00" }, { "t12": "10:15 am", "t24": "10:15" }, { "t12": "10:30 am", "t24": "10:30" }, { "t12": "10:45 am", "t24": "10:45" }, { "t12": "11:00 am", "t24": "11:00" }, { "t12": "11:15 am", "t24": "11:15" }, { "t12": "11:30 am", "t24": "11:30" }, { "t12": "11:45 am", "t24": "11:45" }, { "t12": "12:00 pm", "t24": "12:00" }, { "t12": "12:15 pm", "t24": "12:15" }, { "t12": "12:30 pm", "t24": "12:30" }, { "t12": "12:45 pm", "t24": "12:45" }, { "t12": "1:00 pm", "t24": "13:00" }, { "t12": "1:15 pm", "t24": "13:15" }, { "t12": "1:30 pm", "t24": "13:30" }, { "t12": "1:45 pm", "t24": "13:45" }, { "t12": "2:00 pm", "t24": "14:00" }, { "t12": "2:15 pm", "t24": "14:15" }, { "t12": "2:30 pm", "t24": "14:30" }, { "t12": "2:45 pm", "t24": "14:45" }, { "t12": "3:00 pm", "t24": "15:00" }, { "t12": "3:15 pm", "t24": "15:15" }, { "t12": "3:30 pm", "t24": "15:30" }, { "t12": "3:45 pm", "t24": "15:45" }, { "t12": "4:00 pm", "t24": "16:00" }, { "t12": "4:15 pm", "t24": "16:15" }, { "t12": "4:30 pm", "t24": "16:30" }, { "t12": "4:45 pm", "t24": "16:45" }, { "t12": "5:00 pm", "t24": "17:00" }, { "t12": "5:15 pm", "t24": "17:15" }, { "t12": "5:30 pm", "t24": "17:30" }, { "t12": "5:45 pm", "t24": "17:45" }, { "t12": "6:00 pm", "t24": "18:00" }, { "t12": "6:15 pm", "t24": "18:15" }, { "t12": "6:30 pm", "t24": "18:30" }, { "t12": "6:45 pm", "t24": "18:45" }, { "t12": "7:00 pm", "t24": "19:00" }, { "t12": "7:15 pm", "t24": "19:15" }, { "t12": "7:30 pm", "t24": "19:30" }, { "t12": "7:45 pm", "t24": "19:45" }, { "t12": "8:00 pm", "t24": "20:00" }, { "t12": "8:15 pm", "t24": "20:15" }, { "t12": "8:30 pm", "t24": "20:30" }, { "t12": "8:45 pm", "t24": "20:45" }, { "t12": "9:00 pm", "t24": "21:00" }, { "t12": "9:15 pm", "t24": "21:15" }, { "t12": "9:30 pm", "t24": "21:30" }, { "t12": "9:45 pm", "t24": "21:45" }, { "t12": "10:00 pm", "t24": "22:00" }, { "t12": "10:15 pm", "t24": "22:15" }, { "t12": "10:30 pm", "t24": "22:30" }, { "t12": "10:45 pm", "t24": "22:45" }, { "t12": "11:00 pm", "t24": "23:00" }, { "t12": "11:15 pm", "t24": "23:15" }, { "t12": "11:30 pm", "t24": "23:30" }, { "t12": "11:45 pm", "t24": "23:45" }]
    const timeDate = new Date()
    const timeString = timeDate.toLocaleTimeString()

    const toggleDay1Display = () => {
        setDay1Display(!day1Display)
        setDay2Display(false)
        setDay3Display(false)
    }
    const toggleDay2Display = () => {
        setDay1Display(false)
        setDay2Display(!day2Display)
        setDay3Display(false)
    }
    const toggleDay3Display = () => {
        setDay1Display(false)
        setDay2Display(false)
        setDay3Display(!day3Display)
    }

    useEffect(() => {
        if (item.transactionData) {
            setDay1(item.transactionData.day1)
            setDay2(item.transactionData.day2)
            setDay3(item.transactionData.day3)
        } else {
            let day1Date = new Date()
            let day2Date = new Date()
            let day3Date = new Date()
            day2Date.setTime(day2Date.getTime() + (24 * 60 * 60 * 1000))
            day3Date.setTime(day3Date.getTime() + (48 * 60 * 60 * 1000))
            setDay1(day1Date.toDateString())
            setDay2(day2Date.toDateString())
            setDay3(day3Date.toDateString())
        }
    }, [item])

    const handleTimeSelection = (e) => {
        if (item.transactionData?.status === 'Awaiting Time Confirmation') {
            setAvailableTimes(e.target.id)
        } else {
            let selectedTimes = availableTimes
            if (selectedTimes.includes(e.target.id)) {
                const index = selectedTimes.indexOf(e.target.id)
                if (index > -1) {
                    selectedTimes.splice(index, 1)
                    setAvailableTimes([...selectedTimes])
                }
            } else {
                setAvailableTimes([...selectedTimes, e.target.id])
            }
        }
    }

    
    const displayTimes = (day) => {
        let date = ""
        let timeRange = []

        switch (day) {
            case 'day1':
                date = day1
                for (let i = 0; i < timeSelection.length; i++) {
                    if (timeSelection[i]['t24'].slice(0, 4) === timeString.slice(0, 4)) {
                        timeRange = timeSelection.slice(i + 1)
                        break
                    }
                }
                
                break
            case 'day2':
                date = day2
                timeRange = timeSelection
                break
            case 'day3':
                date = day3
                for (let i = 0; i < timeSelection.length; i++) {
                    if (timeSelection[i]['t24'].slice(0, 4) === timeString.slice(0, 4)) {
                        timeRange = timeSelection.slice(0, i + 1)
                        break
                    }
                }
                break
            default:
                return null
        }

        return (
            <>
                <p style={{ marginTop: "50px" }}>{date}</p>
                <div className={FormCSS.timeGrid}>
                    {(timeString.slice(3, 5) > '0' && timeString.slice(3, 5) <= '15' && day === "day1") && <div className={FormCSS.timeBoxOuter}></div>}
                    {(timeString.slice(3, 5) > '15' && timeString.slice(3, 5) <= '30' && day === "day1") && <><div className={FormCSS.timeBoxOuter}></div></>}
                    {(timeString.slice(3, 5) > '30' && timeString.slice(3, 5) <= '45' && day === "day1") && <><div className={FormCSS.timeBoxOuter}></div><div className={FormCSS.timeBoxOuter}></div><div className={FormCSS.timeBoxOuter}></div></>}
                    {timeRange.map(time => {
                        return (
                            <div key={day + "-" + time.t12.replace(/:| /g, '-')} className={FormCSS.timeBoxOuter}>
                                {(!item?.transactionData?.status) &&
                                    <div className={FormCSS.timeBoxInner + " " + (availableTimes?.includes(`${day} ${time.t12}`) ? FormCSS.selected : FormCSS.unselected)}
                                        id={`${day} ${time.t12}`}
                                        onClick={handleTimeSelection} onKeyDown={handleTimeSelection} role="button" tabIndex="0">{time.t12}</div>}
                                {(item?.transactionData?.status === 'Awaiting Time Confirmation' && item?.transactionData?.buyerAvailable?.includes(`${day} ${time.t12}`)) &&
                                    <div className={FormCSS.timeBoxInner + " " + (availableTimes === (`${day} ${time.t12}`) ? FormCSS.selected : FormCSS.unselected)}
                                        id={`${day} ${time.t12}`}
                                        onClick={handleTimeSelection} onKeyDown={handleTimeSelection} role="button" tabIndex="0">{time.t12}</div>}
                                {(item?.transactionData?.status === 'Awaiting Time Confirmation' && !item?.transactionData?.buyerAvailable.includes(`${day} ${time.t12}`)) &&
                                    <div className={FormCSS.timeBoxInner + " " + FormCSS.inactive} id={`${day} ${time.t12}`}>{time.t12}</div>}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    return (
        <>
            <div className={FormCSS.displayButtonArea}>
                <div className={FormCSS.displayButton} role="button" tabIndex="0" onClick={toggleDay1Display} onKeyDown={toggleDay1Display}>{day1}
                    {!day1Display ?
                        <img src={toggle_right_icon} className={FormCSS.displayButton__icon} alt="Open time display" />
                        :
                        <img src={toggle_down_icon} className={FormCSS.displayButton__icon} alt="Close time display" />
                    }
                </div>
                <div className={FormCSS.displayButton} role="button" tabIndex="0" onClick={toggleDay2Display} onKeyDown={toggleDay2Display}>{day2}
                    {!day2Display ?
                        <img src={toggle_right_icon} className={FormCSS.displayButton__icon} alt="Open time display" />
                        :
                        <img src={toggle_down_icon} className={FormCSS.displayButton__icon} alt="Close time display" />
                    }
                </div>
                <div className={FormCSS.displayButton} role="button" tabIndex="0" onClick={toggleDay3Display} onKeyDown={toggleDay3Display}>{day3}
                    {!day3Display ?
                        <img src={toggle_right_icon} className={FormCSS.displayButton__icon} alt="Open time display" />
                        :
                        <img src={toggle_down_icon} className={FormCSS.displayButton__icon} alt="Close time display" />
                    }
                </div>
            </div>
            <div style={day1Display ? { display: "block" } : { display: "none" }}>{displayTimes('day1')}</div>
            <div style={day2Display ? { display: "block" } : { display: "none" }}>{displayTimes('day2')}</div>
            <div style={day3Display ? { display: "block" } : { display: "none" }}>{displayTimes('day3')}</div>
        </>
    )
}

export default ItemFormPickTime