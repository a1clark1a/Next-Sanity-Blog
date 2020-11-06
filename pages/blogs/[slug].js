import { Row, Col } from "react-bootstrap"
import moment from "moment"

import PageLayout from "components/PageLayout"
import BlogHeader from "components/BlogHeader"
import BlogContent from "components/BlogContent"

import { urlFor } from "lib/api"
import { getBlogBySlug, getAllBlogs } from "lib/api"

const BlogDetail = ({ blog }) => {
  return (
    <PageLayout className="blog-detail-page">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <BlogHeader
            title={blog.title}
            subtitle={blog.subtitle}
            coverImage={urlFor(blog.coverImage).height(600).url()}
            date={moment(blog.date).format("LLL")}
            author={blog.author}
          />
          <hr />
          {blog.content && <BlogContent content={blog.content} />}
        </Col>
      </Row>
    </PageLayout>
  )
}

// Loading pages dynamically using getServerSideProps

// export async function getServerSideProps({ params }) {
//     const blog = await getBlogBySlug(params.slug)
//     return {
//       props: { blog },
//     }
//   }

// To generate dynamice pages into static pages you need to use getStaticProps and use getStaticPaths
// because your page needs to be created at build time when you are running NPM run build than when you are running npm run dev
// it has to fetch data to construct the HTML pages and in order to construct all of our detail pages it has to have the same slugs as we are fetching
// this way this will be dynamically loading pages during development and statically loading these pages during build time

export async function getStaticProps({ params }) {
  console.log("Fethcing blog by ", params.slug)
  const blog = await getBlogBySlug(params.slug)
  return {
    props: { blog },
  }
}

export async function getStaticPaths() {
  const blogs = await getAllBlogs()
  console.log("Gettings paths for every page")
  return {
    paths: blogs?.map((blog) => ({ params: { slug: blog.slug } })),
    fallback: false, // if none of the paths page is not found this should be a fallback page like a 404 error not found page
  }
}

export default BlogDetail
