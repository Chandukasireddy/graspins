import React, { useEffect } from 'react'
import styles from '../style'
import { Navbar, Footer } from './index'

const JobCard = ({ title, description, requirements }) => (
  <div className="bg-black-gradient-2 p-8 rounded-[20px] mb-8">
    <h3 className="font-poppins font-semibold text-white text-[24px] leading-[32px] mb-4">
      {title}
    </h3>
    <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px] mb-4">
      {description}
    </p>
    <div className="mt-4">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[24px] mb-2">
        Requirements:
      </h4>
      <ul className="list-disc list-inside text-dimWhite">
        {requirements.map((req, index) => (
          <li key={index} className="mb-2">{req}</li>
        ))}
      </ul>
    </div>
    <button className="bg-blue-gradient py-2 px-6 rounded-[10px] text-white font-poppins font-medium text-[16px] mt-6">
      Apply Now
    </button>
  </div>
)

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const positions = [
    {
      title: "UI/UX Developer Intern",
      description: "Join our creative team as a UI/UX Developer Intern and help create beautiful, intuitive user interfaces. You'll work closely with our design and development teams to bring innovative solutions to life.",
      requirements: [
        "Currently pursuing a degree in Design, Computer Science, or related field",
        "Basic understanding of UI/UX principles and design tools",
        "Familiarity with HTML, CSS, and JavaScript",
        "Strong portfolio demonstrating design skills",
        "Excellent communication and collaboration abilities"
      ]
    },
    {
      title: "Web Developer Intern",
      description: "We're looking for a Web Developer Intern to join our development team. You'll work on real projects, learn modern web technologies, and contribute to building scalable web applications.",
      requirements: [
        "Currently pursuing a degree in Computer Science or related field",
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Understanding of web development concepts",
        "Familiarity with version control systems",
        "Eagerness to learn and grow in a fast-paced environment"
      ]
    }
  ]

  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <div className="text-center mb-12">
            <h1 className="font-poppins font-semibold text-white text-[48px] leading-[60px] mb-4">
              Join Our Team
            </h1>
            <p className="font-poppins font-normal text-dimWhite text-[18px] leading-[30px] max-w-[800px] mx-auto">
              Be part of our innovative team and help shape the future of technology. 
              We're always looking for talented individuals who are passionate about creating 
              impactful solutions.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto">
            {positions.map((position, index) => (
              <JobCard key={index} {...position} />
            ))}
          </div>
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Careers 