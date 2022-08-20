import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
    return (
        <Link href={`/posts/${post.metadata.slug}`}>
            <a>
                <div className="border rounded-lg">
                    <Image
                        src={`/${post.metadata.image}`}
                        //src={`/nextjs-image.jpeg`}
                        width={1200}
                        height={700}
                        alt={post.metadata.title}
                    />
                </div>
                <div className="px-2 py-4">
                    <h1 className="font-bold text-lg">{post.title}</h1>
                    <span>{post.metadata.date}</span>
                </div>
            </a>
        </Link>
    );
};

export default PostCard;