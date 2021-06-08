import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from '../../lib/sanity';

const recipeQuery = `
  *[_type == 'recipe' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
      _key,
      unit,
      wholeNumber,
      fraction,
      ingredient->{
        name
      }
    },
    instructions,
    likes
  }
`;

const recipe = ({ data, preview }) => {
  // const { recipe } = usePreviewSubscription(recipeQuery, {
  //   params: { slug: data?.recipe.slug.current },
  //   initialData: data,
  //   enabled: preview,
  // });

  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading</p>;
  }

  const { recipe } = data;

  const [likes, setLikes] = useState(data?.recipe?.likes);

  const addLike = async () => {
    const res = await fetch('/api/handle_likes', {
      method: 'POST',
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((err) => console.log(err));

    const data = await res.json();
    setLikes(data.likes);
  };

  return (
    <article className='recipe'>
      <h1>{recipe.name}</h1>
      <button className='like-button' onClick={addLike}>
        likes: {likes}
      </button>
      <main className='content'>
        <img src={urlFor(recipe?.mainImage).url()} alt={recipe?.name} />

        <div className='breakdown'>
          <ul className='ingredients'>
            {recipe.ingredient?.map((item) => (
              <li key={item._key} className='ingredient'>
                {item?.wholeNumber} {item?.fraction} {item?.unit}{' '}
                {item?.ingredient.name}
              </li>
            ))}
          </ul>
          <PortableText
            blocks={recipe?.instructions}
            className='instructions'
          />
        </div>
      </main>
    </article>
  );
};

export const getStaticPaths = async () => {
  const paths = await sanityClient.fetch(
    `*[_type == 'recipe' && defined(slug.current)]{
      'params': {
        'slug': slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return {
    props: { data: { recipe, preview: true } },
  };
};

export default recipe;
