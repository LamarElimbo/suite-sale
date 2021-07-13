import React, { useState, useEffect, useRef } from 'react'
import { useUser } from "../context/UserContext"
import { getAllItemTags } from '../components/items'
import { imgStorage } from "../components/firebase"
import * as FormCSS from '../css/form.module.css'
import camera_icon from '../images/camera_icon.png'
import remove_icon from '../images/remove_icon.png'

const ItemForm = ({ itemData, handleSubmit }) => {
    const item = useRef()
    const cost = useRef('')
    const itemNotes = useRef('')
    const newTag = useRef('')
    const [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [photo1, setPhoto1] = useState('')
    const [photo2, setPhoto2] = useState('')
    const [photo3, setPhoto3] = useState('')
    const [photo4, setPhoto4] = useState('')
    const [pickUp, setPickUp] = useState(false)
    const [dropOff, setDropOff] = useState(false)
    const [lobby, setLobby] = useState(false)
    const [transport, setTransport] = useState(false)
    //const { userData, allItems } = useUser()
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems
    

    useEffect(() => {
        if (itemData) {
            item.current = itemData.item
            cost.current = itemData.cost
            itemNotes.current = itemData.itemNotes
            setTags(itemData.tags)
            setPhoto1(itemData.photo1)
            setPhoto2(itemData.photo2)
            setPhoto3(itemData.photo3)
            setPhoto4(itemData.photo4)
            setPickUp(itemData.pickUp)
            setDropOff(itemData.dropOff)
            setLobby(itemData.lobby)
            setTransport(itemData.transport)
        }
    }, [itemData])

    useEffect(() => {
        function getTags() {
            let content = []

            for (let tag in getAllItemTags(allItems)) {
                content.push(tag)
            }
            setExistingTags(content)
        }
        getTags()
    }, [allItems])

    const onTagSelection = (e) => {
        let selectedTags = tags
        if (selectedTags.includes(e.target.id)) {
            const index = selectedTags.indexOf(e.target.id)
            if (index > -1) {
                selectedTags.splice(index, 1)
                setTags([...selectedTags])
            }
        } else {
            setTags([...selectedTags, e.target.id])
        }
    }

    const onAddTag = () => {
        setExistingTags([...existingTags, newTag.current.value])
        setTags([...tags, newTag.current.value])
        newTag.current.value = ""
    }

    const onPhoto1Upload = (e) => setPhoto1(e.target.files[0])
    const onPhoto2Upload = (e) => setPhoto2(e.target.files[0])
    const onPhoto3Upload = (e) => setPhoto3(e.target.files[0])
    const onPhoto4Upload = (e) => setPhoto4(e.target.files[0])

    const onPhoto1Remove = (e) => {
        setPhoto1('')
        if (itemData) {
            const img1Ref = imgStorage.child(`${itemData.id}/1`)
            img1Ref.delete()
        }
    }
    const onPhoto2Remove = (e) => {
        setPhoto2('')
        if (itemData) {
            const img2Ref = imgStorage.child(`${itemData.id}/2`)
            img2Ref.delete()
        }
    }
    const onPhoto3Remove = (e) => {
        setPhoto3('')
        if (itemData) {
            const img3Ref = imgStorage.child(`${itemData.id}/3`)
            img3Ref.delete()
        }
    }
    const onPhoto4Remove = (e) => {
        setPhoto4('')
        if (itemData) {
            const img4Ref = imgStorage.child(`${itemData.id}/4`)
            img4Ref.delete()
        }
    }

    const onChangePickUp = () => setPickUp(!pickUp)
    const onChangeDropOff = () => setDropOff(!dropOff)
    const onChangeLobby = () => setLobby(!lobby)
    const onChangeTransport = () => setTransport(!transport)

    const onSubmit = (e) => {
        e.preventDefault()

        const updatedItemData = {
            seller: userData.id,
            item: item.current.value,
            cost: cost.current.value,
            photo1, photo2, photo3, photo4,
            itemNotes: itemNotes.current.value,
            tags,
            pickUp,
            dropOff,
            lobby,
            transport
        }

        handleSubmit(updatedItemData)
    }

    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Item</p>
                    <p>What are you selling?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="Item"
                        type="text"
                        ref={item}
                        defaultValue={itemData && item.current} />
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Costs</p>
                    <p>How much are you charging?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="$$$"
                        type="text"
                        ref={cost}
                        defaultValue={itemData && cost.current} />
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Photos</p>
                    <div className={FormCSS.photoInputs}>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo1 === 'object' || photo1?.length > 0 ) ?
                                <>
                                    <img src={itemData ? photo1 : URL.createObjectURL(photo1)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto1Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove icon" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg1">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload icon" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg1" type="file" onChange={onPhoto1Upload} />
                                </>
                            }
                        </div>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo2 === 'object' || photo2?.length > 0 ) ?
                                <>
                                    <img src={itemData ? photo2 : URL.createObjectURL(photo2)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto2Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove icon" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg2">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload icon" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg2" type="file" onChange={onPhoto2Upload} />
                                </>
                            }
                        </div>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo3 === 'object' || photo3?.length > 0 ) ?
                                <>
                                    <img src={itemData ? photo3 : URL.createObjectURL(photo3)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto3Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove icon" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg3">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload icon" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg3" type="file" onChange={onPhoto3Upload} />
                                </>
                            }
                        </div>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo4 === 'object' || photo4?.length > 0 ) ?
                                <>
                                    <img src={itemData ? photo4 : URL.createObjectURL(photo4)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto4Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove icon" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg4">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload icon" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg4" type="file" onChange={onPhoto4Upload} />
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Notes</p>
                    <textarea className={FormCSS.inputItem__textAreaInput}
                        placeholder="Notes"
                        ref={itemNotes}
                        defaultValue={itemData && itemNotes.current}></textarea>
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Tags</p>
                    <div id='box'>
                        {existingTags.map(tag =>
                            <button className={FormCSS.tagSelection + " " + (tags?.includes(tag) ? FormCSS.selected : FormCSS.notSelected)}
                                id={tag}
                                key={tag}
                                onClick={onTagSelection}>{tag}</button>
                        )}
                    </div>
                    <div className={FormCSS.addTagInput}>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="Enter a new tag"
                            type="text"
                            ref={newTag} />
                        <div className={FormCSS.addTagButton} onClick={onAddTag} onKeyDown={onAddTag} role="button" tabIndex={0}>Add</div>
                    </div>
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Preferred Delivery Method</p>
                    <div className={FormCSS.inputItem__checkboxes}>
                        <div className={FormCSS.inputItem__checkboxInput}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangePickUp} />
                            <span className={FormCSS.checkboxInput__label}>Pick Up</span>
                        </div>
                        <div className={FormCSS.inputItem__checkboxInput}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangeDropOff} />
                            <span className={FormCSS.checkboxInput__label}>Drop Off</span>
                        </div>
                        <div className={FormCSS.inputItem__checkboxInput}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangeLobby} />
                            <span className={FormCSS.checkboxInput__label}>Meet in Lobby</span>
                        </div>
                        <div className={FormCSS.inputItem__checkboxInput}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangeTransport} />
                            <span className={FormCSS.checkboxInput__label}>Transport Help</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={FormCSS.inputItem}>
                <input className={FormCSS.inputItem__submit}
                    type="submit"
                    value="Submit" />
            </div>
        </form>
    )
}

export default ItemForm