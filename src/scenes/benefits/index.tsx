import HText from '@/shared/HText';
import { BenefitType, SelectedPage } from '@/shared/types';
import {
 HomeModernIcon,
 AcademicCapIcon,
 UserGroupIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Benefit from './Benefit';
import ActionButton from '@/shared/ActionButton';
import BenefitsPageGraphic from '../../assets/BenefitsPageGraphic.png';

const benefits: Array<BenefitType> = [
 {
  icon: <HomeModernIcon className="h-6 w-6" />,
  title: 'State of the Art Facilities',
  description:
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
 },
 {
  icon: <UserGroupIcon className="h-6 w-6" />,
  title: "100's of Diverse Classes",
  description:
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
 },
 {
  icon: <AcademicCapIcon className="h-6 w-6" />,
  title: 'Expert and Pro Trainers',
  description:
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
 },
];

const container = {
 hidden: {},
 visible: {
  transition: { staggerChildren: 0.2 },
 },
};

type Props = {
 setSelectedPage: (value: SelectedPage) => void;
};

function index({ setSelectedPage }: Props) {
 return (
  <section id="benefits" className="mx-auto min-h-full w-5/6 py-20">
   <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Benefits)}>
    {/* Header */}
    <motion.div
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true, amount: 0.5 }}
     transition={{ duration: 0.5 }}
     variants={{
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
     }}
     className="md:my-5 md:w-3/5"
    >
     <HText>MORE THAN JUST A GYM.</HText>
     <p className="my-5 text-sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
     </p>
    </motion.div>
    {/* Benefits */}
    <motion.div
     className="mt-5 items-center justify-between gap-8 md:flex"
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true, amount: 0.5 }}
     variants={container}
    >
     {benefits.map((benefit: BenefitType) => (
      <Benefit
       key={benefit.title}
       icon={benefit.icon}
       title={benefit.title}
       description={benefit.description}
       setSelectedPage={setSelectedPage}
      />
     ))}
    </motion.div>

    {/* Graphics and Description */}
    <div className="mt-16 items-center justify-between gap-20 md:mt-28 md:flex">
     {/* Graphic */}
     <img
      className="mx-auto"
      src={BenefitsPageGraphic}
      alt="benefits-page-graphic"
     />

     {/* Description */}
     <div>
      {/* Title */}
      <div className="relative">
       <div className="before:absolute before:-left-20 before:-top-20 before:z-[1] before:content-abstractwaves">
        <motion.div
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.5 }}
         transition={{ duration: 0.5 }}
         variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
         }}
        >
         <HText>
          MILLIONS OF HAPPY MEMBERS GETTING{' '}
          <span className="text-primary-500">FIT</span>
         </HText>
        </motion.div>
       </div>
      </div>
      {/* Description */}
      <motion.div
       initial="hidden"
       whileInView="visible"
       viewport={{ once: true, amount: 0.5 }}
       transition={{ delay: 0.2, duration: 0.5 }}
       variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
       }}
      >
       <p className="my-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
       </p>
       <p className="mb-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
       </p>
      </motion.div>
      {/* Button */}
      <div className="relative mt-16">
       <div className="before:=bottom-20 before:absolute before:right-40 before:z-[-1] before:content-sparkles">
        <ActionButton setSelectedPage={setSelectedPage}>Join Now</ActionButton>
       </div>
      </div>
     </div>
    </div>
   </motion.div>
  </section>
 );
}

export default index;
