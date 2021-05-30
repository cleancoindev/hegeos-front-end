import React from 'react';
import holder from '../images/icon/features-icon-1.png';
import writer from '../images/icon/features-icon-2.png';
import tokenHolder from '../images/icon/features-icon-3.png';
import benefits from '../images/benefits-6.png';

function Features(props) {
    return (
        <section className="hegeos-features-area">
            {/*(<hr />)*/}
            <div className="container-fluid">
                <div className="row">
                    {/*(<div className="col-lg-4">)*/}
                    <div className="col-lg-6">
                        <div className="hegeos-features-item text-center mt-30">
                            <img src={holder} alt="icon" />
                            <h3 className="title">HOLDERS</h3>
                            <p>
                                <b> Trade EOS call and put options.</b> <br />
                                Non-custodial options with on-chain settlement. Choose any strike
                                price, exercise at any moment.
                            </p>
                        </div>
                    </div>
                    {/*(<div className="col-lg-4">)*/}
                    <div className="col-lg-6">
                        <div className="hegeos-features-item text-center mt-30">
                            <img src={writer} alt="icon" />
                            <h3 className="title">WRITERS</h3>
                            <p>
                                <b> Write EOS call and put options.</b> <br /> Provide liquidity and
                                start earning yield on EOS. Auto diversiﬁcation of capital
                                allocation.
                            </p>
                        </div>
                    </div>
                    {/*(<div className="col-lg-4">
                        <div className="hegeos-features-item text-center mt-30 item-3">
                            <img src={tokenHolder} alt="icon" />
                            <h3 className="title">TOKEN HOLDERS</h3>
                            <p>
                                <b> Earn protocol's fees in staking rewards</b> <br /> Receive
                                liquidity mining & utilization rewards in HEGEOS.IO. Participate in
                                staking and earn EOS.
                            </p>
                        </div>
                    </div>)*/}
                </div>
            </div>

            {/*(<div className="item-1">
                <hr />

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hegeos-trade-thumb">
                                <img src={benefits} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hegeos-trade-content">
                                <h3 className="title">Mauris fringilla mauris eget iaculis</h3>
                                <p>
                                    Nunc accumsan efficitur libero, vel commodo lorem. In eget
                                    sodales urna. Nam quis condimentum magna. Nulla aliquam, urna ut
                                    volutpat viverra, sapien odio ornare arcu, sit amet imperdiet
                                    ipsum sem non tellus. Mauris dictum condimentum arcu, sed
                                    finibus ante dapibus sed. Fusce dictum maximus mi, dapibus
                                    sagittis ipsum imperdiet quis. Etiam vitae neque finibus,
                                    ultricies est et, dictum diam. Cras molestie, nunc eu blandit
                                    dignissim, felis urna commodo nisl, sit amet auctor urna mauris
                                    nec tellus. Nullam sodales leo id odio gravida, vitae ultrices
                                    ligula consequat. Vivamus rhoncus pharetra pharetra. In molestie
                                    elit in consequat egestas.{' '}
                                </p>
                                <p>
                                    Nunc nec lectus luctus ex eleifend aliquet. Donec nibh neque,
                                    placerat ac libero eget, varius consectetur sapien. Fusce eget
                                    eros ornare lorem ornare aliquet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)*/}
        </section>
    );
}

export default Features;
