import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import BlockContent from '@sanity/block-content-to-react';
import React from 'react';
// import {PortableText} from '@portabletext/react'
import {Toolbar} from '../../components/toolbar'

const urlFor = source => {
    return imageUrlBuilder({
      projectId: 'vy0p2rlv',
      dataset: 'production',
    }).image(source);
  };

export const Post = ({title, body, image}) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const imgBuilder = imageUrlBuilder({
        projectId: 'vy0p2rlv',
        dataset: 'production',
        });

        setImageUrl(imgBuilder.image(image));
    }, [image]);
    
    const serializers = {
        types: {
            block: (props) => {
                switch(props.node.style) {
                    case 'h1':
                        return <h1>{props.children}</h1>;
                    case 'h2':
                        return <h2>{props.children}</h2>;
                    case 'h3':
                        return <h3>{props.children}</h3>;
                    case 'h4':
                        return <h4>{props.children}</h4>;
                    case 'blockquote':
                        return <blockquote>{props.children}</blockquote>;
                    default:
                        return <p>{props.children}</p>;
                }
            },
            image: ({ node }) => {
                const { alt, asset, caption } = node;
                const url = urlFor(asset).width(1200).url();

                return (
                    <figure>
                        <img src={url} alt={alt} />
                        {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                );
            },
        },
    };

  return (
        <div>
            <Toolbar />
            <div className={styles.main}>
                <h1>{title}</h1>
                {imageUrl && <img className={styles.mainImage} src={imageUrl} />}
                <div className={styles.body}>
                    <BlockContent
                        blocks={body}
                        projectId="vy0p2rlv"
                        dataset="production"
                        serializers={serializers}
                        imageOptions={{ w: 800, h: 600, fit: 'max' }}
                    />
                </div> 

                {/* <PortableText value={body}/> */}
            </div>
        </div>
    );
};

export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;
    
    if (!pageSlug) {
      return {
        notFound: true
      }
    }
  
    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://vy0p2rlv.api.sanity.io/v1/data/query/production?query=${query}`;
  
    const result = await fetch(url).then(res => res.json());
    const post = result.result[0];
  
    if (!post) {
      return {
        notFound: true
      }
    } else {
      return {
        props: {
          body: post.body,
          title: post.title,
          image: post.mainImage,
        }
      }
    }
  };

export default Post;