import { useRouter } from 'next/router';
import styles from '../styles/Toolbar.module.css';

export const Toolbar = () => {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <div onClick={() => router.push('/')}>Home</div>
      <div onClick={() => window.location.href = 'https://iothingss.com/about.html'}>About Us</div>
      <div onClick={() => window.location.href = 'https://iothingss.com/contact.html'}>Contact Us</div>
    </div>
  );
};

