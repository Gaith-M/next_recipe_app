import Link from 'next/link';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <nav className='header'>
        <div>
          <Link href='/'>
            <a>V's Recipes</a>
          </Link>
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default MyApp;
