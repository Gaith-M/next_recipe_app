import Link from 'next/link';
import Head from 'next/head';
import { sanityClient, urlFor } from '../lib/sanity';

const recipesQuery = `*[_type == "recipe"]{
  _id,
  name,
  slug,
  mainImage
}`;

const index = ({ recipes }) => {
  return (
    <>
      <Head>
        <title>V's Kitchen</title>
        <meta name='description' content='best recipes website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1>Welcome To V's Kitchen</h1>
      <ul className='recipes-list'>
        {recipes?.length > 0 &&
          recipes.map((recipe) => {
            return (
              <li key={recipe._id} className='recipe-card'>
                <Link href={`/recipes/${recipe.slug.current}`}>
                  <a>
                    <img
                      src={urlFor(recipe.mainImage).url()}
                      alt={recipe?.name}
                    />
                    <span>{recipe.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default index;

export const getStaticProps = async () => {
  const recipes = await sanityClient.fetch(recipesQuery);
  return {
    props: {
      recipes,
    },
  };
};
