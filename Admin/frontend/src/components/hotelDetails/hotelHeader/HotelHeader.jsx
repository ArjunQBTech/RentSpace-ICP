import React, { useCallback, useEffect, useState } from 'react';
import './hotelHeader.css';
import { FaStar } from "react-icons/fa";
import { LuCheckCircle } from "react-icons/lu";
import { useAuth } from '../../../utils/useAuthClient';
import { stringToFormattedDate } from '../../../utils/utils';
import { Link } from 'react-router-dom';

const HotelHeader = ({ hotel }) => {
  const [showGovID, setShowGovID] = useState(false);
  const { actors } = useAuth();
  const [reviews, setReviews] = useState({ count: 0, rating: 0 });

  const fetchHotelData = useCallback(async () => {
    const getRatingResponse = await actors?.reviewActor.getHotelRating(hotel?.hotelId);
    const getReviewCountResponse = await actors?.reviewActor.getAllReviewsOnHotel(hotel?.hotelId);

    if (getRatingResponse.ok && getReviewCountResponse.ok) {
      const reviewCount = getReviewCountResponse.ok.length;
      setReviews({ rating: getRatingResponse.ok, count: reviewCount });
    }
  }, [hotel, actors]);

  useEffect(() => {
    fetchHotelData();
    console.log("Hotel Details:", hotel);
  }, [hotel, fetchHotelData]);

  const toggleGovID = () => setShowGovID(!showGovID);

  return (
    <div className='hotel-details-header'>
      <div className='header-video-cont'>
        <img className='video-img' src='hotelImg.png' alt='Hotel' />
        <button className='header-video-cont-btn'>
          Contact Host @ &nbsp;
          <p className="header-host-email">{hotel?.userData?.userEmail}</p>
        </button>
      </div>

      <div className="header-hotel-data-cont">
        <div className="header-title-cont">
          <h2 className="header-hotel-name">{hotel?.hotelData?.hotelTitle}</h2>
        </div>
        
        <div className="header-rating-cont">
          <FaStar className="header-star-icon" />
          <p className="header-rating-text">
            {reviews.rating.toString()} • {reviews.count} reviews • {hotel?.hotelData?.hotelLocation}
          </p>
        </div>
        
        <div className="header-host-data-cont">
          <img className='host-img' src='host.png' alt='Host' />
          <div className="host-further-detail">
            <div className="host-img-head-cont">
              <p className='host-img-head'>Hosted by {hotel?.userData?.firstName} &nbsp;</p>
              <p className="host-join-date">
                Joined in {hotel?.userData ? new Date(Date.parse(hotel?.userData?.createdAt)).toUTCString() : ''}
              </p>
            </div>

            <div className="co-host-data-cont">
              <h5 className="co-host-label">Co Hosts</h5>
              <div className="co-host-card-cont">
                {['Vijay', 'Reena'].map((name, index) => (
                  <div key={index} className="co-host-card">
                    <img src="host.png" className="co-host-img" alt='Co-Host' />
                    <p className="co-host-name">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="header-host-gov-id-cont">
          <p className="host-id-label">Id Proof</p>
          <div className="host-id-cont">
            <a href={hotel?.userData?.govIDLink} target="_blank" className="host-id" style={showGovID ? { color: "black" } : {}}>
              {hotel?.userData?.userGovID}
            </a>
            <button type="button" className="host-id-view" onClick={toggleGovID}>
              {showGovID ? "Hide" : "View"}
            </button>
          </div>
          <div className="verify-cont">
            <LuCheckCircle className='host-verify-icon' />
            <p className="host-verify-text">Identity verified</p>
          </div>
        </div>

        <p className="header-host-about">
          Hi, I am {hotel?.userData?.firstName}! Peace and calm getaway for a day or two. Nice, clean, and tidy place to stay. The pool was cleaned twice as requested. All amenities were...
        </p>
      </div>
    </div>
  );
}

export default HotelHeader;
