import { useState, useEffect } from "react";
import Link from "next/link";
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import DOMPurify from "dompurify";


export default function Posts() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    
    useEffect(()=>{

        const fetchPosts = async ()=>{
            try{
                const res = await axios.get('/api/posts');
                setPosts(res.data);
            }catch(err){
                toast.error("Failed to load posts");
                console.log(err.response?.data?.error )
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    },[])
    
  if (loading) return <p>Loading...</p>;

 return (
  <div className="flex flex-col max-w-screen h-full overflow-x-hidden">
    <Header />
    <hr />
    <NavBar />
    <div className="flex flex-col items-center justify-evenly items-start w-full h-auto min-h-screen mx-auto bg-[var(--bg)] p-6 ml-[60px]">
      <h1 className="text-2xl text-[#626F47] font-bold mb-6 ml-3 italic">All Posts</h1>

      {posts.length === 0 ? (
        <p className="text-[var(--text)]">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="p-4 rounded-lg  w-1/2 text-[var(--text)]"
            >
              <div className="h-[20%] mb-3 w-full">
                <Link
                  href={`/posts/${post._id}`}
                  className="text-2xl hover:underline capitalize font-bold text-[var(--text)]"
                >
                  {post.title}
                </Link>
              </div>
              <div className="flex flex-col justify-between flex-1">
                <p className="text-[#393E46]">
                <span
                    dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content.slice(0, 200), {
                        ALLOWED_TAGS: ["b", "i", "em", "strong", "span", "img"],
                        ALLOWED_ATTR: ["src", "alt", "title", "width", "height"], // for images
                    }),
                    }}
                />
                ...
                </p>
                <small className="text-gray-500 font-medium my-3">
                    By {post.author?.name || "Unknown"}
                </small>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

}