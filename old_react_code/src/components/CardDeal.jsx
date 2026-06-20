import React from 'react'
import { card } from '../assets'
import Button from './Button'
import styles, { layout } from '../style'

const CardDeal = () => {
  return (
    <section className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>Transform your business <br className='sm:block hidden'/>with digital solutions.</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Leverage our expertise in digital transformation to modernize your business operations. 
          From custom software development to data analytics and automation, we help you stay 
          ahead in the digital age.
        </p>
        <Button styles='mt-10'/>
      </div>
      <div className={layout.sectionImg}>
        <img
          src={card}
          alt='card'
          className='w-[100%] h-[100%]'
        />
      </div>
    </section>
  )
}

export default CardDeal
