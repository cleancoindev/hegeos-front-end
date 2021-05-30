import React from 'react';
import bannerBackground from '../images/shape/color-bg-2.png';
import midBackground from '../images/shape/color-bg.png';

function Backgrounds(props) {
    return (
        <div>
            <div className="banner-color">
                <img src={bannerBackground} alt="" />
            </div>
            <div className="hegeos-color">
                <img src={midBackground} alt="" />
            </div>
        </div>
    );
}

export default Backgrounds;
