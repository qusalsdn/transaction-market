import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout title={data?.title} seoTitle={data?.title}>
      <div dangerouslySetInnerHTML={{ __html: post }} className="blog-post-content" />
    </Layout>
  );
};

// getStaticPaths는 동적인 URL을 갖는 페이지에서 getStaticProps를 사용할 때 필요하다.
export const getStaticPaths: GetStaticPaths = () => {
  const files = readdirSync("./posts").map((file) => {
    const [name, extension] = file.split(".");
    return { params: { slug: name } };
  });
  return {
    paths: files,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified().use(remarkParse).use(remarkHtml).process(content);
  return {
    props: { post: value, data },
  };
};

export default Post;
