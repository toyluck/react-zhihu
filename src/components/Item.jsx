import React from 'react'

import style from './item.css'



const Item = ({story, itemClick}) => {

    

    return (
        <div className={style.item_div} onClick={itemClick}>
            <img className={style.item_img}
                src={story.images[0]} alt={story.title} />
            <span className={style.item_span}>
                {story.title}
            </span>
        </div>
    )
}


export default Item