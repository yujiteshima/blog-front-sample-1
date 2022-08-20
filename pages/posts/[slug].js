import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import { createElement } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { loadPosts } from '../../utils/index';
export async function getStaticProps({ params }) {
    const posts = await loadPosts();
    const file = posts.filter((v) => {
        return v.metadata.slug === params.slug;
    })
    const metadata = file[0].metadata;
    const content = file[0].content;
    const result = await unified()
        .use(remarkParse)
        .use(remarkPrism, {
            /* options */
            plugins: ['line-numbers'],
        })
        .use(remarkToc, {
            heading: '目次だよ',
        })
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(content);
    return { props: { frontMatter: metadata, content: result.toString() } };
}

export const getStaticPaths = async() => {
    const posts = await loadPosts();
    const paths = posts.map((posts) => ({
        params: {
            slug: posts.metadata.slug,
        },
    }));
    return {
        paths,
        fallback: false,
    };
}
const toReactNode = (content) => {
    return unified()
        .use(rehypeParse, {
            fragment: true,
        })
        .use(rehypeReact, {
            createElement,
        })
        .processSync(content).result;
};

const Post = ({ frontMatter, content }) => {
    return (
        <>
            <NextSeo
                title={frontMatter.title}
                description={frontMatter.description}
                openGraph={{
                    type: 'website',
                    url: `http:localhost:3000/posts/${frontMatter.slug}`,
                    title: frontMatter.title,
                    description: frontMatter.description,
                    images: [
                        {
                            url: `https://localhost:3000/${frontMatter.image}`,
                            width: 1200,
                            height: 700,
                            alt: frontMatter.title,
                        },
                    ],
                }}
            />
        <div className="prose prose-lg max-w-none">
            <div className="border">
                <Image
                    src={`/${frontMatter.image}`}
                    width={1200}
                    height={700}
                    alt={frontMatter.title}
                />
            </div>
            <h1 className="mt-12">{frontMatter.title}</h1>
            <span>{frontMatter.date}</span>
            {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
            </div>
            {toReactNode(content)}
        </>
    );
};

export default Post;