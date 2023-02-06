import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="블로그" seoTitle="블로그">
      <h1 className="textlg text-center font-bold">최근 게시물</h1>
      {posts.map((post, index) => {
        return (
          <div key={index} className="my-2 text-center">
            <Link href={`/blog/${post.slug}`}>
              <span className="text-lg text-red-500">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </Layout>
  );
};

// getStaticProps는 딱 한 번만 실행된다.
export const getStaticProps: GetStaticProps = () => {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  return {
    props: { posts: blogPosts },
  };
};

export default Blog;
