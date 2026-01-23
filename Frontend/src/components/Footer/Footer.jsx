import React from 'react'
import style from './footer.module.css'
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className={style.Footer} id="Footer">
      <div className={style.FooterContent}>
        <div className={style.FooterContentLeft}>
          <img src={assets.logo} alt="" className={style.logo} />
          <p>Heavenlei Bites offers a delightful assortment of bite-sized goodies that are perfect for any occasion. Taste the heaven in every bite!</p>
          <div className={style.FooterSocial}>
            <a href="https://www.facebook.com/share/1DkieNVxWn/" target="_blank" rel="noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
          </div>
        </div>
        <div className={style.FooterContentMiddle}>
          <h2>Heavenlei Bites</h2>
          <ul>
            <li>
              <a href="https://www.facebook.com/share/1DkieNVxWn/" target="_blank" rel="noreferrer">Facebook Page</a>
            </li>
          </ul>
        </div>
        <div className={style.FooterContentRight}>
          <h2>Get In Touch</h2>
          <ul>
            <li>09611101341</li>
            <li>
              <a href="mailto:heavenleibites@gmail.com">heavenleibites@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        Heavenlei Bites - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer