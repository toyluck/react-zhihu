/**
 * Created by hyc on 2016/12/23.
 */

import React, { Component, PropTypes } from 'react';
import style from './headerbar.css'

class HeaderBar extends Component {
    render() {
        return (
            <div className={style.head_div}>
                <nav className={style.head_nav}>
                    <a href='/'  >首页</a>
                    <a href='/theme' >主题日报</a>
                    <a href='/about' >关于</a>
                </nav>
                <div className="nav_rail" >
                </div>
            </div>
        );
    }
}

HeaderBar.propTypes = {

};

export default HeaderBar;